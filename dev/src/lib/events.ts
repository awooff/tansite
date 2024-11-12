import { EventEmitter } from "events";
import { Process } from "./types/process.type";

export interface WebEmitterEvents {
	processCompleted: (process: Process) => {};
	showModal: (modal: string, data: object) => {};
}

export declare interface WebEventEmitter {
	on: (eventName: keyof WebEmitterEvents, cb: Function) => any;
	emit: (eventName: keyof WebEmitterEvents, ...args: any[]) => any;
}
export class WebEventEmitter extends EventEmitter {}

const WebEvents = new WebEventEmitter();

export default WebEvents;
