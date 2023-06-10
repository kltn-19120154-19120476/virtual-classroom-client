import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Card, IconButton } from "@mui/material";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

function getBase64(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((reslove, reject) => {
    reader.onload = () => reslove(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function FileUpload({ onFilesChange, isUploading = false }) {
  return (
    <Dropzone
      onDropAccepted={async (acceptedFiles) => {
        const files = await Promise.all(
          acceptedFiles.map(async (file) => {
            const base64String = await getBase64(file);
            return { name: file.name, path: base64String };
          }),
        );
        onFilesChange(files);
      }}
      onDropRejected={() => toast.error("Invalid files")}
      accept={{ "application/pdf": [], "application/document": [".doc", ".docx", ".ppt", ".pptx"] }}
    >
      {({ getRootProps, getInputProps }) => (
        <Card className={styles.uploadWrapper} {...getRootProps()} style={{ pointerEvents: isUploading ? "none" : "initial" }}>
          <input {...getInputProps()} />
          <IconButton className={styles.uploadIcon} color="primary">
            <CloudUploadIcon />
          </IconButton>

          <h2>{isUploading ? "Uploading documents..." : "Click to Upload or drag and drop"}</h2>

          <p>
            Upload any office document or PDF file. Depending on the size of the file, it may require additional time to upload before it
            can be used
          </p>
        </Card>
      )}
    </Dropzone>
  );
}
