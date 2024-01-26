import generic from './generic'
import collector from './collector'
import cracker from './cracker'
import hasher from './hasher'
import spammer from './spammer'
import ftpr from './ftpr'
import firewall from './firewall'

const index = { generic, collector, cracker, hasher, spammer, ftpr, firewall }
export type SoftwareType = keyof typeof index

export default { ...index }