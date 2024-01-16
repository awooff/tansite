import { SoftwareActions } from '@/lib/types/software.type'

const defaultSoftware = {
  uninstall: async (software, computer, executor) => {
    computer.log(`uninstalled ${software.toString()}`, executor)
    executor.log(`you have uninstalled ${software.toString()}`, computer)

    await software.uninstall()
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
