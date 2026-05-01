import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../../config/api'

export const fetchTasks =  createAsyncThunk ('tasks/fetchTasks', async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`)
  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  return response.json()

})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
extraReducers: (builder) => {
  builder
  .addCase(fetchTasks.pending, (state) => {
    state.status = 'loading'
    state.error = null
  })
  .addCase(fetchTasks.fulfilled, (state, action) => {
    state.status = 'succeeded'
    state.items = action.payload
  })
  .addCase(fetchTasks.rejected, (state, action) => {
    state.status = 'failed'
    state.error = action.error.message
})
},
})
export const selectTotalTaskCards = (state) => state.tasks.items.length

export default tasksSlice.reducer

