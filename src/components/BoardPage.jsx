
import { useEffect } from "react";
import { fetchTasks ,selectTotalTasks} from "../store/slice/taskSlice.js";
import { BOARD_COLUMNS } from "./boardConstants";
import Header from './layout/header/Header.jsx';
import TaskColumn from './TaskColumn/TaskColumn.jsx';
import { useDispatch, useSelector } from "react-redux";


export default function BoardPage() {
  const Dispatch = useDispatch()
  const totalTasks = useSelector(selectTotalTasks)

  useEffect(() => {
    // Dispatch an action to fetch tasks from the API when the component mounts
    Dispatch(fetchTasks())
  }, [Dispatch])
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