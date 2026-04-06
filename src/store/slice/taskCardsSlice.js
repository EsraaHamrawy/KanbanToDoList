import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const TASKS_URL = 'http://localhost:3002/tasks'

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error('Request failed')
  }

  return response.status === 204 ? null : response.json()
}

export const fetchTaskCards = createAsyncThunk('taskCards/fetchTaskCards', async () => {
  return requestJson(TASKS_URL)
})

export const createTaskCard = createAsyncThunk('taskCards/createTaskCard', async (task) => {
  return requestJson(TASKS_URL, {
    method: 'POST',
    body: JSON.stringify(task),
  })
})

export const updateTaskCard = createAsyncThunk('taskCards/updateTaskCard', async (task) => {
  return requestJson(`${TASKS_URL}/${task.id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  })
})

export const deleteTaskCard = createAsyncThunk('taskCards/deleteTaskCard', async (taskId) => {
  await requestJson(`${TASKS_URL}/${taskId}`, {
    method: 'DELETE',
  })

  return taskId
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const taskCardsSlice = createSlice({
  name: 'taskCards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskCards.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTaskCards.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTaskCards.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createTaskCard.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateTaskCard.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => task.id === action.payload.id)

        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteTaskCard.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload)
      })
  },
})

export const selectTaskCards = (state) => state.taskCards.items
export const selectTotalTaskCards = (state) => state.taskCards.items.length

export default taskCardsSlice.reducer
