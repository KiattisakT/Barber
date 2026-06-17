type ServerEnv = {
  port: number
  databaseUrl: string | null
  nodeEnv: string
}

const parsePort = (value: string | undefined) => {
  if (!value) return 4000

  const parsedPort = Number.parseInt(value, 10)
  return Number.isFinite(parsedPort) ? parsedPort : 4000
}

export const env: ServerEnv = {
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL ?? null,
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
