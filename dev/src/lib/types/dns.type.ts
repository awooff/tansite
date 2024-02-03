import { Computer } from "./computer.type";
import { User } from "./user.type";

export type DNS = {
  website: string;
  computer: Computer;
  computerId: string;
  user: User;
  userId: number;
  tags: string;
  description: string;
  updated: string;
  id: string;
};
