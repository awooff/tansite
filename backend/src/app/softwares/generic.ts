import { SoftwareAction } from '@/lib/types/software.type'

const defaultSoftware = {
  preDownload: async (software, computer, executor) => {
    if (!software.software)
      throw new Error('software class not loaded')

    let size = 0
    executor.software.forEach((software) => {
      size += software?.software?.size || 0
    })

    // if the computer is full do not download
    if (size + software.software.size > executor.getCombinedHardwareStrength('HDD')) { return false }

    // check if the computer is full
    return true
  },
  preUpload: async (software, computer, executor) => {
    if (!software.software)
      throw new Error('software class not loaded')

    let size = 0
    executor.software.forEach((software) => {
      size += software?.software?.size || 0
    })

    // if the computer is full do not download
    if (size + software.software.size > executor.getCombinedHardwareStrength('HDD')) { return false }

    // check if the computer is full
    return true
  },
  upload: async (software, computer, executor) => {
    if (!software.software)
      throw new Error('software class not loaded')

    await computer.addSoftware({
      ...software.software,
      data: {},
      user: {
        connect: {
          id: executor?.computer?.userId
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

    computer.log(`software remotely uploaded => ${software.toString()}`, executor)
    executor.log(`software uploaded remotely => ${software.toString()}`, computer)
  },
  download: async (software, computer, executor) => {

    if (!software.software)
      throw new Error('software class not loaded')

    await executor.addSoftware({
      ...software.software,
      data: {},
      user: {
        connect: {
          id: executor?.computer?.userId
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

    computer.log(`software remotely downloaded => ${software.toString()}`, executor)
    executor.log(`software downloaded remotely => ${software.toString()}`, computer)
  },
  uninstall: async (software, computer, executor) => {
    computer.log(`software remotely uninstalled => ${software.toString()}`, executor)
    executor.log(`software installed remotely => ${software.toString()}`, computer)

    await software.uninstall()
  },
  preInstall: async (software, computer, executor) => {
    let size = 0
    executor.software.forEach((software) => {
      size += software?.software?.size || 0
    })

    // if the computer RAM is full do not download
    if (size + (software?.software?.size || 0) > executor.getCombinedHardwareStrength('RAM')) { return false }

    return true
  },
  install: async (software, computer, executor) => {
    computer.log(`software remotely installed => ${software.toString()}`, executor)
    executor.log(`software installed remotely => ${software.toString()}`, computer)

    await software.install()
  },
  delete: async (software, computer, executor) => {
    computer.log(`software remotely deleted => ${software.toString()}`, executor)
    executor.log(`software deleted removely => ${software.toString()}`, computer)

    await software.delete()
  }
} satisfies SoftwareAction

export default defaultSoftware
