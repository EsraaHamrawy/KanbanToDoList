import TaskCard from '../TaskCard/TaskCard'
import './TaskColumn.css'

export default function TaskColumn({
  column,
  tasks = [],
  isDropTarget,
  onCreateTask = () => {},
  onColumnDragOver = () => {},
  onColumnDrop = () => {},
}) {
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
            style={{ '--column-accent': column.accent }}
            aria-hidden="true"
          />
          <h2>{column.label}</h2>
        </div>
        <span className="board-column__count">{tasks.length}</span>
      </header>

      <div className="board-column__cards">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <button className="board-column__add" type="button" onClick={() => onCreateTask(column.key)}>
        + Add task
      </button>
    </article>
  )
}
