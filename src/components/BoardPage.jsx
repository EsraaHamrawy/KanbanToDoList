import Header from './layout/header/Header.jsx'
import TaskColumn from './TaskColumn/TaskColumn.jsx'
import { BOARD_COLUMNS } from './boardConstants'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTaskCards,
  selectTaskCards,
  selectTotalTaskCards,
} from '../store/slice/taskCardsSlice.js'

export default function BoardPage() {
  const dispatch = useDispatch()
  const totalTaskCards = useSelector(selectTotalTaskCards)
  const taskCards = useSelector(selectTaskCards)

  //  const dispatch = useDispatch()
  // const taskCards = useSelector(selectTaskCards)
  // const totalTaskCards = useSelector(selectTotalTaskCards)

  const tasksByColumn = useMemo(() => {
    return BOARD_COLUMNS.map((column) => ({
      ...column,
      tasks: taskCards.filter((task) => task.column === column.key),
    }))
  }, [taskCards])

  useEffect(() => {
    dispatch(fetchTaskCards())
  }, [dispatch])

  return (
    <main className="board-page">
      <section className="board-frame" aria-labelledby="board-title">
        <Header
          searchTerm=""
          totalTasks={totalTaskCards}
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
              onCreateTask={() => {}}
              onColumnDragOver={() => {}}
              onColumnDrop={() => {}}
            />
          ))}
        </section>
      </section>
    </main>
  )
}
