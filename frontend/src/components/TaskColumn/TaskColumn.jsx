import TaskCard from '../TaskCard/TaskCard'
import Skeleton from '@mui/material/Skeleton'
import './TaskColumn.css'

export default function TaskColumn({
  column,
  tasks = [],
  isDropTarget,
  onOpenTaskDialog = () => {},
  onCreateTask = () => {},
  onColumnDragOver = () => {},
  onColumnDrop = () => {},
  onTaskDragStart = () => {},
  onTaskDragEnd = () => {},
  onTaskDragOver = () => {},
  onTaskDrop = () => {},
  draggingTaskId,
  dropTaskId,
  isLoading = false,
}) {
  const skeletonCount = 3

  return (
    <article
      className={`board-column${isDropTarget ? ' board-column--drop-target' : ''}`}
      aria-busy={isLoading}
      onDragOver={(event) => onColumnDragOver(event, column.key)}
      onDrop={(event) => onColumnDrop(event, column.key)}
    >
      <header className="board-column__header">
        <div className="board-column__title-wrap">
          <span
            className="board-column__dot"
            style={{ '--column-accent': column.accent }}
            aria-hidden="true"
          />
          <h2>{column.label}</h2>
        </div>
        {isLoading ? <Skeleton variant="rounded" width={28} height={22} /> : <span className="board-column__count">{tasks.length}</span>}
      </header>

      <div className="board-column__cards">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <article className="task-card task-card--skeleton" key={`skeleton-${column.key}-${index}`}>
                <div className="task-card__content">
                  <Skeleton variant="rounded" width="70%" height={18} />
                  <Skeleton variant="rounded" width="100%" height={12} />
                  <Skeleton variant="rounded" width="88%" height={12} />
                </div>
                <div className="task-card__footer">
                  <Skeleton variant="rounded" width={52} height={18} />
                  <div className="task-card__actions">
                    <Skeleton variant="rounded" width={34} height={22} />
                    <Skeleton variant="rounded" width={42} height={22} />
                  </div>
                </div>
              </article>
            ))
          : tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onOpenTaskDialog={onOpenTaskDialog}
                onDragStart={onTaskDragStart}
                onDragEnd={onTaskDragEnd}
                onDragOver={onTaskDragOver}
                onDrop={onTaskDrop}
                isDragging={draggingTaskId === task.id}
                isDropTarget={dropTaskId === task.id}
              />
            ))}
      </div>

      <button className="board-column__add" type="button" onClick={() => onCreateTask(column.key)}>
        + Add task
      </button>
    </article>
  )
}
