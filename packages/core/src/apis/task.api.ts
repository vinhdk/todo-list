import { v7 } from 'uuid';
import { environment } from '../environments/environment';
import { TaskItem } from '../types';

export const TASK_API = `${environment.endpoint}/tasks`;

export const useTaskApi = () => {
  return {
    getTasks: () =>
      fetch(`${TASK_API}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json() as Promise<TaskItem[]>),
    getTaskById: (id: string) =>
      fetch(`${TASK_API}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json() as Promise<TaskItem>),
    createTask: (task: Omit<TaskItem, 'id'>) =>
      fetch(`${TASK_API}`, {
        method: 'POST',
        body: JSON.stringify({
          ...task,
          id: v7(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json() as Promise<TaskItem>),
    updateTask: (id: string, task: Omit<TaskItem, 'id'>) =>
      fetch(`${TASK_API}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...task,
          id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json() as Promise<TaskItem>),
    deleteTask: (id: string) =>
      fetch(`${TASK_API}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json() as Promise<TaskItem>),
  };
};
