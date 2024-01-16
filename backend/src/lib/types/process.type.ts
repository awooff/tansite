import { Computer } from '@/app/computer'

export interface ProcessParameters {
  settings?: {
    localProcessOnly?: boolean
  }
  custom?: Record<string, 'email' | 'string' | 'number'>
  userId?: boolean
  sessionId?: boolean
  computerId?: boolean
  softwareId?: boolean
  ipAddress?: boolean
}

export interface Process {
  parameters?: () => ProcessParameters
  delay: (computer: Computer, executor: Computer, data: any) => Promise<number>
  before: (computer: Computer, executor: Computer, data: any) => Promise<boolean | string>
  after: (computer: Computer, executor: Computer, data: any) => Promise<void>
}
