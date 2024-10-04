import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { ITask } from '../models/interface';
import Button from './Button';

type DialogProps = {
  children: React.ReactNode;
  setIsViewTask?: React.Dispatch<
    React.SetStateAction<{
      selectedTask: ITask;
      isViewTask: boolean;
    }>
  >;
  setSearchedTasks?: React.Dispatch<
    React.SetStateAction<{
      term: string;
      isSearching: boolean;
      searchedTasks: ITask[];
      error: string;
    }>
  >;
};

export default function Dialog({
  children,
  setIsViewTask,
  setSearchedTasks
}: DialogProps) {
  const [isOpen, setIsOpen] = useState(true);

  const closeDialog = () => {
    if (setIsViewTask)
      setIsViewTask({ isViewTask: false, selectedTask: {} as ITask });

    if (setSearchedTasks)
      setSearchedTasks({
        term: '',
        isSearching: false,
        searchedTasks: [],
        error: ''
      });

    setIsOpen(false);
  };

  return (
    <dialog
      open={isOpen}
      id="dialog"
      style={{ backgroundColor: 'var(--base-bg)', color: 'var(--text-main)' }}
      className={`${
        isOpen ? 'opacity-100 blur-none' : 'opacity-0 pointer-events-none'
      } transition-opacity duration-300 ease-in-out fixed inset-0 z-20`}
    >
      <Button
        handleClick={closeDialog}
        extraBtnClasses="ml-auto text-main font-medium hover:text-error"
      >
        Close <XMarkIcon height={20} />
      </Button>
      <div className="max-h-[80vh] overflow-y-auto">{children}</div>
    </dialog>
  );
}
