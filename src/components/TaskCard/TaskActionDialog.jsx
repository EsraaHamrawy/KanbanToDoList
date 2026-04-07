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

export default function TaskActionDialog({
  open,
  action,
  task,
  formValues,
  onFormChange,
  onClose,
  onConfirm,
}) {
  const isEditMode = action === 'edit'
  const isAddMode = action === 'add'
  const dialogTitle = isAddMode ? 'Add task' : isEditMode ? 'Edit task' : 'Delete task?'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={isEditMode || isAddMode ? 'sm' : 'xs'}>
      <DialogTitle>{dialogTitle}</DialogTitle>

      <DialogContent>
        {isEditMode || isAddMode ? (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Title"
              value={formValues.title}
              onChange={(event) => onFormChange('title', event.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={formValues.description}
              onChange={(event) => onFormChange('description', event.target.value)}
              fullWidth
              multiline
              minRows={3}
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
          color={isAddMode || isEditMode ? 'primary' : 'error'}
          onClick={onConfirm}
        >
          {isAddMode ? 'Add' : isEditMode ? 'Save' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
