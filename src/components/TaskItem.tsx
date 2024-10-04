import { TrashIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { MouseEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { ITask } from '../models/interface';
import { deleteDocument, updateDocument } from '../utils/db';
import Button from './Button';

type TaskItemProps = {
  task: ITask;
  handleViewTask?: (e: MouseEvent<HTMLDivElement>) => void;
  enterFrom?: 'left' | 'right';
  index?: number;
};

export default function TaskItem({
  task,
  handleViewTask,
  enterFrom,
  index
}: TaskItemProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isDone, setIsDone] = useState(false);

  const { description, done, due_date, priority, title, $id } = task;

  const isViewTask = handleViewTask ? true : false;

  const handleEdit = () => navigate('/', { state: { task } });

  const deleteTask = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => queryClient.invalidateQueries('tasks')
  });

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      deleteTask.mutate($id);
    } catch (e) {
      console.error(e);
    }

    if (isViewTask) navigate('/');
  };

  const handleCheckbox = async (checkedVal: boolean) => {
    if (!checkedVal) return;

    try {
      await updateDocument(
        { description, due_date, title, done: checkedVal, priority },
        $id
      );

      queryClient.invalidateQueries('tasks');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: enterFrom === 'left' ? -100 : 100 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.3, delay: (index ?? 0) / 4 }
        }}
        className="m-8 cursor-pointer border border-container rounded-md p-4 hover:shadow-lg transition duration-300 ease-in-out max-h-96"
        onClick={handleViewTask}
      >
        <section
          key={task.$id}
          className="flex flex-col justify-between gap-2 my-4 h-full"
        >
          <section className="flex gap-4 items-center justify-between flex-wrap">
            {task.priority && (
              <span>
                <span className="font-medium">Priority: </span>
                <span
                  className={`${
                    priority === 'low'
                      ? 'bg-lowPriority'
                      : priority === 'medium'
                      ? 'bg-mediumPriority'
                      : 'bg-highPriority'
                  } text-iconColor py-1 px-2 rounded-md`}
                >
                  {priority}
                </span>
              </span>
            )}
            <div className="flex gap-2 py-1 ml-auto">
              {!done ? (
                <Button extraBtnClasses="bg-ok" handleClick={handleEdit}>
                  <span className="font-medium">Edit</span>
                  <PencilSquareIcon height={20} className="hidden lg:flex" />
                </Button>
              ) : null}
              <Button
                extraBtnClasses="bg-highPriority"
                handleClick={handleDelete}
              >
                <span className="font-medium">Delete</span>
                <TrashIcon height={20} className="hidden lg:flex" />
              </Button>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-medium py-2 break-words">{title}</h2>
            <p className="py-1 mb-4 min-h-16 break-words">
              {description.length > 70 && !isViewTask
                ? `${description.substring(0, 70)}...`
                : description}
            </p>
            <span className="font-extralight mt-2">
              <span className="font-medium">Due on: </span>
              <span className="underline">{`${new Date(
                due_date
              ).toLocaleDateString()}`}</span>
            </span>
          </section>
          <section className="flex justify-between">
            {done ? (
              <span className="items-center text-ok font-bold ml-auto">
                Completed
              </span>
            ) : (
              <div className="flex items-center ml-auto hover:scale-105 transition duration-300 ease-in-out">
                <label htmlFor="done" className="mr-2 font-light">
                  Mark as complete
                </label>
                <input
                  type="checkbox"
                  checked={isDone}
                  onClick={e => e.stopPropagation()}
                  onChange={e => {
                    const checked = e.target.checked;

                    setIsDone(checked);
                    handleCheckbox(checked);
                  }}
                  className="size-5 accent-pink-600 rounded-sm"
                />
              </div>
            )}
          </section>
        </section>
      </motion.div>
    </>
  );
}
