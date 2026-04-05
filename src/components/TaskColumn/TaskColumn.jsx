
import TaskCard from '../TaskCard/TaskCard'
import './TaskColumn.css'
// import { EmptyColumnState, ErrorColumnState, LoadingColumnState } from '../sharedStates.jsx'

export default function TaskColumn({
  column,
  totalCount,
  tasks,
  isSearching,
  visibleLimit,
  isLoading,
  isError,
  isDropTarget,
  hasMoreTasks,
  remainingCount,
  onLoadMore,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onColumnDragOver,
  onColumnDrop,
  onTaskDragStart,
  onTaskDragEnd,
  onTaskDragOver,
  onTaskDrop,
  draggingTaskId,
  dropTaskId,
}) {
  // const renderedTasks = isSearching ? tasks : tasks.slice(0, visibleLimit)

  return (
    <article
      className={`board-column${isDropTarget ? ' board-column--drop-target' : ''}`}
      onDragOver={(event) => onColumnDragOver(event, column.key)}
      onDrop={(event) => onColumnDrop(event, column.key)}
    >
      <header className="board-column__header">
        <div className="board-column__title-wrap">
          <span
            className="board-column__dot"
            // style={{ '--column-accent': column.accent }}
            aria-hidden="true"
          />
          <h2>
            {/* {column.label} */}
            label
            </h2>
        </div>
        <span className="board-column__count">{totalCount}</span>
      </header>

      {isLoading ? (
        <p>LoadingColumnState</p>
        // <LoadingColumnState />
      ) : isError ? (
        <p>ErrorColumnState</p>
        // <ErrorColumnState label={column.label} />
      ) :
      //  renderedTasks.length > 0 ? (
        <div className="board-column__cards">
          <p>TaskCard</p>
          <TaskCard />
          {/* {renderedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={onTaskDragStart}
              onDragEnd={onTaskDragEnd}
              onDragOver={onTaskDragOver}
              onDrop={onTaskDrop}
              isDragging={draggingTaskId === task.id}
              isDropTarget={dropTaskId === task.id}
            />
          ))} */}
        </div>
      // ) : (
      //   <p>EmptyColumnState</p>
      //   // <EmptyColumnState label={column.label} isSearching={isSearching} />
      // )
      }

      {hasMoreTasks ? (
        <button className="board-column__load-more" type="button" onClick={() => onLoadMore(column.key)}>
          Load more ({remainingCount})
        </button>
      ) : null}

      <button className="board-column__add" type="button" onClick={() => onCreateTask(column.key)}>
        + Add task
      </button>
    </article>
  )
}
