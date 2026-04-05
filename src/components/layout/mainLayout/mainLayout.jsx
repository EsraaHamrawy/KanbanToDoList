import React from 'react'
import { Outlet } from "react-router-dom";
import "./mainLayout.css";
import Header from '../header/Header.jsx';
import TaskColumn from '../../TaskColumn/TaskColumn.jsx';
function MainLayout() {
  return (
    <div>
      <main  className="board-page">
      <section className="board-frame" aria-labelledby="board-title">
        <Header />
        <TaskColumn />
          <Outlet />
      </section>
      </main>
    </div>
  )
}

export default MainLayout
