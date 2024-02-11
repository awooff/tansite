export type Process = {
  completion: string;
  started: string;
  type: string;
  ip: string;
  id: string;
  data: Record<string, any>;
  computerId: string;
};
