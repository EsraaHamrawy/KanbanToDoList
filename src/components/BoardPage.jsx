import { BOARD_COLUMNS } from "./boardConstants";
import Header from './layout/header/Header.jsx';
import TaskColumn from './TaskColumn/TaskColumn.jsx';


export default function BoardPage() {


  return (
      <main className="board-page">
            <section className="board-frame" aria-labelledby="board-title">
        <Header
          searchTerm=""
          totalTasks={0}
          visibleTaskCount={0}
          isSearching={false}
          onSearchChange={() => {}}
        />
      <section className="board-grid" aria-label="Task columns">
        {
          BOARD_COLUMNS.map((column) => (
  <TaskColumn key={column.key} column={column} onCreateTask={() => {}} onColumnDragOver={() => {}} onColumnDrop={() => {}} />
          ))

        }
        </section>
        </section>
      </main>
    
  )
}