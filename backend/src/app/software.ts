import { Prisma } from '@prisma/client'
import { Computer } from './computer'
import { server } from '../index'
import { SoftwareActions } from '@/lib/types/software.type'
import * as Softwares from './softwares'
import settings from '../settings'

export class Software {
  public software: Prisma.SoftwareGetPayload<{}> = {} as any
  public computer: Computer = null as any
  public actions: SoftwareActions = null as any

  public readonly softwareId: string
  public constructor (softwareId: string, software?: Prisma.SoftwareGetPayload<{}>, computer?: Computer) {
    this.softwareId = softwareId
    if (software != null) { this.software = software }
    if (computer != null) { this.computer }
  }

  public async uninstall () {
    await this.update({
      installed: false
    })
  }

  public async install () {
    await this.update({
      installed: false
    })
  }

  public getExecutionCost (action: keyof SoftwareActions): number {
    let baseCost = (settings.softwareActionsCost as any)[action] || 10
    baseCost = baseCost * (this.actions.settings?.complexity || 1)
    baseCost = Math.floor(baseCost * settings.actionNerf * settings.cpuNerf)

    if (action === 'delete' || action === 'uninstall' || action === 'view') { baseCost = Math.floor(baseCost * settings.hddNerf) }

    return baseCost
  }

  public async execute (action: keyof SoftwareActions, executor?: Computer) {
    switch (action) {
      case 'install':
        if (!this.actions?.install) { return null }
        await this.actions.install(this, this.computer, executor || this.computer)
        break
      case 'uninstall':
        if (!this.actions?.uninstall) { return null }
        await this.actions.uninstall(this, this.computer, executor || this.computer)
        break
      case 'execute':
        if ((this.actions?.execute) == null) { return null }
        await this.actions.execute(this, this.computer, executor || this.computer)
        break
      case 'view':
        if ((this.actions?.view) == null) { return null }
        await this.actions.view(this, this.computer, executor || this.computer)
        break
      case 'delete':
        if (!this.actions?.delete) { return null }

        await this.actions.delete(this, this.computer, executor || this.computer)
        break
      default:
        throw new Error('invalid action')
    }
  }

  public get level () {
    return this.software.level
  }

  public get installed () {
    return this.software.installed
  }

  public async delete () {
    await server.prisma.software.delete({
      where: {
        id: this.softwareId
      }
    })
    await this.load()
  }

  public async update (data: Prisma.SoftwareUpdateInput) {
    await server.prisma.software.update({
      where: {
        id: this.softwareId,
        gameId: process.env.CURRENT_GAME_ID
      },
      data
    })
    await this.load()
  }

  public toString () {
    return `[${this.software.type}] (${this.software.level})`
  }

  public async load () {
    this.software = await server.prisma.software.findFirstOrThrow({
      where: {
        id: this.softwareId,
        gameId: process.env.CURRENT_GAME_ID
      }
    })

    this.computer = new Computer(this.software.computerId)
    await this.computer.load()

    this.actions = (Softwares as any)?.[this.software.type]

    if (!this.actions) { this.actions = Softwares.generic }

    return this.software
  }
}
