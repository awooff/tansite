import { Computer } from "./computer.type";
import { Groups } from "./groups.type";

export interface SessionData {
  userId: number;
  connections: Computer[];
  logins: Record<string, Computer[]>;
  group: Groups;
}
