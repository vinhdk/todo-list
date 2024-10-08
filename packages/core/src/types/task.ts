import { Statuses } from '../enums';

export type TaskItem = {
  id: string;
  name: string;
  description: string;
  status: Statuses;
};
