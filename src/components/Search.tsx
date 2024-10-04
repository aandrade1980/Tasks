import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { FormEvent, useState } from 'react';

import { ITask } from '../models/interface';
import { searchTasks } from '../utils/db';
import Button from './Button';
import Dialog from './Dialog';
import TaskItem from './TaskItem';

export default function Search() {
  const [searchData, setSearchData] = useState({
    term: '',
    isSearching: false,
    searchedTasks: [] as ITask[],
    error: ''
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { term } = searchData;

    if (!term) {
      setSearchData({
        ...searchData,
        error: 'Please enter a search term',
        isSearching: false
      });
    }

    if (term.length > 0) {
      setSearchData({ ...searchData, isSearching: true });

      const response = await searchTasks(term);

      console.log({ response });

      if (response.length === 0) {
        setSearchData({
          ...searchData,
          error: 'No tasks found',
          isSearching: false
        });

        return;
      }

      setSearchData({
        ...searchData,
        searchedTasks: response as ITask[],
        isSearching: false
      });
    }
  };

  const { searchedTasks, term, error, isSearching } = searchData;

  return (
    <div className="flex flex-col w-full md:w-1/2">
      <form
        className="flex flex-col md:flex-row items-start md:items-center gap-2"
        onSubmit={handleSubmit}
      >
        {searchedTasks.length > 0 ? (
          <Dialog setSearchedTasks={setSearchData}>
            {searchedTasks.map(task => (
              <TaskItem key={task.$id} task={task} />
            ))}
          </Dialog>
        ) : null}

        <input
          aria-roledescription="search"
          type="text"
          id="search"
          placeholder="Search tasks"
          value={term}
          onChange={e => setSearchData({ ...searchData, term: e.target.value })}
          className={`bg-inherit w-5/6 border rounded-md p-2 focus:outline-none focus:ring-1
          ${
            error
              ? 'border-error focus:ring-red-500 invalid:focus:ring-red-600'
              : 'border-input focus:ring-slate-900'
          }`}
        />
        <Button
          type="submit"
          extraBtnClasses="bg-primary text-white hover:bg-primaryHover font-medium text-main py-2"
        >
          <span>{isSearching ? 'Searching' : 'Search'}</span>
          <MagnifyingGlassIcon height={20} />
        </Button>
      </form>
      <span className="text-error font-medium mt-1">{error}</span>
    </div>
  );
}
