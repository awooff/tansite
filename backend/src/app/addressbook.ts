import { AccessLevel, User } from "@prisma/client";
import { server } from "../index";
import { Computer } from "./computer";

export class AddressBook {
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
        id: this.userId,
      },
    });
  }

  public async fetch(take?: number, page?: number) {
    return await server.prisma.addressBook.findMany({
      where: {
        userId: this.userId,
        gameId: process.env.CURRENT_GAME_ID,
      },
      take: take || 64,
      skip: take && page ? take * page : 0,
    });
  }

  public async count() {
    return await server.prisma.addressBook.count({
      where: {
        userId: this.userId,
        gameId: process.env.CURRENT_GAME_ID,
      },
    });
  }

  public async removeFromAddressBook(computer: Computer) {
    await server.prisma.addressBook.deleteMany({
      where: {
        computerId: computer.computerId,
        userId: this.userId,
        gameId: process.env.CURRENT_GAME_ID,
      },
    });
  }

  /**
   *
   * @param ip
   * @returns
   */
  public async get(ip: string) {
    return await server.prisma.addressBook.findFirst({
      where: {
        userId: this.userId,
        gameId: process.env.CURRENT_GAME_ID,
        ip: ip,
      },
    });
  }

  public async addToAddressBook(computer: Computer, access: AccessLevel) {
    if (!computer.computer) throw new Error("computer not loaded");

    return await server.prisma.addressBook.create({
      data: {
        computerId: computer.computerId,
        userId: computer.computer.userId,
        access: access,
        gameId: process.env.CURRENT_GAME_ID,
        ip: computer.ip,
      },
    });
  }

  public async findInAddressBook(ipAddress: string) {
    let result = await server.prisma.addressBook.findFirst({
      where: {
        userId: this.userId,
        ip: ipAddress,
        gameId: process.env.CURRENT_GAME_ID,
      },
    });

    return result;
  }
}
