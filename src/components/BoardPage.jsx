import Header from './layout/header/Header.jsx'
import TaskColumn from './TaskColumn/TaskColumn.jsx'
import { BOARD_COLUMNS } from './boardConstants'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {createTaskCard, deleteTaskCard, fetchTaskCards, moveTaskCard, selectTaskCards, selectTotalTaskCards, updateTaskCard } from './../store/slice/taskCardsSlice'
import TaskActionDialog from './TaskCard/TaskActionDialog'
import { PRIORITY_OPTIONS } from './boardConstants'

export default function BoardPage() {
  const dispatch = useDispatch()
  const totalTasks = useSelector(selectTotalTaskCards)
  const taskCards = useSelector(selectTaskCards)
  const [searchTerm, setSearchTerm] = useState('')
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
      const normalizedSearchTerm = searchTerm.trim().toLowerCase()
    const filteredTasks = normalizedSearchTerm
      ? taskCards.filter((task) => {
          const searchableText = `${task.title} ${task.description}`.toLowerCase()

          return searchableText.includes(normalizedSearchTerm)
        })
      : taskCards
    return BOARD_COLUMNS.map((column) => ({
      ...column,
      tasks: filteredTasks
        .filter((task) => task.column === column.key)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }))
  }, [taskCards, searchTerm])

const trimmedSearchTerm = searchTerm.trim()
  const visibleTaskCount = tasksByColumn.reduce((count, column) => count + column.tasks.length, 0)
  const isSearching = trimmedSearchTerm.length > 0

  const [draggingTaskId, setDraggingTaskId] = useState(null)
  const [dropTaskId, setDropTaskId] = useState(null)
  const [dropColumnKey, setDropColumnKey] = useState(null)

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
      const nextOrder = taskCards
        .filter((item) => item.column === formValues.column)
        .reduce((maxOrder, item) => Math.max(maxOrder, item.order ?? 0), -1) + 1

      await dispatch(
        createTaskCard({
          id: crypto.randomUUID(),
          title: formValues.title.trim(),
          description: formValues.description.trim(),
          priority: formValues.priority,
          column: formValues.column,
          order: nextOrder,
        })
      ).unwrap()
      closeTaskDialog()
      return
    }

    if (action === 'edit' && task) {
      const nextColumn = formValues.column
      const nextOrder =
        nextColumn === task.column
          ? task.order ?? 0
          : taskCards
              .filter((item) => item.column === nextColumn && item.id !== task.id)
              .reduce((maxOrder, item) => Math.max(maxOrder, item.order ?? 0), -1) + 1

      await dispatch(
        updateTaskCard({
          ...task,
          title: formValues.title.trim(),
          description: formValues.description.trim(),
          priority: formValues.priority,
          column: nextColumn,
          order: nextOrder,
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

  const handleTaskDragStart = (event, task) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', task.id)
    setDraggingTaskId(task.id)
  }

  const handleTaskDragEnd = () => {
    setDraggingTaskId(null)
    setDropTaskId(null).
    setDropColumnKey(null)
  }

  const handleTaskDragOver = (event, task) => {
    event.preventDefault()

    if (task.id !== draggingTaskId) {
      setDropTaskId(task.id)
      setDropColumnKey(task.column)
    }
  }

  const handleTaskDrop = async (event, task) => {
    event.preventDefault()

    const taskId = draggingTaskId || event.dataTransfer.getData('text/plain')

    if (!taskId || taskId === task.id) {
      handleTaskDragEnd()
      return
    }

    await dispatch(
      moveTaskCard({
        taskId,
        targetColumn: task.column,
        targetTaskId: task.id,
      })
    )

    handleTaskDragEnd()
  }

  const handleColumnDragOver = (event, columnKey) => {
    event.preventDefault()
    setDropColumnKey(columnKey)
    setDropTaskId(null)
  }

  const handleColumnDrop = async (event, columnKey) => {
    event.preventDefault()

    const taskId = draggingTaskId || event.dataTransfer.getData('text/plain')

    if (!taskId) {
      handleTaskDragEnd()
      return
    }

    const draggedTask = taskCards.find((task) => task.id === taskId)

    if (!draggedTask) {
      handleTaskDragEnd()
      return
    }

    if (draggedTask.column === columnKey && dropTaskId === null) {
      handleTaskDragEnd()
      return
    }

    await dispatch(
      moveTaskCard({
        taskId,
        targetColumn: columnKey,
        targetTaskId: null,
      })
    )

    handleTaskDragEnd()
  }

  return (
    <main className="board-page">
      <section className="board-frame" aria-labelledby="board-title">
        <Header
          searchTerm={searchTerm}
          totalTasks={totalTasks}
          visibleTaskCount={visibleTaskCount}
          isSearching={isSearching}
          onSearchChange={setSearchTerm}
        />

        <section className="board-grid" aria-label="Task columns">
          {tasksByColumn.map((column) => (
            <TaskColumn
              key={column.key}
              column={column}
              tasks={column.tasks}
              onOpenTaskDialog={(mode, task) => openTaskDialog(mode, task, column.key)}
              onCreateTask={(columnKey) => openTaskDialog('add', null, columnKey)}
              onColumnDragOver={handleColumnDragOver}
              onColumnDrop={handleColumnDrop}
              onTaskDragStart={handleTaskDragStart}
              onTaskDragEnd={handleTaskDragEnd}
              onTaskDragOver={handleTaskDragOver}
              onTaskDrop={handleTaskDrop}
              draggingTaskId={draggingTaskId}
              dropTaskId={dropTaskId}
              isDropTarget={dropColumnKey === column.key}
            />
          ))}
        </section>
      </section>

      <TaskActionDialog
        open={dialogState.open}
        action={dialogState.action}
        task={dialogState.task ?? { title: '', description: '' }}
        formValues={dialogState.formValues}
        onFormChange={handleDialogFormChange}
        onClose={closeTaskDialog}
        onConfirm={handleDialogConfirm}
      />
    </main>
  )
}
