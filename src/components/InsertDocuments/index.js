import { DeleteOutline } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Container, IconButton, Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { callBBBClient } from "src/client/bbb-client";
import { updateRoom } from "src/client/room";
import FileUpload from "src/components/FileUpload";
import { isValid, uploadImageToFirebase } from "src/utils";
import styles from "./styles.module.scss";

export default function InsertDocuments({ room }) {
  const [loading, setLoading] = useState(false);

  const [presentationList, setPresentationList] = useState(room.presentation);

  const handleUploadDocuments = async (files) => {
    setLoading(true);
    const filesCanUpload = [],
      filesExisted = [];

    files.forEach((file) => {
      if (!presentationList.find((f) => f.name === file.name)) filesCanUpload.push(file);
      else filesExisted.push(file);
    });

    if (filesCanUpload.length > 0) {
      const fileUrls = await Promise.all(filesCanUpload.map((file) => uploadImageToFirebase(file, file.name)));

      const uploadedFiles = filesCanUpload.map((file, index) => ({
        name: file.name,
        url: fileUrls[index],
      }));

      const res = await callBBBClient(
        {
          meetingID: room?._id,
          apiCall: "insertDocument",
        },
        { files: JSON.stringify(uploadedFiles) },
      );

      const newPresentationList = [...presentationList, ...uploadedFiles];

      const updateRoomRes = await updateRoom({ id: room?._id, presentation: JSON.stringify(newPresentationList) });

      if (isValid(updateRoomRes)) {
        setPresentationList(newPresentationList);
        room.presentation = newPresentationList;
        toast.success("Documents uploaded successfully");
      }
    } else {
      toast.error(`${filesExisted?.map((file) => file.name).join(", ")} existed`);
    }

    setLoading(false);
  };

  const handleDeletePresentation = (presentation) => {
    const newPresentationList = presentationList.filter((p) => p.url !== presentation.url);
    setPresentationList(newPresentationList);
    updateRoom({ id: room?._id, presentation: JSON.stringify(newPresentationList) });
  };

  return (
    <Container maxWidth="xl">
      {presentationList?.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presentationList?.map((presentation) => (
                <TableRow key={presentation.url}>
                  <TableCell align="left">{presentation.name}</TableCell>
                  <TableCell align="center">
                    <CopyToClipboard text={presentation?.url} onCopy={() => toast.success("Copied presentation url")}>
                      <Tooltip title="Copy presentation urls">
                        <IconButton>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </CopyToClipboard>

                    <Tooltip title="Delete presentation">
                      <IconButton color="error" onClick={() => handleDeletePresentation(presentation)}>
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <FileUpload onFilesChange={(files) => handleUploadDocuments(files)} isUploading={loading} />
    </Container>
  );
}
