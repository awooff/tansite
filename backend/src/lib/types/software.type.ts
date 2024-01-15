import { Computer } from "@/app/computer"
import { Software } from "@/app/software"


export type SoftwareActions = {
  settings?: {
    complexity?: number //how complex this software is, effects how long it takes to install/uninstall or execute
    bloat?: number //how much more hard drive space to take up (in percentage)
    obscurity?: number // how 'obscured' the software is by default, takes up more research time
  },
  execute: (software: Software, computer: Computer, executor: Computer) => Promise<void>
  install: (software: Software, computer: Computer, executor: Computer) => Promise<void>
  uninstall: (software: Software, computer: Computer, executor: Computer) => Promise<void>
  delete: (softawre: Software, computer: Computer, executor: Computer) => Promise<void>
  view: (software: Software, computer: Computer, executor: Computer) => Promise<void>
}