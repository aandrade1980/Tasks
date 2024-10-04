import { SparklesIcon } from '@heroicons/react/24/solid';
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSpeechToTextHelper } from '../hooks/useSpeechToTextHelper';
import { IPayload, ITask } from '../models/interface';
import { callAI } from '../utils/ai';
import { createDocument, updateDocument } from '../utils/db';
import Button from './Button';
import Select from './Select';
import Speaker from './Speaker';

type DefaultState = {
  description: string;
  dueDate: Date;
  isGenerating: boolean;
  isSubmitting: boolean;
  priority: (typeof priorityArray)[number];
  title: string;
  titleValidationError: string;
};

type AddTaskProps = {
  task: ITask | null;
};

const priorityArray = ['low', 'medium', 'high'] as const;

export default function AddTask({ task }: AddTaskProps) {
  const navigate = useNavigate();
  const { resetTranscript, transcript } = useSpeechToTextHelper();

  const [data, setData] = useState<DefaultState>({
    description: task?.description || '',
    dueDate: task?.due_date ? new Date(task.due_date) : new Date(),
    isGenerating: false,
    isSubmitting: false,
    priority: task?.priority ?? priorityArray[0],
    title: task?.title || '',
    titleValidationError: ''
  });

  const handleUpdateState = ({
    name,
    value
  }: {
    name: keyof DefaultState;
    value: string | Date | boolean;
  }) => setData(prevData => ({ ...prevData, [name]: value }));

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;

    setData(prevData => ({
      ...prevData,
      title,
      titleValidationError: title !== '' ? '' : "Task title can't be empty"
    }));
  };

  const clearTranscript = () => resetTranscript();

  const submitTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleUpdateState({ name: 'isSubmitting', value: true });

    const { description, dueDate, priority, title } = data;

    try {
      if (!title) {
        handleUpdateState({
          name: 'titleValidationError',
          value: 'Please provide at least a title for the task!'
        });

        return;
      }

      if (title.length > 49) {
        handleUpdateState({
          name: 'titleValidationError',
          value: 'Title too long. It can only be 49 characters long'
        });

        return;
      }

      const payload: IPayload = {
        description,
        due_date: dueDate,
        title,
        priority
      };

      if (task) {
        await updateDocument(payload, task.$id);
        navigate('/tasks');
      } else {
        await createDocument(payload);

        setData({
          description: '',
          dueDate: new Date(),
          isGenerating: false,
          isSubmitting: false,
          priority: 'low',
          title: '',
          titleValidationError: ''
        });
      }
    } catch (e) {
      console.error('Error submitting task: ', e);
    } finally {
      handleUpdateState({ name: 'isSubmitting', value: false });
    }
  };

  // Service is returning a 503 error
  const handleGenerateDescription = async () => {
    const { title } = data;

    if (!title) {
      alert('Please provide a title for the task');
      return;
    }

    setData(prevData => ({ ...prevData, isGenerating: true }));

    const prompt = `Provide a description for this task: ${title}. Keep the description to a maximum of 30 words`;

    try {
      const response = await callAI(prompt);
      const responseText = await response.text();

      responseText.split('').forEach((char, index) => {
        setTimeout(() => {
          setData(prevData => ({
            ...prevData,
            description: prevData.description + char
          }));
        }, index * 32);
      });
    } catch (e) {
      console.error('Error generating description: ', e);
    } finally {
      setData(prevData => ({ ...prevData, isGenerating: false }));
    }
  };

  useEffect(() => {
    if (!task && transcript) {
      setData(prevData => ({ ...prevData, title: transcript || '' }));
    }
  }, [task, transcript]);

  const { description, titleValidationError } = data;

  const descriptionLengthError = description.length > 197;

  return (
    <form id="addTaskForm" className="m-8" onSubmit={submitTask}>
      <div className="flex flex-row justify-end items-center">
        <Speaker handleClear={clearTranscript} />
      </div>
      <FormRow htmlForm="title" labelText="Task Title">
        <input
          type="text"
          id="title"
          placeholder="Title for your task"
          value={data.title}
          onChange={handleTitleChange}
          className={`bg-inherit border rounded-sm p-2 focus:outline-none focus:ring-1 border-input focus:ring-slate-900
            ${
              titleValidationError
                ? 'border-error focus:ring-red-500 invalid:focus:ring-red-600'
                : 'border-input focus:ring-slate-900'
            }
          `}
        />

        {titleValidationError ? (
          <span className="text-error">{titleValidationError}</span>
        ) : null}
      </FormRow>
      <FormRow
        htmlForm="description"
        labelText="Task Description"
        labelClassName="mb-1"
      >
        <textarea
          id="description"
          placeholder="Describe your task"
          maxLength={200}
          value={data.isGenerating ? 'Generating...' : data.description}
          onChange={e =>
            setData(prevData => ({ ...prevData, description: e.target.value }))
          }
          className={`bg-inherit border rounded-sm p-2 h-32 resize-none 
            focus:outline-none focus:ring-1 ${
              descriptionLengthError
                ? 'border-error focus:ring-red-500 invalid:focus:ring-red-600'
                : 'border-input focus:ring-slate-900'
            }`}
        />
        {descriptionLengthError ? (
          <span className="text-error mt-1">
            Warning description getting too long. Can only be 200 characters
          </span>
        ) : null}
        <Button
          handleClick={handleGenerateDescription}
          disable={data.isGenerating}
          extraBtnClasses="bg-light mt-2 w-fit ml-auto"
        >
          <span>Generate description</span>
          <SparklesIcon height={20} />
        </Button>
      </FormRow>
      <FormRow
        htmlForm="priority"
        labelText="Task priority"
        labelClassName="mb-1"
      >
        <Select
          id="priority"
          defaultSelectValue={data.priority}
          selectOptions={[...priorityArray]}
          handleSelectChange={e =>
            setData(prevData => ({
              ...prevData,
              priority: e.target.value as DefaultState['priority']
            }))
          }
        />
      </FormRow>
      <FormRow
        htmlForm="due-date"
        labelText="Task Due Date"
        labelClassName="mb-1"
      >
        <input
          type="date"
          id="due-date"
          value={data.dueDate!.toISOString().split('T')[0]}
          min={new Date().toISOString().split('T')[0]}
          onChange={e =>
            setData(prevData => ({
              ...prevData,
              dueDate: new Date(e.target.value)
            }))
          }
          className="bg-inherit border rounded-sm border-input p-2 focus:outline-none focus:ring-1 focus:ring-slate-900 invalid:focus:ring-red-600"
        />
      </FormRow>
      <Button
        type="submit"
        extraBtnClasses="bg-pink-700 justify-center text-white 
        font-semibold px-4 py-2 outline-1 hover:bg-pink-800 focus:ring-1 focus:ring-pink-800 w-full"
        disable={data.isSubmitting}
      >
        {data.isSubmitting ? 'Submitting' : task ? 'Edit Task' : 'Add Task'}
      </Button>
    </form>
  );
}

function FormRow({
  children,
  htmlForm,
  labelText,
  labelClassName
}: {
  children: ReactNode;
  htmlForm: string;
  labelText: string;
  labelClassName?: string;
}) {
  return (
    <div className="flex flex-col mb-6">
      <label htmlFor={htmlForm} className={labelClassName}>
        {labelText}
      </label>
      {children}
    </div>
  );
}
