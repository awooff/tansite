import { Computer } from '@/app/computer'
import * as zod from 'zod'
import GameException from '../exceptions/game.exception'

export interface ProcessData {
  custom: Record<string, any>
  userId: number
  sessionId: string
  computer: string
  softwareId: string
  ipAddress: string
}

export interface ProcessParameters {
  custom?: Record<string, (z: typeof zod) => zod.ZodString | zod.ZodNumber | zod.ZodBoolean>
  userId?: boolean
  sessionId?: boolean
  computer?: boolean
  softwareId?: boolean
  ipAddress?: boolean
}

export interface ProcessSettings {
  localProcessOnly?: boolean
  parameters?: ProcessParameters
}

export interface Process {
  settings?: ProcessSettings
  delay?: (computer: Computer | null, executor: Computer, data: any) => Promise<number>
  before: (computer: Computer | null, executor: Computer, data: any) => Promise<boolean>
  after: (computer: Computer | null, executor: Computer, data: any) => Promise<void>
}
