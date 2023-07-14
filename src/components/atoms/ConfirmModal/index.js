import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const ConfirmModal = ({ show, setShow, onConfirm, onCancel, label, content }) => (
  <Dialog open={show} onClose={setShow} fullWidth>
    <DialogTitle id="alert-dialog-title">{label}</DialogTitle>
    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" onClick={onCancel}>
        Cancel
      </Button>
      <Button color="error" variant="contained" type="submit" onClick={onConfirm}>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmModal;
