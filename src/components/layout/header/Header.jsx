import './Header.css'

export default function Header({ searchTerm, totalTasks, visibleTaskCount, isSearching, onSearchChange }) {
  return (
    <header className="board-topbar">
      <div className="board-brand">
        <span className="board-brand__icon" aria-hidden="true">
          KB
        </span>
        <div>
          <h1 id="board-title">Kanban Board</h1>
          <p>{isSearching ? `${visibleTaskCount} matching tasks` : `${totalTasks} tasks`}</p>
        </div>
      </div>

      <label className="search-bar" htmlFor="task-search">
        <span className="search-bar__icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id="task-search"
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />
      </label>
    </header>
  )
}
