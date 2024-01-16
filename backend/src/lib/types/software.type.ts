import { Computer } from '@/app/computer'
import { Software } from '@/app/software'
import { ProcessParameters } from './process.type'

export interface SoftwareActions {
  settings?: {
    complexity?: number // how complex this software is, effects how long it takes to install/uninstall or execute
    bloat?: number // how much more hard drive space to take up (in percentage)
    obscurity?: number // how 'obscured' the software is by default, takes up more research time
    localExecutionOnly?: boolean // can only be excecuted on a local machine
    parameters?: {
      download?: ProcessParameters
      execute?: ProcessParameters
      install?: ProcessParameters
      uninstall?: ProcessParameters
      delete?: ProcessParameters
      view?: ProcessParameters
    }
  }
  preDownload?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<boolean>
  preExecute?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<boolean>
  preInstall?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<boolean>
  preUninstall?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<boolean>
  preDelete?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<boolean>
  preView?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<boolean>
  download?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<void | any>
  execute?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<void | any>
  install?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<void | any>
  uninstall?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<void | any>
  delete?: (softawre: Software, computer: Computer, executor: Computer, data?: any) => Promise<void | any>
  view?: (software: Software, computer: Computer, executor: Computer, data?: any) => Promise<void | any>
}
