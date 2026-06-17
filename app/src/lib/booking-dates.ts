export const thaiShortMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
export const thaiWeekdays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์']
export const bookingBaseDate = new Date(2026, 4, 24)

export const getBookingDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const getBookingDates = (weekOffset: number) => {
  return Array.from({ length: 7 }, (_, index) => {
    const dayOffset = weekOffset * 7 + index
    const date = new Date(bookingBaseDate)
    date.setDate(bookingBaseDate.getDate() + dayOffset)

    const weekday = dayOffset === 0 ? 'วันนี้' : dayOffset === 1 ? 'พรุ่งนี้' : thaiWeekdays[date.getDay()]
    const dateNumber = String(date.getDate())
    const shortMonth = thaiShortMonths[date.getMonth()]

    return {
      value: getBookingDateKey(date),
      weekday,
      date: dateNumber,
      fullLabel: `${weekday}, ${dateNumber} ${shortMonth}`,
      isToday: dayOffset === 0,
    }
  })
}

export const timeToMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number)
  return hour * 60 + minute
}

export const rangesOverlap = (start: number, end: number, compareStart: number, compareEnd: number) => {
  return start < compareEnd && end > compareStart
}
