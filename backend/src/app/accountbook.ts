import {  Memory, User } from "@prisma/client";
import { server } from "../index";
import { Computer } from "./computer";

export class AccountBook {

  public userId;
  public user?: User;

  constructor(userId: number) {
    this.userId = userId;
  }

  /**
   * @throws
   */
  public async check() {
    // catches out bugs by forcing userId to be attached to valid address book
    this.user = await server.prisma.user.findFirstOrThrow({
      where: {
        id: this.userId
      }
    })
  }

  public async fetch(take?: number, page?: number) {
    return await server.prisma.accountBook.findMany({
      where: {
        userId: this.userId
      },
      take: take || 64,
      skip: take && page ? take * page : 0
    })
  }

  public async count() {
    return await server.prisma.accountBook.count({
      where: {
        userId: this.userId
      }
    })
  }

  public async removeComputerFromAccountBook(computer: Computer) {
    await server.prisma.accountBook.deleteMany({
      where: {
        computerId: computer.computerId,
        userId: this.userId
      }
    })
  }

  public async addToAccountBook(computer: Computer, memory: Memory, data?: any ) {
    return await server.prisma.accountBook.create({
      data: {
        computerId: computer.computerId,
        userId: computer.computer.userId,
        memoryId: memory.id,
        data: data
      }
    })
  }
}