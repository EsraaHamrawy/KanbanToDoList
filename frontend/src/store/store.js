import { configureStore } from '@reduxjs/toolkit'
import taskCardsReducer from './slice/taskCardsSlice.js'

const store = configureStore({
  reducer: {
    taskCards: taskCardsReducer,
  },
})

export default store


