import { SoftwareActions } from '@/lib/types/software.type'
import { deposit, getBankAccount } from '../finance'
import { ProcessData } from '@/lib/types/process.type'

export type CollectorData = {
  custom: {
    bankAccount: string
  }
} & ProcessData

const collector = {
  settings: {
    localExecutionOnly: true,
    parameters: {
      custom: {
        bankAccount: (z) => {
          return z.string().max(32)
        }
      }
    }
  },
  execute: async (software, computer, executor, data: CollectorData) => {
    const account = await getBankAccount(data.custom.bankAccount)

    if (account === null) { throw new Error('bank account invalid') }

    await deposit(account, 10)
  },
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

export default collector
