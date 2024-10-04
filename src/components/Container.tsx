import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Container({
  title,
  children,
  dialog
}: {
  title: string;
  children?: ReactNode;
  dialog?: ReactNode;
}) {
  const splitTitle = title.split(' ');

  return (
    <main className="container mx-auto">
      <section className="max-w-5xl mx-auto m-12 p-16">
        {dialog}
        <h1 className="text-4xl md:text-7xl font-bold text-center py-3 mb-16">
          {splitTitle.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index / 10 }}
            >
              {char}{' '}
            </motion.span>
          ))}
        </h1>
        {children}
      </section>
    </main>
  );
}
