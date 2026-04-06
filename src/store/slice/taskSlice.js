import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchTasks =  createAsyncThunk ('tasks/fetchTasks', async () => {
  const response = await fetch('http://localhost:3002/tasks')
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
export const selectTotalTasks = (state) => state.tasks.items.length

export default tasksSlice.reducer

