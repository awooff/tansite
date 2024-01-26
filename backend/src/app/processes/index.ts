import action from './action'
import hack from './hack'
import exploit from './exploit'

const index = { action, hack, exploit }
export type ProcessTypes = keyof typeof index

export default {
  ...index
}