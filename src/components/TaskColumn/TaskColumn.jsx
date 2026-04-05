import './TaskColumn.css'

export default function TaskColumn({
  column={},
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
        <span className="board-column__count">0</span>
      </header>

      <div className="board-column__cards" />

      <button className="board-column__add" type="button" onClick={() => onCreateTask(column.key)}>
        + Add task
      </button>
    </article>
  )
}
