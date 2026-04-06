import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './slice/taskSlice.js' 

const store = configureStore({
  reducer: {
  tasks:tasksReducer
  },
})

export default store


