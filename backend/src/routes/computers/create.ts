import { Route } from '../../lib/types/route.type'
import { server } from '../../index'
import { Groups, HardwareTypes } from '@prisma/client'
import { ComputerData, generateIpAddress, getComputer } from '@/app/computer'
import settings from '../../settings'

const local = {

  settings: {
    groupOnly: Groups.User,
    title: 'Create Computer',
    description: 'Creates a new computer'
  },

  async get(req, res, error) {

    if (!req.session.userId)
      return error('session is invalid');

    let computerData = await server.prisma.computer.create({
      data: {
        userId: req.session.userId,
        ip: generateIpAddress(),
        data: {
          title: 'New Computer',
          description: 'A new computer',
          markdown: 'Hello World',
          hardwareLimits: settings.defaultHardwareLimits
        } as ComputerData
      }
    })
    let computer = await getComputer(computerData.id);

    if (computer === null)
      return error('did not create computer');

    //set computer
    await Promise.all(Object.values(settings.defaultSoftware).map(async (software) => {
      await computer?.addSoftware({
        userId: req.session.userId || 0,
        computerId: computer.computerId,
        type: software.type,
        level: software.level,
        installed: software.installed,
        opacity: 0.0
      })
    }))

    //set hardware
    await Promise.all(Object.keys(settings.defaultHardware).map(async (hardware: any) => {
      await computer?.setHardware(hardware, (settings.defaultHardware as any)[hardware])
    }))

    await computer.load();

    res.send({
      computer: computer.computer
    })
  }
} satisfies Route

export default local
