import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Column,
  EditTask,
  Statuses,
  Task,
  TaskItem,
  useTaskApi,
} from '@todo/core';
import { Button, cn } from '@todo/design-system';
import { useEffect, useState } from 'react';

function App() {
  const { getTasks, createTask, updateTask, deleteTask } = useTaskApi();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [inCompleteTasks, setInCompleteTasks] = useState<TaskItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updated, setUpdated] = useState<Date>(new Date());

  const onSave = (task: TaskItem) => {
    updateTask(task.id, task).then(() => setUpdated(new Date()));
  };

  const onCreate = (task: TaskItem) => {
    createTask(task).then(() => setUpdated(new Date()));
  };

  const onDelete = (task: TaskItem) => {
    deleteTask(task.id).then(() => setUpdated(new Date()));
  };

  const filterByStatus = (data: TaskItem[], status: Statuses) => {
    return data.filter(task => task.status === status);
  };

  const toTaskTemplate = (data: TaskItem[]) => {
    return data.map(task => (
      <Task key={task.id} data={task} onSave={onSave} onDelete={onDelete} />
    ));
  };
  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;
    setActiveId(id.toString());
  };

  const onDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (!active || !over) {
      return;
    }

    if (
      active.data.current!.type === 'task' &&
      over.data.current!.type === 'task' &&
      over.id !== active.id
    ) {
      if (over.data.current!.status === active.data.current!.status) {
        const [activeTasks, setActiveTasks] =
          over.data.current!.status === Statuses.Incomplete
            ? [inCompleteTasks, setInCompleteTasks]
            : [completedTasks, setCompletedTasks];

        const activeIndex = activeTasks.findIndex(
          item => item.id === active.id
        );
        const overIndex = activeTasks.findIndex(item => item.id === over.id);
        setActiveTasks(arrayMove([...activeTasks], activeIndex, overIndex));
      } else {
        const [activeTasks, setActiveTasks] =
          over.data.current!.status === Statuses.Incomplete
            ? [completedTasks, setCompletedTasks]
            : [inCompleteTasks, setInCompleteTasks];
        const [overTasks, setOverTasks] =
          over.data.current!.status === Statuses.Incomplete
            ? [inCompleteTasks, setInCompleteTasks]
            : [completedTasks, setCompletedTasks];
        const activeIndex = activeTasks.findIndex(
          item => item.id === active.id
        );
        const overIndex = overTasks.findIndex(item => item.id === over.id);
        const cloneOverTasks = [...overTasks];
        const cloneActiveTasks = [...activeTasks];
        const [removeItem] = cloneActiveTasks.splice(activeIndex, 1);
        const movedTask = {
          ...removeItem,
          status: over.data.current!.status as Statuses,
        };
        cloneOverTasks.splice(overIndex, 0, movedTask);

        setActiveTasks(cloneActiveTasks);
        setOverTasks(cloneOverTasks);
      }
    }

    if (
      active.data.current!.type === 'task' &&
      over.data.current!.type === 'column' &&
      over.id !== active.id
    ) {
      const [activeTasks, setActiveTasks] =
        over.id === Statuses.Incomplete
          ? [completedTasks, setCompletedTasks]
          : [inCompleteTasks, setInCompleteTasks];
      const [overTasks, setOverTasks] =
        over.id === Statuses.Incomplete
          ? [inCompleteTasks, setInCompleteTasks]
          : [completedTasks, setCompletedTasks];
      const activeIndex = activeTasks.findIndex(item => item.id === active.id);
      const cloneTasks = [...activeTasks];
      const [removeItem] = cloneTasks.splice(activeIndex, 1);
      const movedTask = {
        ...removeItem,
        status: over.id as Statuses,
      };
      setActiveTasks(cloneTasks);
      setOverTasks([...overTasks, movedTask]);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    onDragMove(event);
    setActiveId(null);
    const changedTasks = [...inCompleteTasks, ...completedTasks].filter(task =>
      tasks.some(
        originalTask =>
          originalTask.id === task.id && originalTask.status !== task.status
      )
    );

    await Promise.all(changedTasks.map(task => updateTask(task.id, task)));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    getTasks().then(tasks => setTasks(tasks));
  }, [updated]);

  useEffect(() => {
    setInCompleteTasks(filterByStatus(tasks, Statuses.Incomplete));
    setCompletedTasks(filterByStatus(tasks, Statuses.Completed));
  }, [tasks]);

  return (
    <section
      className={cn('flex h-screen w-screen flex-col items-center gap-4')}>
      <header>
        <label className={'text-h2 font-bold text-global-blue-200'}>
          Todo List
        </label>
      </header>
      <main
        className={cn('flex h-[calc(100%-100px)] w-full justify-center gap-2')}>
        <DndContext
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          sensors={sensors}
          collisionDetection={closestCorners}>
          <Column status={Statuses.Incomplete}>
            <SortableContext
              id={Statuses.Incomplete}
              items={inCompleteTasks.map(item => item.id)}
              strategy={verticalListSortingStrategy}>
              {toTaskTemplate(inCompleteTasks)}
            </SortableContext>
            <EditTask onSave={onCreate}>
              <Button size={'lg'} className={'!min-h-11 !w-full'}>
                Add Task
              </Button>
            </EditTask>
          </Column>
          <Column status={Statuses.Completed}>
            <SortableContext
              id={Statuses.Completed}
              items={completedTasks.map(item => item.id)}
              strategy={verticalListSortingStrategy}>
              {toTaskTemplate(completedTasks)}
            </SortableContext>
          </Column>
          <DragOverlay adjustScale={false}>
            <Task data={tasks.find(item => item.id === activeId) as TaskItem} />
          </DragOverlay>
        </DndContext>
      </main>
    </section>
  );
}

export default App;
