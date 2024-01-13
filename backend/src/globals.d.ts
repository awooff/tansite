declare module NodeJS {
  export interface ProcessEnv {
    PORT: number
    PUBLIC_URL: string
    SESSION_SECRET: string
    DATABASE_URL: string
  }
}
