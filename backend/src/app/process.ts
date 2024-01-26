import { Process } from '@prisma/client'
import { Computer } from './computer'
import { server } from '../index'
import processes from '@/app/processes/'
import z from 'zod'
import { ProcessParameters } from '@/lib/types/process.type'
export type ProcessType = keyof typeof processes

export class ComputerProcess {
  public computer?: Computer
  public processId: string
  public process?: Process

  constructor(processId: string, process?: Process, computer?: Computer) {
    this.processId = processId

    if (process != null) { this.process = process }
    if (computer != null) { this.computer = computer }
  }

  public async load() {
    this.process = await server.prisma.process.findFirstOrThrow({
      where: {
        id: this.processId,
        gameId: process.env.CURRENT_GAME_ID
      }
    })

    if (this.computer == null) {
      this.computer = new Computer(this.process.computerId)
      await this.computer.load()
    } else {
      this.computer.process = this.computer.process.map((process) => {
        if (process.processId === this.processId) { return this }

        return process
      })
    }
  }
}

export const zodObjects = {
  'computer': async () => {
  return { z: z.string(), key: 'computerId' }
  },
  'ipAddress': async () => {
    return { z: z.string(), key: 'ip' }
  },
  'sessionId': async () => {
  return { z: z.string(), key: 'sessionId' }
  },
  'softwareId': async () => {
      return { z: z.string(), key: 'softwareId' }
  },
  'userId': async () => {
      return { z: z.number(), key: 'userId' }
  },
  'custom': async (data) => {

    let custom = {} as any

    await Promise.all(Object.keys(data).map(async (key) => {
      custom[key] = await data[key]()
    }))

    return {
      z: z.object(custom), key: 'custom' }
  }
} as Record<keyof ProcessParameters, (data?: any) => Promise<{
  z: unknown,
  key: string
}>>

export const getProcessZodObject = async (type: ProcessType, executor?: Computer) => {
  let process = processes[type];
  let obj: any = {};

  if (!process.settings?.parameters)
    return z.object({})

  await Promise.all(Object.keys(process.settings?.parameters).map(async (key, index) => {
    let result = await zodObjects[key as keyof ProcessParameters](process.settings?.parameters)
    obj[result.key] = result.z;
  }));

  return z.object(obj)
}
