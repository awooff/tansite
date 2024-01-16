import { Process } from '@prisma/client'
import { Computer } from './computer'
import { server } from '../index'

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
