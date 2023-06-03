import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FileUpload from "src/components/FileUpload";
import { useState } from "react";
import { customToast, uploadImageToFirebase } from "src/utils";

export default function InsertDocumentsForm({ open, handleClose, handleOK }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onClose={handleClose}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const fileUrls = await Promise.all(
            files.map((file) => uploadImageToFirebase(file, file.name)),
          );

          const uploadedFiles = files.map((file, index) => ({
            name: file.name,
            url: fileUrls[index],
          }));

          handleOK(uploadedFiles);
          setLoading(false);
          setFiles([]);
          handleClose();
        }}
      >
        <DialogTitle>Insert documents</DialogTitle>
        <DialogContent>
          <FileUpload
            multiFile={true}
            disabled={false}
            title="Insert documents"
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
            loading={loading}
            type="submit"
            variant="outlined"
            color="primary"
          >
            Upload
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
