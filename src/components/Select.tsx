import { ChangeEvent, useState } from 'react';

type SelectProps = {
  id: string;
  defaultSelectValue: string;
  selectOptions: string[];
  handleSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export default function Select(props: SelectProps) {
  const { id, defaultSelectValue, selectOptions, handleSelectChange } = props;

  const [selectValue, setSelectValue] = useState(defaultSelectValue);

  return (
    <select
      id={id}
      value={selectValue}
      onChange={e => {
        setSelectValue(e.target.value);
        handleSelectChange(e);
      }}
      className="bg-base border rounded-sm border-input p-2 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
    >
      {selectOptions.map(option => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  );
}
