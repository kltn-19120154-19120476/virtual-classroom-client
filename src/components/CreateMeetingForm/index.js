import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FileUpload from "src/components/FileUpload";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { customToast, uploadImageToFirebase } from "src/utils";
import * as yup from "yup";

export default function CreateMeetingForm({ open, handleClose, handleOK }) {
  const schema = yup
    .object({
      name: yup.string().required("Meeting name is required"),
      attendeePW: yup.string().required("Attendee password is required"),
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

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onClose={handleClose}>
      <form
        onSubmit={handleSubmit(async (data) => {
          setLoading(true);
          const fileUrls = await Promise.all(
            files.map((file) => uploadImageToFirebase(file, file.name)),
          );

          const uploadedFiles = files.map((file, index) => ({
            ...file,
            uploadUrl: fileUrls[index],
          }));

          setLoading(false);
          handleOK(data, uploadedFiles);
          reset();
          handleClose();
        })}
      >
        <DialogTitle>Enter meeting information</DialogTitle>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                label="Meeting name"
                variant="outlined"
                {...field}
                fullWidth
                margin="dense"
                error={!!errors?.name}
                helperText={errors?.name?.message}
              />
            )}
          />
          <Controller
            name="attendeePW"
            control={control}
            render={({ field }) => (
              <TextField
                label="Attendee password"
                variant="outlined"
                {...field}
                fullWidth
                margin="dense"
                type="password"
                error={!!errors?.attendeePW}
                helperText={errors?.attendeePW?.message}
              />
            )}
          />
          <FileUpload
            multiFile={true}
            disabled={false}
            title="Pre-upload slides"
            header="Drag files here"
            leftLabel="or"
            rightLabel="to select files"
            buttonLabel="click"
            buttonRemoveLabel="Remove all"
            maxFileSize={10}
            maxUploadFiles={0}
            maxFilesContainerHeight={357}
            errorSizeMessage={""}
            allowedExtensions={["pdf", "doc", "docx", "ppt", "pptx"]}
            onFilesChange={(files) => setFiles(files)}
            onError={(error) => customToast("ERROR", error)}
            bannerProps={{ elevation: 0, variant: "outlined" }}
            containerProps={{
              elevation: 0,
              variant: "outlined",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            type="submit"
            variant="outlined"
            color="primary"
            disabled={loading}
            loading={loading}
          >
            Create meeting
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
