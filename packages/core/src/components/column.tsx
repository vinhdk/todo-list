import { useDroppable } from '@dnd-kit/core';
import { Statuses } from '@todo/core';
import { cn } from '@todo/design-system';
import { PropsWithChildren } from 'react';

export type ColumnProps = {
  status: Statuses;
};

export function Column({ children, status }: PropsWithChildren<ColumnProps>) {
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: 'column',
      status,
    },
  });
  return (
    <article
      className={cn(
        'flex h-full w-1/2 min-w-[200px] max-w-[400px] flex-col overflow-hidden rounded-xl'
      )}>
      <header
        className={cn(
          'inline-flex w-full items-center justify-center px-2 py-3',
          status === Statuses.Completed
            ? 'bg-primary-sc-500'
            : 'bg-primary-pm-500'
        )}>
        <label className={'text-h5 font-bold text-white'}>{status}</label>
      </header>
      <main
        ref={setNodeRef}
        className={cn(
          'flex h-[calc(100%-62px)] w-full flex-col gap-1 overflow-y-auto overflow-x-hidden bg-gray-100 px-1 py-2'
        )}>
        {children}
      </main>
    </article>
  );
}
