import { Memory, Prisma } from '@prisma/client'
import { server } from '../index'

export const canAfford = (bankAccount: Memory, cost: number) => {
  if (bankAccount.type !== 'bankaccount') { throw new Error('computer memory must be of type bank') }

  return (bankAccount?.value || 0) - cost > 0
}

export const deposit = async (bankAccount: string | Memory, value: number) => {
  const account = typeof bankAccount === 'string' ? await getBankAccount(bankAccount) : bankAccount

  if (account === null) { throw new Error('bank account is ivnalid') }

  account.value = (account?.value || 0) + value

  return await server.prisma.memory.update({
    where: {
      id: account.id
    },
    data: {
      value: account.value
    }
  })
}

export const withdraw = async (bankAccount: string | Memory, value: number) => {
  const account = typeof bankAccount === 'string' ? await getBankAccount(bankAccount) : bankAccount

  if (account === null) { throw new Error('bank account is ivnalid') }

  account.value = (account?.value || 0) - value

  if (account.value < 0) { account.value = 0 }

  return await server.prisma.memory.update({
    where: {
      id: account.id
    },
    data: {
      value: account.value
    }
  })
}

export const getBankAccount = async (bankAccount: string) => {
  return await server.prisma.memory.findFirst({
    where: {
      key: bankAccount
    }
  })
}

export const getUserBankAccount = async (userId: number) => {
  return await server.prisma.memory.findFirst({
    where: {
      userId,
      type: 'bankaccount'
    }
  })
}
