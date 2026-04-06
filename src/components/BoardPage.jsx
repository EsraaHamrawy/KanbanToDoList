import Header from './layout/header/Header.jsx'
import TaskColumn from './TaskColumn/TaskColumn.jsx'
import { BOARD_COLUMNS } from './boardConstants'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {createTaskCard, deleteTaskCard, fetchTaskCards, selectTaskCards, selectTotalTaskCards, updateTaskCard } from './../store/slice/taskCardsSlice'
import TaskActionDialog from './TaskCard/TaskActionDialog'
import { PRIORITY_OPTIONS } from './boardConstants'

export default function BoardPage() {
  const dispatch = useDispatch()
  const totalTasks = useSelector(selectTotalTaskCards)
  const taskCards = useSelector(selectTaskCards)
  const [dialogState, setDialogState] = useState({
    open: false,
    action: 'add',
    task: null,
    column: BOARD_COLUMNS[0].key,
    formValues: {
      title: '',
      description: '',
      priority: PRIORITY_OPTIONS[0],
      column: BOARD_COLUMNS[0].key,
    },
  })

  const tasksByColumn = useMemo(() => {
    return BOARD_COLUMNS.map((column) => ({
      ...column,
      tasks: taskCards.filter((task) => task.column === column.key),
    }))
  }, [taskCards])

  useEffect(() => {
    dispatch(fetchTaskCards())
  }, [dispatch])

  const openTaskDialog = (mode, task = null, columnKey = BOARD_COLUMNS[0].key) => {
    setDialogState({
      open: true,
      action: mode,
      task,
      column: columnKey,
      formValues: {
        title: task?.title ?? '',
        description: task?.description ?? '',
        priority: task?.priority ?? PRIORITY_OPTIONS[0],
        column: task?.column ?? columnKey,
      },
    })
  }

  const closeTaskDialog = () => {
    setDialogState((current) => ({ ...current, open: false }))
  }

  const handleDialogFormChange = (field, value) => {
    setDialogState((current) => ({
      ...current,
      formValues: {
        ...current.formValues,
        [field]: value,
      },
    }))
  }

  const handleDialogConfirm = async () => {
    const { action, task, formValues } = dialogState

    if (action === 'add') {
      await dispatch(
        createTaskCard({
          id: crypto.randomUUID(),
          title: formValues.title.trim(),
          description: formValues.description.trim(),
          priority: formValues.priority,
          column: formValues.column,
        })
      ).unwrap()
      closeTaskDialog()
      return
    }

    if (action === 'edit' && task) {
      await dispatch(
        updateTaskCard({
          ...task,
          title: formValues.title.trim(),
          description: formValues.description.trim(),
          priority: formValues.priority,
          column: formValues.column,
        })
      ).unwrap()
      closeTaskDialog()
      return
    }

    if (action === 'delete' && task) {
      await dispatch(deleteTaskCard(task.id)).unwrap()
      closeTaskDialog()
    }
  }

  return (
    <main className="board-page">
      <section className="board-frame" aria-labelledby="board-title">
        <Header
          searchTerm=""
          totalTasks={totalTasks}
          visibleTaskCount={0}
          isSearching={false}
          onSearchChange={() => {}}
        />

        <section className="board-grid" aria-label="Task columns">
          {tasksByColumn.map((column) => (
            <TaskColumn
              key={column.key}
              column={column}
              tasks={column.tasks}
              onOpenTaskDialog={(mode, task) => openTaskDialog(mode, task, column.key)}
              onCreateTask={(columnKey) => openTaskDialog('add', null, columnKey)}
              onColumnDragOver={() => {}}
              onColumnDrop={() => {}}
            />
          ))}
        </section>
      </section>

      <TaskActionDialog
        open={dialogState.open}
        mode={dialogState.action}
        task={dialogState.task ?? { title: '', description: '' }}
        formValues={dialogState.formValues}
        onFormChange={handleDialogFormChange}
        onClose={closeTaskDialog}
        onConfirm={handleDialogConfirm}
      />
    </main>
  )
}
