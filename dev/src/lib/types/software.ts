import { Computer } from "./computer.type";
import { User } from "./user.type";

export type Software = {
  id: string;
  userId: number;
  user: User;
  ip: string;
  type: string;
  name: string;
  level: number;
  size: number;
  installed: boolean;
  computer: Computer;
  computerId: string;
};
