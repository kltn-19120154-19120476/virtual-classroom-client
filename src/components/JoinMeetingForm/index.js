import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export default function JoinMeetingForm({ open, handleClose, handleOK }) {
  const schema = yup
    .object({
      fullName: yup.string().required("Attendee's name is required"),
      password: yup.string().required("Meeting password is required"),
    })
    .required();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <form
        onSubmit={handleSubmit(async (data) => {
          handleOK({ ...data, role: "attendee" });
          reset();
          handleClose();
        })}
      >
        <DialogTitle>Join meeting</DialogTitle>
        <DialogContent>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField
                label="Attendee's name"
                variant="outlined"
                {...field}
                fullWidth
                margin="dense"
                error={!!errors?.fullName}
                helperText={errors?.fullName?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                label="Meeting password"
                variant="outlined"
                {...field}
                fullWidth
                margin="dense"
                type="password"
                error={!!errors?.password}
                helperText={errors?.password?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="outlined" color="primary">
            Join
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
