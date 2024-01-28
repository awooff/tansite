import action from './action'
import hack from './hack'
import exploit from './exploit'
import modify from './log/modify'
import wipe from './log/wipe'

const index = { action, hack, exploit, modify, wipe}
export type ProcessTypes = keyof typeof index

export default {
  ...index
}