import { SoftwareAction } from '@/lib/types/software.type'
import { deposit, getBankAccount } from '../finance'
import { ProcessData } from '@/lib/types/process.type'
import GameException from '@/lib/exceptions/game.exception'

export type CollectorData = {
  custom: {
    bankAccount: string
  }
} & ProcessData

const collector = {
  settings: {
    localExecutionOnly: true,
    parameters: {
      execute: {
        custom: {
          bankAccount: (z) => {
            return z.string().max(32)
          }
        }
      }
    }
  },
  preExecute: async (software, computer, executor, data: CollectorData) => {
    const account = await getBankAccount(data.custom.bankAccount)

    if (account === null) { throw new GameException('bank account is invalid') }

    return true
  },
  execute: async (software, computer, executor, data: CollectorData) => {
    const account = await getBankAccount(data.custom.bankAccount)

    if (account === null) { throw new Error('bank account invalid') }

    await deposit(account, 10)

    return {
      profit: 10
    }
  }
} satisfies SoftwareAction

export default collector
