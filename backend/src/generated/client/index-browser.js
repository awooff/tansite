
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  detectRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.10.2
 * Query Engine version: 5a9203d0590c951969e85a7d07215503f4672eb9
 */
Prisma.prismaVersion = {
  client: "5.10.2",
  engine: "5a9203d0590c951969e85a7d07215503f4672eb9"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  password: 'password',
  salt: 'salt',
  lastAction: 'lastAction',
  created: 'created',
  refreshToken: 'refreshToken',
  group: 'group'
};

exports.Prisma.GameScalarFieldEnum = {
  id: 'id',
  name: 'name',
  started: 'started',
  ended: 'ended'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  lastAction: 'lastAction',
  created: 'created',
  expires: 'expires'
};

exports.Prisma.HardwareScalarFieldEnum = {
  id: 'id',
  computerId: 'computerId',
  gameId: 'gameId',
  type: 'type',
  strength: 'strength'
};

exports.Prisma.AddressBookScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  access: 'access',
  computerId: 'computerId',
  ip: 'ip',
  data: 'data',
  gameId: 'gameId'
};

exports.Prisma.DNSScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  computerId: 'computerId',
  gameId: 'gameId',
  website: 'website',
  tags: 'tags',
  description: 'description',
  updated: 'updated',
  created: 'created'
};

exports.Prisma.AccountBookScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  computerId: 'computerId',
  memoryId: 'memoryId',
  data: 'data',
  gameId: 'gameId'
};

exports.Prisma.ProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  gameId: 'gameId',
  data: 'data'
};

exports.Prisma.MemoryScalarFieldEnum = {
  id: 'id',
  computerId: 'computerId',
  gameId: 'gameId',
  userId: 'userId',
  type: 'type',
  key: 'key',
  value: 'value',
  data: 'data'
};

exports.Prisma.ComputerScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  gameId: 'gameId',
  ip: 'ip',
  data: 'data',
  created: 'created',
  updated: 'updated'
};

exports.Prisma.QuestsScalarFieldEnum = {
  id: 'id',
  gameId: 'gameId',
  type: 'type',
  title: 'title',
  reward: 'reward',
  open: 'open'
};

exports.Prisma.UserQuestsScalarFieldEnum = {
  id: 'id',
  questsId: 'questsId',
  userId: 'userId',
  gameId: 'gameId',
  completed: 'completed',
  created: 'created',
  updated: 'updated'
};

exports.Prisma.SoftwareScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  computerId: 'computerId',
  gameId: 'gameId',
  type: 'type',
  level: 'level',
  size: 'size',
  opacity: 'opacity',
  installed: 'installed',
  executed: 'executed',
  created: 'created',
  updated: 'updated',
  data: 'data'
};

exports.Prisma.ProcessScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  computerId: 'computerId',
  ip: 'ip',
  gameId: 'gameId',
  type: 'type',
  started: 'started',
  completion: 'completion',
  data: 'data'
};

exports.Prisma.NotificationsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  content: 'content',
  read: 'read'
};

exports.Prisma.LogsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  computerId: 'computerId',
  senderId: 'senderId',
  senderIp: 'senderIp',
  gameId: 'gameId',
  message: 'message',
  created: 'created'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Groups = exports.$Enums.Groups = {
  User: 'User',
  Guest: 'Guest',
  Admin: 'Admin'
};

exports.HardwareTypes = exports.$Enums.HardwareTypes = {
  CPU: 'CPU',
  GPU: 'GPU',
  RAM: 'RAM',
  HDD: 'HDD',
  Upload: 'Upload',
  Download: 'Download'
};

exports.AccessLevel = exports.$Enums.AccessLevel = {
  GOD: 'GOD',
  FTP: 'FTP'
};

exports.Prisma.ModelName = {
  User: 'User',
  Game: 'Game',
  Session: 'Session',
  Hardware: 'Hardware',
  AddressBook: 'AddressBook',
  DNS: 'DNS',
  AccountBook: 'AccountBook',
  Profile: 'Profile',
  Memory: 'Memory',
  Computer: 'Computer',
  Quests: 'Quests',
  UserQuests: 'UserQuests',
  Software: 'Software',
  Process: 'Process',
  Notifications: 'Notifications',
  Logs: 'Logs'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        const runtime = detectRuntime()
        const edgeRuntimeName = {
          'workerd': 'Cloudflare Workers',
          'deno': 'Deno and Deno Deploy',
          'netlify': 'Netlify Edge Functions',
          'edge-light': 'Vercel Edge Functions or Edge Middleware',
        }[runtime]

        let message = 'PrismaClient is unable to run in '
        if (edgeRuntimeName !== undefined) {
          message += edgeRuntimeName + '. As an alternative, try Accelerate: https://pris.ly/d/accelerate.'
        } else {
          message += 'this browser environment, or has been bundled for the browser (running in `' + runtime + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
