import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { BOARD_COLUMNS, PRIORITY_OPTIONS } from '../boardConstants'

const ACTION_UI = {
  add: {
    title: 'Add task',
    idleLabel: 'Add',
    loadingLabel: 'Adding...',
    color: 'primary',
    withForm: true,
  },
  edit: {
    title: 'Edit task',
    idleLabel: 'Save',
    loadingLabel: 'Saving...',
    color: 'primary',
    withForm: true,
  },
  delete: {
    title: 'Delete task?',
    idleLabel: 'Delete',
    loadingLabel: 'Deleting...',
    color: 'error',
    withForm: false,
  },
}

export default function TaskActionDialog({
  open,
  action,
  task,
  formValues,
  errors = {},
  onFormChange,
  onClose,
  onConfirm,
  isSubmittingAction = false,
}) {
  const currentActionUi = ACTION_UI[action] || ACTION_UI.add
  const isFormMode = currentActionUi.withForm
  const dialogTitle = currentActionUi.title
  const isFormInvalid = !formValues.title?.trim() || !formValues.description?.trim()
  const isConfirmDisabled = isSubmittingAction || (isFormMode ? isFormInvalid : false)
  const confirmLabel = isSubmittingAction ? currentActionUi.loadingLabel : currentActionUi.idleLabel
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={isFormMode ? 'sm' : 'xs'}>
      <DialogTitle>{dialogTitle}</DialogTitle>

      <DialogContent>
        {isFormMode ? (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Title"
              value={formValues.title}
              onChange={(event) => onFormChange('title', event.target.value)}
              fullWidth
              required
              error={Boolean(errors.title)}
              helperText={errors.title ? 'Title is required' : ' '}
            />
            <TextField
              label="Description"
              value={formValues.description}
              onChange={(event) => onFormChange('description', event.target.value)}
              fullWidth
              multiline
              minRows={3}
              required
              error={Boolean(errors.description)}
              helperText={errors.description ? 'Description is required' : ' '}
            />
            <TextField
              select
              label="Priority"
              value={formValues.priority}
              onChange={(event) => onFormChange('priority', event.target.value)}
              fullWidth
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Column"
              value={formValues.column}
              onChange={(event) => onFormChange('column', event.target.value)}
              fullWidth
            >
              {BOARD_COLUMNS.map((column) => (
                <MenuItem key={column.key} value={column.key}>
                  {column.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        ) : (
          <DialogContentText>
            This will remove &quot;{task.title}&quot; from the board.
          </DialogContentText>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color={currentActionUi.color}
          onClick={onConfirm}
          disabled={isConfirmDisabled}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
