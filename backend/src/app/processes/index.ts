import action from './action'
import hack from './hack'
import exploit from './exploit'
import modify from './log/modify'

const index = { action, hack, exploit, modify}
export type ProcessTypes = keyof typeof index

export default {
  ...index
}