import generic from './generic'
import collector from './collector'
import cracker from './cracker'
import hasher from './hasher'
import spammer from './spammer'
const index = { generic, collector, cracker, hasher, spammer }
export type SoftwareType = keyof typeof index
export default { ...index }