import { priorityToneMap } from '../boardConstants'
import './TaskCard.css'

export default function TaskCard({
  task,
  onOpenTaskDialog = () => {},
  onDragStart = () => {},
  onDragEnd = () => {},
  onDragOver = () => {},
  onDrop = () => {},
  isDragging,
  isDropTarget,
}) {
  const priorityTone = priorityToneMap[task.priority] || 'low'

  return (
    <article
      className={`task-card${isDragging ? ' task-card--dragging' : ''}${isDropTarget ? ' task-card--drop-target' : ''}`}
      draggable
      onDragStart={(event) => onDragStart(event, task)}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        event.stopPropagation()
        onDragOver(event, task)
      }}
      onDrop={(event) => {
        event.stopPropagation()
        onDrop(event, task)
      }}
    >
      <div className="task-card__content">
        <h3 className="task-card__title">{task.title}</h3>
        <p className="task-card__description">{task.description}</p>
      </div>

      <div className="task-card__footer">
        <span className={`task-card__badge task-card__badge--${priorityTone}`}>{task.priority}</span>

        <div className="task-card__actions">
          <button type="button" className="task-card__action" onClick={() => onOpenTaskDialog('edit', task)}>
            Edit
          </button>
          <button type="button" className="task-card__action task-card__action--danger" onClick={() => onOpenTaskDialog('delete', task)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
