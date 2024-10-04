import { Query } from 'appwrite';

import { IPayload } from '../models/interface';
import { databases, ID } from './appwrite';

const dbID: string = import.meta.env.VITE_APPWRITE_DB_ID;
const collectionID: string = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const createDocument = async (payload: IPayload) =>
  await databases.createDocument(dbID, collectionID, ID.unique(), {
    ...payload
  });

const readDocuments = async () =>
  await databases.listDocuments(dbID, collectionID);

const updateDocument = async (payload: IPayload, id: string) =>
  await databases.updateDocument(dbID, collectionID, id, {
    ...payload
  });

const deleteDocument = async (id: string) =>
  await databases.deleteDocument(dbID, collectionID, id);

const searchTasks = async (searchTerm: string) => {
  const responseTitle = await databases.listDocuments(dbID, collectionID, [
    Query.search('title', searchTerm)
  ]);
  const responseDescription = await databases.listDocuments(
    dbID,
    collectionID,
    [Query.search('description', searchTerm)]
  );

  return [...responseTitle.documents, ...responseDescription.documents].filter(
    (task, index, self) => index === self.findIndex(t => t.$id === task.$id)
  );
};

const sortByDueDate = async (isEarliestToLatest: boolean) => {
  const orderQuery = isEarliestToLatest
    ? Query.orderAsc('due_date')
    : Query.orderDesc('due_date');

  const response = await databases.listDocuments(dbID, collectionID, [
    orderQuery
  ]);

  return response.documents;
};

export {
  createDocument,
  deleteDocument,
  readDocuments,
  searchTasks,
  sortByDueDate,
  updateDocument
};
