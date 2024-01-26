import { Prisma } from '@prisma/client'
import { Computer } from './computer'
import { server } from '../index'
import { SoftwareAction } from '@/lib/types/software.type'
import softwares, { SoftwareType } from './softwares'
import settings from '../settings'

export class Software {
  public software?: Prisma.SoftwareGetPayload<{}>
  public computer?: Computer
  public readonly softwareId: string

  private _action?: SoftwareAction
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

  public action<T>() {
    return this._action as T
  }

  public getExecutionCost(action: keyof SoftwareAction): number {
    
    if (!this._action)
      throw new Error('no software actions present')

    let baseCost = (settings.softwareActionsCost as any)[action] || 10
    baseCost = baseCost * (this._action.settings?.complexity || 1)
    baseCost = Math.floor(baseCost * settings.actionNerf * settings.cpuNerf)

    if (action === 'delete' || action === 'uninstall' || action === 'view') { baseCost = Math.floor(baseCost * settings.hddNerf) }

    return baseCost
  }

  public async preExecute (action: keyof SoftwareAction, executor?: Computer, data?: any): Promise<boolean> {
    const computer = (executor == null) ? this.computer : executor

    if (!computer)
      throw new Error('invalid executor')

    switch (action) {
      case 'install':
        if ((this._action?.preInstall) == null) { return true }
        return await this._action.preInstall(this, this.computer || computer, computer, data)
      case 'uninstall':
        if ((this._action?.preUninstall) == null) { return true }
        return await this._action.preUninstall(this, this.computer || computer, computer, data)
      case 'execute':
        if ((this._action?.preExecute) == null) { return true }
        return await this._action.preExecute(this, this.computer || computer, computer, data)
      case 'view':
        if ((this._action?.preView) == null) { return true }
        return await this._action.preView(this, this.computer || computer, computer, data)
      case 'delete':
        if ((this._action?.preDelete) == null) { return true }
        return await this._action.preDelete(this, this.computer || computer, computer, data)
      default:
        throw new Error('invalid action')
    }
  }

  public async execute (action: keyof SoftwareAction, executor?: Computer, data?: any) {
    const computer = (executor == null) ? this.computer : executor

    if (!computer)
      throw new Error('invalid executor')

    switch (action) {
      case 'install':
        if ((this._action?.install) == null) { return null }
        return await this._action.install(this, this.computer || computer, computer, data)
      case 'uninstall':
        if ((this._action?.uninstall) == null) { return null }
        return await this._action.uninstall(this, this.computer || computer, computer, data)
      case 'execute':
        if ((this._action?.execute) == null) { return null }
        return await this._action.execute(this, this.computer || computer, computer, data)
      case 'view':
        if ((this._action?.view) == null) { return null }
        return await this._action.view(this, this.computer || computer, computer, data)
      case 'delete':
        if ((this._action?.delete) == null) { return null }
        return await this._action.delete(this, this.computer || computer, computer, data)
      default:
        throw new Error('invalid action')
    }
  }

  public get level() {
    if (!this.software)
      throw new Error('no software')

    return this.software.level
  }

  public get installed() {
    if (!this.software)
      throw new Error('no software')
    
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
  

  public get type() {

    if (!this.software)
      throw new Error('no software')

    return this.software.type as SoftwareType
  }

  public toString() {
      if (!this.software)
        throw new Error('no software')
    
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
    this._action = (softwares as any)?.[this.software.type]

    // if no actions for this software, use generic
    if (!this._action) { this._action = softwares.generic } else {
      // if any missing actions, take them from generic
      Object.keys(softwares.generic).forEach((key) => {
        if (key === 'settings') { return }

        if (!(this._action as any)[key]) { (this._action as any)[key] = (softwares.generic as any)[key] }
      })
    }

    return this.software
  }
}
