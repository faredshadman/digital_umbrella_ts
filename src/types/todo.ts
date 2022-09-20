export interface Todo {
  id: string | number;
  title: string;
  tags: string[];
  isDone: boolean;
}

export type Id = number | string;
