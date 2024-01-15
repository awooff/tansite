import { Computer } from "@/app/computer";

export type ProcessParameters = {
  settings?: {
    localProcessOnly?: boolean;
  }
  custom?: Record<string, 'email' | 'string' | 'number'>;
  userId?: boolean;
  sessionId?: boolean;
  computerId?: boolean;
  softwareId?: boolean;
  ipAddress?: boolean
}

export type Process = {
  parameters?: () => ProcessParameters;
  delay: (computer: Computer, executor: Computer, data: Record<string, any>) => Promise<number>
  before: (computer: Computer, executor: Computer, data: Record<string, any>) => Promise<boolean | string>
  after: (computer: Computer, executor: Computer, data: Record<string, any>) => Promise<void>
}