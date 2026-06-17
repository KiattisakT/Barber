import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AdminPage } from './pages/admin-page'
import { CustomerBookingPage } from './pages/customer-booking-page'
import { queueItems, type QueueItem } from './lib/mock-data'

const App = () => {
  const [items, setItems] = useState<QueueItem[]>(queueItems)

  const addQueueItem = (item: QueueItem) => {
    setItems((currentItems) => {
      if (currentItems.some((currentItem) => currentItem.id === item.id || currentItem.queueNumber === item.queueNumber)) {
        return currentItems
      }

      return [item, ...currentItems]
    })
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/book/dream-catcher" replace />} />
      <Route path="/book/dream-catcher" element={<CustomerBookingPage items={items} onAddQueueItem={addQueueItem} />} />
      <Route path="/admin" element={<AdminPage items={items} setItems={setItems} />} />
      <Route path="*" element={<Navigate to="/book/dream-catcher" replace />} />
    </Routes>
  )
}

export default App
