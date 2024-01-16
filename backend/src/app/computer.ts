import { HardwareTypes, Memory, Prisma } from '@prisma/client'
import { server } from '../index'
import { Software } from './software'

export interface ComputerData {
  title?: string
  description?: string
  markdown?: string
  hardwareLimits?: Record<HardwareTypes, number>

}

export class Computer {
  public readonly computerId: string
  public data: ComputerData | undefined
  public softwares: Software[] = []

  public computer: Prisma.ComputerGetPayload<{
    include: {
      hardware: true
      software: true
    }
  }> = {} as any

  public constructor (computerId: string) {
    this.computerId = computerId
  }

  public async exists () {
    return !((await server.prisma.computer.findFirst({
      where: {
        id: this.computerId
      }
    })) == null)
  }

  public async addMemory (key: string, type: string, value?: number, data?: any) {
    return await server.prisma.memory.create({
      data: {
        userId: this.computer.userId,
        gameId: process.env.CURRENT_GAME_ID,
        type,
        computerId: this.computerId,
        key,
        data,
        value
      }
    })
  }

  public async getUserPreferences () {
    return await server.prisma.preferences.findFirst({
      where: {
        userId: this.computer.userId
      }
    })
  }

  public async findMemory (type: string) {
    return await server.prisma.memory.findFirst({
      where: {
        userId: this.computer.userId,
        gameId: process.env.CURRENT_GAME_ID,
        type
      }
    })
  }

  public async getMemory (key: string) {
    return await server.prisma.memory.findFirst({
      where: {
        userId: this.computer.userId,
        gameId: process.env.CURRENT_GAME_ID,
        key
      }
    })
  }

  public async addUserMemory (key: string, type: string, userId: number, data?: any, value?: any) {
    return await server.prisma.memory.create({
      data: {
        userId,
        gameId: process.env.CURRENT_GAME_ID,
        type,
        computerId: this.computerId,
        key,
        data,
        value
      }
    })
  }

  public async findUserMemory (type: string, userId: number) {
    return await server.prisma.memory.findFirst({
      where: {
        userId,
        gameId: process.env.CURRENT_GAME_ID,
        type
      }
    })
  }

  public async getUserMemory (key: string, userId: number) {
    return await server.prisma.memory.findFirst({
      where: {
        userId,
        gameId: process.env.CURRENT_GAME_ID,
        key
      }
    })
  }

  public async log (message: string, from?: Computer) {
    from = from || this;
  }

  public get ip () {
    return this.computer.ip
  }

  public async changeIp (ip: string) {
    await this.update({
      ip: ip || generateIpAddress()
    })
  }

  public async update (data: Prisma.ComputerUpdateInput) {
    await server.prisma.computer.update({
      where: {
        id: this.computerId
      },
      data
    })
    await this.load()
  }

  public async load () {
    this.computer = await server.prisma.computer.findFirstOrThrow({
      where: {
        id: this.computerId,
        gameId: process.env.CURRENT_GAME_ID
      },
      include: {
        hardware: true,
        software: true
      }
    })

    this.data = JSON.parse(this.computer.data?.toString() || '')

    this.computer.software.forEach((software) => {
      this.softwares.push(new Software(software.id, software, this))
    })

    return this.computer
  }

  public getSoftware (softwareId: string) {
    return this.softwares.filter((software) => software.softwareId === softwareId)[0]
  }

  public getFirstTypeInstalled (type: string) {
    return this.softwares.filter((software) => software.software.type === type && software.installed)[0]
  }

  public getInstalled (type: string) {
    return this.softwares.filter((software) => software.installed)
  }

  public async cloneSoftware (computer: Computer, software: Software | string) {
    software = typeof software === 'string' ? this.getSoftware(software) : software

    return await computer.addSoftware({
      ...software.software,
      data: {
        ...(typeof software.software.data === 'string' ? JSON.parse(software.software.data) : software.software.data)
      },
      game: {
        connect: {
          id: process.env.CURRENT_GAME_ID
        }
      },
      user: {
        connect: {
          id: computer.computer.userId
        }
      },
      computer: {
        connect: {
          id: computer.computerId
        }
      }
    })
  }

  public async addSoftware (data: Prisma.SoftwareCreateInput) {
    const id = await server.prisma.software.create({
      data
    })

    const software = new Software(id.id, id, this)
    this.softwares.push(software)
    return software
  }

  public async setHardware (type: HardwareTypes, strength: number) {
    const previousHardware = this.getFirstHardwareType(type)

    if (previousHardware) {
      await server.prisma.hardware.delete({
        where: {
          id: previousHardware.id,
          gameId: process.env.CURRENT_GAME_ID
        }
      })
    }

    await server.prisma.hardware.create({
      data: {
        gameId: process.env.CURRENT_GAME_ID,
        type,
        strength,
        computerId: this.computerId
      }
    })
  }

  public getCombinedHardwareStrength (type: HardwareTypes) {
    const result = this.computer.hardware.filter((hardware) => hardware.type === type)
    let combinedStrength = 0
    result.forEach((hardware) => combinedStrength += hardware.strength)
    return combinedStrength
  }

  public getHardware (type: HardwareTypes) {
    return this.computer.hardware.filter(hardware => hardware.type === type)
  }

  public getFirstHardwareType (type: HardwareTypes) {
    return this.computer.hardware.filter((hardware) => hardware.type === type)?.[0]
  }
}

export const findComputer = async (ipAddress: string) => {
  const potentialComputer = await server.prisma.computer.findFirst({
    where: {
      ip: ipAddress
    }
  })

  return potentialComputer
}

export const getComputer = async (computerId: string) => {
  const computer = new Computer(computerId)

  if (!await computer.exists()) { return null }

  await computer.load()
  return computer
}

export const generateIpAddress = () => {
  const numbers = []

  for (let i = 0; i < 3; i++) {
    numbers.push(Math.floor(Math.random() * 256))
  }

  if (numbers[0] <= 10 || numbers[0] === 192) { numbers[0] = 293 }

  return numbers.join('.')
}
