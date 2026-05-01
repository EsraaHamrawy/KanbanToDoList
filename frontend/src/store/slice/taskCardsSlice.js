import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../../config/api'

const TASKS_URL = `${API_BASE_URL}/tasks`

const COLUMN_ALIASES = {
  backlog: 'backlog',
  todo: 'backlog',
  to_do: 'backlog',
  'to-do': 'backlog',
  in_progress: 'in_progress',
  inprogress: 'in_progress',
  'in-progress': 'in_progress',
  review: 'review',
  in_review: 'review',
  'in-review': 'review',
  done: 'done',
  completed: 'done',
}

const normalizeColumnKey = (column) => {
  if (!column) return 'backlog'
  const normalized = String(column).trim().toLowerCase().replace(/\s+/g, '_')
  return COLUMN_ALIASES[normalized] ?? 'backlog'
}

const parseResponseBody = async (response) => {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  const contentLength = response.headers.get('content-length')

  if (contentLength === '0') {
    return null
  }

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { message: text } : null
}

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const body = await parseResponseBody(response)

  if (!response.ok) {
    const errorMessage = body?.message || `Request failed with status ${response.status}`
    throw new Error(errorMessage)
  }

  return body
}

export const fetchTaskCards = createAsyncThunk('taskCards/fetchTaskCards', async () => {
  return requestJson(TASKS_URL)
})

const normalizeTasks = (tasks) => {
  const columnOrderMap = new Map()

  return tasks.map((task) => {
    const normalizedColumn = normalizeColumnKey(task.column ?? (task.completed ? 'done' : 'backlog'))
    const currentOrder = columnOrderMap.get(normalizedColumn) ?? 0
    columnOrderMap.set(normalizedColumn, currentOrder + 1)

    return {
      ...task,
      column: normalizedColumn,
      order: typeof task.order === 'number' ? task.order : currentOrder,
    }
  })
}

export const createTaskCard = createAsyncThunk('taskCards/createTaskCard', async (task) => {
  const createdTask = await requestJson(TASKS_URL, {
    method: 'POST',
    body: JSON.stringify({
      ...task,
      column: normalizeColumnKey(task.column),
      completed: normalizeColumnKey(task.column) === 'done',
    }),
  })

  return {
    ...task,
    ...(createdTask || {}),
    column: normalizeColumnKey(createdTask?.column ?? task.column),
  }
})

export const updateTaskCard = createAsyncThunk('taskCards/updateTaskCard', async (task) => {
  const updatedTask = await requestJson(`${TASKS_URL}/${task.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...task,
      column: normalizeColumnKey(task.column),
      completed: normalizeColumnKey(task.column) === 'done',
    }),
  })

  return {
    ...task,
    ...(updatedTask || {}),
    column: normalizeColumnKey(updatedTask?.column ?? task.column),
  }
})

export const deleteTaskCard = createAsyncThunk('taskCards/deleteTaskCard', async (taskId) => {
  await requestJson(`${TASKS_URL}/${taskId}`, {
    method: 'DELETE',
  })

  return taskId
})

export const moveTaskCard = createAsyncThunk(
  'taskCards/moveTaskCard',
  async ({ taskId, targetColumn, targetTaskId }, { getState }) => {
    const stateTasks = getState().taskCards?.items || []
    const tasks = normalizeTasks(stateTasks)
    const draggedTask = tasks.find((task) => task.id === taskId)

    if (!draggedTask) {
      throw new Error('Task not found')
    }

    const normalizedTargetColumn = normalizeColumnKey(targetColumn)
    const sourceColumn = draggedTask.column
    const sourceTasks = tasks.filter((task) => task.column === sourceColumn && task.id !== taskId).sort((a, b) => a.order - b.order)
    const destinationTasks = (sourceColumn === normalizedTargetColumn ? sourceTasks : tasks.filter((task) => task.column === normalizedTargetColumn)).sort((a, b) => a.order - b.order)

    draggedTask.column = normalizedTargetColumn

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

      if (task.column === normalizedTargetColumn) {
        return reindexedDestination.find((item) => item.id === task.id) ?? task
      }

      return task
    })

    await Promise.all(
      updatedTasks
        .filter((task) => task.column === sourceColumn || task.column === normalizedTargetColumn)
        .map((task) =>
          requestJson(`${TASKS_URL}/${task.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              ...task,
              completed: normalizeColumnKey(task.column) === 'done',
            }),
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
        const normalizedTask = normalizeTasks([action.payload])[0]
        const createdTask = {
          ...normalizedTask,
          order: typeof normalizedTask.order === 'number' ? normalizedTask.order : 0,
        }

        state.items.unshift(createdTask)
      })
      .addCase(updateTaskCard.fulfilled, (state, action) => {
        const normalizedTask = normalizeTasks([action.payload])[0]
        const index = state.items.findIndex((task) => task.id === normalizedTask.id)

        if (index !== -1) {
          state.items[index] = normalizedTask
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
