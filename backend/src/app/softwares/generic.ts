import { SoftwareActions } from '@/lib/types/software.type'

const defaultSoftware = {
  preDownload: async (software, computer, executor) => {
    let size = 0
    executor.softwares.forEach((software) => {
      size += software.software.size
    })

    // if the computer is full do not download
    if (size + software.software.size > executor.getCombinedHardwareStrength('HDD')) { return false }

    // check if the computer is full
    return true
  },
  download: async (software, computer, executor) => {
    await executor.addSoftware({
      ...software.software,
      data: {},
      user: {
        connect: {
          id: executor.computer.userId
        }
      },
      computer: {
        connect: {
          id: executor.computerId
        }
      },
      game: {
        connect: {
          id: process.env.CURRENT_GAME_ID
        }
      }
    })

    computer.log(`downloaded ${software.toString()}`, executor)
    executor.log(`you have downloaded ${software.toString()}`, computer)
  },
  uninstall: async (software, computer, executor) => {
    computer.log(`uninstalled ${software.toString()}`, executor)
    executor.log(`you have uninstalled ${software.toString()}`, computer)

    await software.uninstall()
  },
  preInstall: async (software, computer, executor) => {
    let size = 0
    executor.softwares.forEach((software) => {
      size += software.software.size
    })

    // if the computer RAM is full do not download
    if (size + software.software.size > executor.getCombinedHardwareStrength('RAM')) { return false }

    return true
  },
  install: async (software, computer, executor) => {
    computer.log(`installed ${software.toString()}`, executor)
    executor.log(`you have installed ${software.toString()}`, computer)

    await software.install()
  },
  delete: async (software, computer, executor) => {
    computer.log(`deleted ${software.toString()}`, executor)
    executor.log(`you have deleted ${software.toString()} on my machine`, computer)

    await software.delete()
  }
} satisfies SoftwareActions

export default defaultSoftware
