import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../../config/api'

const TASKS_URL = `${API_BASE_URL}/tasks`

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

const normalizeTasks = (tasks) => {
  const columnOrderMap = new Map()

  return tasks.map((task) => {
    const currentOrder = columnOrderMap.get(task.column) ?? 0
    columnOrderMap.set(task.column, currentOrder + 1)

    return {
      ...task,
      order: typeof task.order === 'number' ? task.order : currentOrder,
    }
  })
}

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

export const moveTaskCard = createAsyncThunk(
  'taskCards/moveTaskCard',
  async ({ taskId, targetColumn, targetTaskId }) => {
    const response = await fetch(TASKS_URL)

    if (!response.ok) {
      throw new Error('Request failed')
    }

    const tasks = normalizeTasks(await response.json())
    const draggedTask = tasks.find((task) => task.id === taskId)

    if (!draggedTask) {
      throw new Error('Task not found')
    }

    const sourceColumn = draggedTask.column
    const sourceTasks = tasks.filter((task) => task.column === sourceColumn && task.id !== taskId).sort((a, b) => a.order - b.order)
    const destinationTasks = (sourceColumn === targetColumn ? sourceTasks : tasks.filter((task) => task.column === targetColumn)).sort((a, b) => a.order - b.order)

    draggedTask.column = targetColumn

    const insertIndex = targetTaskId
      ? destinationTasks.findIndex((task) => task.id === targetTaskId)
      : destinationTasks.length

    if (insertIndex >= 0) {
      destinationTasks.splice(insertIndex, 0, draggedTask)
    } else {
      destinationTasks.push(draggedTask)
    }

    const reindexedSource = sourceTasks.map((task, index) => ({ ...task, order: index }))
    const reindexedDestination = destinationTasks.map((task, index) => ({ ...task, order: index }))

    const updatedTasks = tasks.map((task) => {
      if (task.column === sourceColumn) {
        return reindexedSource.find((item) => item.id === task.id) ?? task
      }

      if (task.column === targetColumn) {
        return reindexedDestination.find((item) => item.id === task.id) ?? task
      }

      return task
    })

    await Promise.all(
      updatedTasks
        .filter((task) => task.column === sourceColumn || task.column === targetColumn)
        .map((task) =>
          requestJson(`${TASKS_URL}/${task.id}`, {
            method: 'PUT',
            body: JSON.stringify(task),
          })
        )
    )

    return updatedTasks
  }
)

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
        state.items = normalizeTasks(action.payload)
      })
      .addCase(fetchTaskCards.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createTaskCard.fulfilled, (state, action) => {
        const createdTask = {
          ...action.payload,
          order: typeof action.payload.order === 'number' ? action.payload.order : 0,
        }

        state.items.unshift(createdTask)
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
      .addCase(moveTaskCard.fulfilled, (state, action) => {
        state.items = action.payload
      })
  },
})

export const selectTaskCards = (state) => state.taskCards.items
export const selectTaskCardsStatus = (state) => state.taskCards.status
export const selectTotalTaskCards = (state) => state.taskCards.items.length

export default taskCardsSlice.reducer
