import { PlusIcon } from '@heroicons/react/24/solid';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Container from '../components/Container';
import Dialog from '../components/Dialog';
import Search from '../components/Search';
import Select from '../components/Select';
import TaskItem from '../components/TaskItem';
import { ITask } from '../models/interface';
import { sortByDueDate } from '../utils/db';
import { getTasks } from '../utils/shared';

const selectArray = [
  'Select a sort option',
  'priority - (low - high)',
  'priority - (high - low)',
  'due date - (earliest - latest)',
  'due date - (latest - earliest)'
];

const sortByPriority = (tasks: ITask[], isAscending: boolean): ITask[] => {
  const priorityOrder: { [key: string]: number } = {
    low: 1,
    medium: 2,
    high: 3
  };

  return [...tasks].sort((a, b) => {
    const priorityA = priorityOrder[a.priority!.toLowerCase()];
    const priorityB = priorityOrder[b.priority!.toLowerCase()];

    return isAscending ? priorityA - priorityB : priorityB - priorityA;
  });
};

export default function Task() {
  const { data: tasks, isError, isLoading } = useQuery('tasks', getTasks);

  const navigate = useNavigate();

  const [filteredTasks, setFilteredTasks] = useState<ITask[]>(tasks ?? []);

  const [taskData, setTaskData] = useState({
    isViewTask: false,
    selectedTask: {} as ITask
  });

  const handleViewTask = (activeTask: ITask) =>
    setTaskData({ isViewTask: true, selectedTask: activeTask });

  const handleSelectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOption = e.target.value;

    if (selectedOption === selectArray[0]) {
      setFilteredTasks(tasks ?? []);
      return;
    }

    const doneTasks = tasks?.filter(task => task.done) ?? [];

    switch (selectedOption) {
      case 'priority - (low - high)':
      case 'priority - (high - low)': {
        const isAscending = selectedOption === 'priority - (low - high)';
        const sortedTasks = sortByPriority(tasks!, isAscending);

        setFilteredTasks([
          ...doneTasks,
          ...sortedTasks.filter(task => !task.done)
        ]);
        break;
      }
      case 'due date - (earliest - latest)':
      case 'due date - (latest - earliest)': {
        const isEarliestToLatest =
          selectedOption === 'due date - (earliest - latest)';
        const sortedTasks = (await sortByDueDate(
          isEarliestToLatest
        )) as ITask[];

        setFilteredTasks([
          ...doneTasks,
          ...sortedTasks.filter(task => !task.done)
        ]);
        break;
      }
    }
  };

  const pendingTasks = filteredTasks?.filter(task => !task.done);
  const doneTasks = filteredTasks?.filter(task => task.done);

  const pendingTaskCount = useMotionValue(0);
  const doneTaskCount = useMotionValue(0);
  const roundedPendingTaskCount = useTransform(pendingTaskCount, Math.round);
  const roundedDoneTaskCount = useTransform(doneTaskCount, Math.round);

  useEffect(() => {
    const animationPendingTasksCount = animate(
      pendingTaskCount,
      pendingTasks?.length ?? 0,
      {
        duration: 1.5
      }
    );
    const animationDoneTasksCount = animate(
      doneTaskCount,
      doneTasks?.length ?? 0,
      {
        duration: 1.5
      }
    );

    return () => {
      animationPendingTasksCount.stop();
      animationDoneTasksCount.stop();
    };
  }, [
    pendingTaskCount,
    pendingTasks?.length,
    doneTaskCount,
    doneTasks?.length
  ]);

  useEffect(() => {
    setFilteredTasks(tasks ?? []);
  }, [tasks]);

  if (isError) {
    return (
      <Container title="Your Tasks">
        <span className="m-8 text-error">Something went wrong!</span>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container title="Your Tasks">
        <span className="m-8">Loading tasks...</span>
      </Container>
    );
  }

  return (
    <Container
      title="Your Tasks"
      dialog={
        taskData.isViewTask && taskData.selectedTask ? (
          <Dialog setIsViewTask={setTaskData}>
            <TaskItem
              task={taskData.selectedTask}
              handleViewTask={() => handleViewTask(taskData.selectedTask)}
            />
          </Dialog>
        ) : null
      }
    >
      <div className="m-8 flex flex-col-reverse md:flex-row gap-8 items-start md:items-center md:justify-between">
        <Search />
        <Button
          handleClick={() => navigate('/')}
          extraBtnClasses="bg-primary text-white font-medium py-2 hover:bg-primaryHover ml-auto"
        >
          <span>Add Task</span>
          <PlusIcon height={25} className="hidden md:flex" />
        </Button>
      </div>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-bold m-8">
            Pending Tasks: <motion.span>{roundedPendingTaskCount}</motion.span>
          </h3>
          <div className="m-8 flex items-start lg:items-center gap-1 justify-between flex-col lg:flex-row">
            <span className="font-medium">Sort by:</span>
            <Select
              id="sort-by"
              defaultSelectValue={selectArray[0]}
              selectOptions={selectArray}
              handleSelectChange={handleSelectChange}
            />
          </div>
          <div>
            {pendingTasks?.map((task, index) => (
              <TaskItem
                task={task}
                key={task.$id}
                handleViewTask={() => handleViewTask(task)}
                enterFrom="left"
                index={index}
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold m-8">
            Completed Tasks: <motion.span>{roundedDoneTaskCount}</motion.span>
          </h3>
          <div>
            {doneTasks?.map((task, index) => (
              <TaskItem
                task={task}
                key={task.$id}
                handleViewTask={() => handleViewTask(task)}
                enterFrom="right"
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
