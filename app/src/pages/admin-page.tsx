import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { AdminHeader } from '../features/admin/admin-header'
import { AdminQueueBoard } from '../features/admin/admin-queue-board'
import { AdminSidebar } from '../features/admin/admin-sidebar'
import { AdminSummary } from '../features/admin/admin-summary'
import { BlockedTimeCard } from '../features/admin/blocked-time-card'
import { FocusActionCard } from '../features/admin/focus-action-card'
import { NowNextCards } from '../features/admin/now-next-cards'
import { QueueDetailPanel } from '../features/admin/queue-detail-panel'
import { TattooReviewCard } from '../features/admin/tattoo-review-card'
import { WalkInDialog } from '../features/admin/walk-in-dialog'
import { createAdminBlockedTime, createAdminWalkIn, fetchAdminQueueToday, updateAdminQueueItemStatus } from '../lib/admin-queue-api'
import { appConfig, toBangkokDateTimeIso } from '../lib/app-config'
import { barberServices, blockedTimes, queueItems, type BlockedTime, type QueueItem, type QueueStatus } from '../lib/mock-data'
import {
  createWalkInQueueItem,
  getActiveQueueItems,
  getCheckedInItems,
  getInProgressItem,
  getNextCustomer,
  getPendingTattooItems,
  getVisibleQueueItems,
  transitionQueueStatus,
  type QueueView,
} from '../lib/queue-system'

type QueueItemsSetter = Dispatch<SetStateAction<QueueItem[]>>

type AdminPageProps = {
  items: QueueItem[]
  setItems: QueueItemsSetter
}

export const AdminPage = ({ items, setItems }: AdminPageProps) => {
  const [dailyBlocks, setDailyBlocks] = useState<BlockedTime[]>(blockedTimes)
  const [selectedQueueId, setSelectedQueueId] = useState(queueItems.find((item) => item.status === 'in_progress')?.id ?? queueItems[0]?.id)
  const [isWalkInOpen, setIsWalkInOpen] = useState(false)
  const [queueView, setQueueView] = useState<QueueView>('active')
  const [walkInCustomerName, setWalkInCustomerName] = useState('ลูกค้าหน้าร้าน')
  const [walkInServiceId, setWalkInServiceId] = useState(barberServices[0]?.id ?? 'classic-haircut')
  const [walkInNote, setWalkInNote] = useState('เพิ่มจากหน้า admin mock')
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'offline'>('loading')
  const [apiError, setApiError] = useState<string | null>(null)

  const activeItems = getActiveQueueItems(items)
  const pendingTattoo = getPendingTattooItems(items)
  const checkedIn = getCheckedInItems(items)
  const inProgress = getInProgressItem(items)
  const nextCustomer = getNextCustomer(items)
  const selectedItem = items.find((item) => item.id === selectedQueueId) ?? inProgress ?? nextCustomer ?? items[0]
  const visibleItems = useMemo(() => getVisibleQueueItems(items, queueView), [items, queueView])

  const loadAdminQueue = async () => {
    setApiStatus('loading')

    try {
      const result = await fetchAdminQueueToday()
      setItems(result.items)
      setDailyBlocks(result.blockedTimes)
      setSelectedQueueId((currentSelectedQueueId) => currentSelectedQueueId ?? result.items.find((item) => item.status === 'in_progress')?.id ?? result.items[0]?.id)
      setApiStatus('connected')
      setApiError(null)
    } catch (error) {
      setApiStatus('offline')
      setApiError(error instanceof Error ? error.message : 'โหลด backend queue ไม่สำเร็จ')
    }
  }

  useEffect(() => {
    void loadAdminQueue()
  }, [])

  const updateStatus = async (id: string, status: QueueStatus) => {
    if (apiStatus === 'connected') {
      try {
        await updateAdminQueueItemStatus(id, status)
        await loadAdminQueue()
        setSelectedQueueId(id)
        return
      } catch (error) {
        setApiStatus('offline')
        setApiError(error instanceof Error ? error.message : 'อัปเดตสถานะผ่าน backend ไม่สำเร็จ')
      }
    }

    setItems((currentItems) => transitionQueueStatus(currentItems, id, status))
    setSelectedQueueId(id)
  }

  const addWalkIn = async () => {
    if (apiStatus === 'connected') {
      try {
        await createAdminWalkIn({
          serviceId: walkInServiceId,
          customerName: walkInCustomerName.trim() || 'ลูกค้าหน้าร้าน',
          phone: '-',
          internalNote: walkInNote.trim() || 'เพิ่มจากหน้า admin',
        })
        await loadAdminQueue()
        setIsWalkInOpen(false)
        return
      } catch (error) {
        setApiStatus('offline')
        setApiError(error instanceof Error ? error.message : 'เพิ่ม walk-in ผ่าน backend ไม่สำเร็จ')
      }
    }

    const nextWalkIn = createWalkInQueueItem(items, checkedIn.length)
    const selectedWalkInService = barberServices.find((service) => service.id === walkInServiceId) ?? barberServices[0]

    setItems((currentItems) => [
      {
        ...nextWalkIn,
        customer: walkInCustomerName.trim() || 'ลูกค้าหน้าร้าน',
        service: selectedWalkInService.name,
        duration: selectedWalkInService.duration,
        note: walkInNote.trim() || 'เพิ่มจากหน้า admin mock',
      },
      ...currentItems,
    ])
    setSelectedQueueId(nextWalkIn.id)
    setIsWalkInOpen(false)
  }

  const addQuickBlockedTime = async () => {
    const quickBlockStartsAt = toBangkokDateTimeIso(appConfig.queueDate, '18:30')
    const quickBlockEndsAt = toBangkokDateTimeIso(appConfig.queueDate, '19:00')
    if (apiStatus === 'connected') {
      try {
        await createAdminBlockedTime({
          startsAt: quickBlockStartsAt,
          endsAt: quickBlockEndsAt,
          reason: 'พัก/เคลียร์อุปกรณ์จากหน้า queue desk',
        })
        await loadAdminQueue()
        return
      } catch (error) {
        setApiStatus('offline')
        setApiError(error instanceof Error ? error.message : 'block เวลาผ่าน backend ไม่สำเร็จ')
      }
    }

    const nextBlock: BlockedTime = {
      id: `quick-block-${Date.now()}`,
      time: '18:30-19:00',
      reason: 'พัก/เคลียร์อุปกรณ์จากหน้า queue desk',
      staff: 'Arm',
    }

    setDailyBlocks((currentBlocks) => [nextBlock, ...currentBlocks])
  }

  return (
    <main className="min-h-screen bg-admin-shell text-paper lg:grid lg:grid-cols-[248px_1fr]">
      <AdminSidebar
        queueView={queueView}
        activeItemsCount={activeItems.length}
        dailyBlocksCount={dailyBlocks.length}
        onQueueViewChange={setQueueView}
        onOpenWalkIn={() => setIsWalkInOpen(true)}
      />

      <section className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AdminHeader onAddBlock={addQuickBlockedTime} onOpenWalkIn={() => setIsWalkInOpen(true)} />
          <div className="mt-3 text-xs text-stone">
            แหล่งข้อมูล: {apiStatus === 'connected' ? 'backend' : apiStatus === 'loading' ? 'กำลังโหลด' : 'mock/local state'}
            {apiError ? <span className="ml-2 text-copper">{apiError}</span> : null}
          </div>
          <FocusActionCard inProgress={inProgress} nextCustomer={nextCustomer} onUpdateStatus={updateStatus} onOpenWalkIn={() => setIsWalkInOpen(true)} />
          <AdminSummary
            inProgress={inProgress}
            checkedInCount={checkedIn.length}
            pendingTattooCount={pendingTattoo.length}
            activeItemsCount={activeItems.length}
            totalItemsCount={items.length}
          />

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-5">
              <NowNextCards inProgress={inProgress} nextCustomer={nextCustomer} onUpdateStatus={updateStatus} />
              <AdminQueueBoard
                visibleItems={visibleItems}
                selectedItem={selectedItem}
                inProgress={inProgress}
                queueView={queueView}
                onQueueViewChange={setQueueView}
                onSelectQueue={setSelectedQueueId}
                onUpdateStatus={updateStatus}
              />
            </section>

            <aside className="space-y-5">
              <QueueDetailPanel selectedItem={selectedItem} inProgress={inProgress} onUpdateStatus={updateStatus} />
              <TattooReviewCard pendingTattoo={pendingTattoo} onUpdateStatus={updateStatus} />
              <BlockedTimeCard dailyBlocks={dailyBlocks} onAddBlock={addQuickBlockedTime} />
            </aside>
          </div>
        </div>
      </section>

      <WalkInDialog
        isOpen={isWalkInOpen}
        services={barberServices}
        customerName={walkInCustomerName}
        serviceId={walkInServiceId}
        note={walkInNote}
        onCustomerNameChange={setWalkInCustomerName}
        onServiceIdChange={setWalkInServiceId}
        onNoteChange={setWalkInNote}
        onClose={() => setIsWalkInOpen(false)}
        onAddWalkIn={addWalkIn}
      />
    </main>
  )
}
