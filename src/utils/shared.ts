import { ITask } from '../models/interface';
import { readDocuments } from './db';

export const getTasks = async () => {
  const { documents } = await readDocuments();

  return documents as ITask[];
};
