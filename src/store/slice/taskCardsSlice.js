import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchTaskCards = createAsyncThunk('taskCards/fetchTaskCards', async () => {
  const response = await fetch('http://localhost:3002/tasks')

  if (!response.ok) {
    throw new Error('Failed to load task cards')
  }

  return response.json()
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
  },
})

export const selectTaskCards = (state) => state.taskCards.items
export const selectTotalTaskCards = (state) => state.taskCards.items?.length

export default taskCardsSlice.reducer
