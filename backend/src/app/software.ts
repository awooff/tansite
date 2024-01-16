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

  public async preExecute (action: keyof SoftwareActions, executor?: Computer, data?: any): Promise<boolean> {
    const computer = (executor == null) ? this.computer : executor
    switch (action) {
      case 'install':
        if ((this.actions?.preInstall) == null) { return true }
        return await this.actions.preInstall(this, this.computer, computer, data)
      case 'uninstall':
        if ((this.actions?.preUninstall) == null) { return true }
        return await this.actions.preUninstall(this, this.computer, computer, data)
      case 'execute':
        if ((this.actions?.preExecute) == null) { return true }
        return await this.actions.preExecute(this, this.computer, computer, data)
      case 'view':
        if ((this.actions?.preView) == null) { return true }
        return await this.actions.preView(this, this.computer, computer, data)
      case 'delete':
        if ((this.actions?.preDelete) == null) { return true }
        return await this.actions.preDelete(this, this.computer, computer, data)
      default:
        throw new Error('invalid action')
    }
  }

  public async execute (action: keyof SoftwareActions, executor?: Computer, data?: any) {
    const computer = (executor == null) ? this.computer : executor
    switch (action) {
      case 'install':
        if ((this.actions?.install) == null) { return null }
        await this.actions.install(this, this.computer, computer, data)
        break
      case 'uninstall':
        if ((this.actions?.uninstall) == null) { return null }
        await this.actions.uninstall(this, this.computer, computer, data)
        break
      case 'execute':
        if ((this.actions?.execute) == null) { return null }
        await this.actions.execute(this, this.computer, computer, data)
        break
      case 'view':
        if ((this.actions?.view) == null) { return null }
        await this.actions.view(this, this.computer, computer, data)
        break
      case 'delete':
        if ((this.actions?.delete) == null) { return null }
        await this.actions.delete(this, this.computer, computer, data)
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

    if (!this.computer) {
      this.computer = new Computer(this.software.computerId)
      await this.computer.load()
    } else {
      this.computer.software = this.computer.software.map((software) => {
        if (software.softwareId === this.softwareId) { return this }

        return software
      })
    }

    // the actions (install, etc) to do for this software
    this.actions = (Softwares as any)?.[this.software.type]

    // if no actions for this software, use generic
    if (!this.actions) { this.actions = Softwares.generic } else {
      // if any missing actions, take them from generic
      Object.keys(Softwares.generic).forEach((key) => {
        if (key === 'settings') { return }

        if (!(this.actions as any)[key]) { (this.actions as any)[key] = (Softwares.generic as any)[key] }
      })
    }

    return this.software
  }
}
