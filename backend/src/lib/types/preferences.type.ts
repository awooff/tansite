export interface Preferences {
  finance?: {
    defaultBankAccount?: string
  }
  quests?: {
    currentQuest?: string
  }
  tutorial?: {
    currentTutorial?: string
    completed?: boolean
  }
}
