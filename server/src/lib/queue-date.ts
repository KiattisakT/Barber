const queueDatePattern = /^\d{4}-\d{2}-\d{2}$/

export const getBangkokDateValue = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return formatter.format(date)
}

export const parseQueueDateValue = (value: string) => {
  if (!queueDatePattern.test(value)) {
    return null
  }

  return new Date(`${value}T00:00:00.000Z`)
}

export const getQueueDate = (value?: string) => {
  const dateValue = value ?? getBangkokDateValue()
  return parseQueueDateValue(dateValue)
}

export const formatQueueDate = (date: Date) => date.toISOString().slice(0, 10)
