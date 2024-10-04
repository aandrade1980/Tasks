import { motion } from 'framer-motion';
import { MouseEvent, ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  disable?: boolean;
  extraBtnClasses?: string;
  handleClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  textColor?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
};

export default function Button({
  children,
  disable,
  extraBtnClasses,
  handleClick,
  textColor,
  title,
  type
}: ButtonProps) {
  const handleClickProp = type === 'submit' ? undefined : handleClick;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      type={type}
      title={title ?? ''}
      onClick={handleClickProp}
      disabled={disable}
      className={`flex gap-2 items-center text-iconColor ${extraBtnClasses} ${
        textColor ?? ''
      } rounded-md px-2 py-1`}
    >
      {children}
    </motion.button>
  );
}
