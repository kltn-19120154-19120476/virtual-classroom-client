import { DeleteOutline, Edit } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { LoadingButton } from "@mui/lab";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from "@mui/material";
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
import { isValid, splitFilenameAndExtension, uploadImageToFirebase } from "src/utils";
import { NoData } from "../NoDataNotification";
import { MyCardHeader } from "../atoms/CustomCardHeader";

export default function InsertDocuments({ room, getUser }) {
  const [loading, setLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleUploadDocuments = async (files) => {
    setLoading(true);
    const filesCanUpload = [],
      filesExisted = [];

    files.forEach((file) => {
      if (!room?.presentation.find((f) => f.name === file.name)) filesCanUpload.push(file);
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

      const newPresentationList = [...room?.presentation, ...uploadedFiles];

      const updateRoomRes = await updateRoom({ id: room?._id, presentation: JSON.stringify(newPresentationList) });

      if (isValid(updateRoomRes)) {
        room.presentation = newPresentationList;
        toast.success("Documents uploaded successfully");
      }
    } else {
      toast.error(`${filesExisted?.map((file) => file.name).join(", ")} existed`);
    }
    getUser();
    setLoading(false);
  };

  const handleDeletePresentation = async (presentation) => {
    const newPresentationList = room?.presentation.filter((p) => p.url !== presentation.url);
    const res = await updateRoom({ id: room?._id, presentation: JSON.stringify(newPresentationList) });
    if (isValid(res)) {
      toast.success("Presentation deleted successfully");
    }
    getUser();
  };

  const handleEditDocument = async () => {
    const updateDocumentIndex = room?.presentation.findIndex((item) => item.url === selectedDocument.url);
    room.presentation[updateDocumentIndex] = selectedDocument;
    const res = await updateRoom({ id: room?._id, presentation: JSON.stringify(room?.presentation) });
    if (isValid(res)) {
      toast.success("Presentation updated successfully");
    }
    getUser();
    setOpenEditModal(false);
  };

  return (
    <Container maxWidth="xl">
      {room?.presentation?.length > 0 && (
        <TableContainer component={Paper}>
          <MyCardHeader label="presentation" />
          <Table sx={{ minWidth: 650 }}>
            <colgroup>
              <col width="80%"></col>
              <col width="20%"></col>
            </colgroup>
            <TableHead className="tableHead">
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {room?.presentation?.map((presentation) => (
                <TableRow key={presentation.url}>
                  <TableCell align="left">{presentation.name}</TableCell>
                  <TableCell align="center">
                    {room?.isOwner && (
                      <Tooltip title="Edit presentation">
                        <IconButton
                          onClick={() => {
                            setSelectedDocument(presentation);
                            setOpenEditModal(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}

                    <CopyToClipboard text={presentation?.url} onCopy={() => toast.success("Presentation URL has been copied to clipboard")}>
                      <Tooltip title="Copy presentation URL">
                        <IconButton>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </CopyToClipboard>

                    {room?.isOwner && (
                      <Tooltip title="Delete presentation">
                        <IconButton color="error" onClick={() => handleDeletePresentation(presentation)}>
                          <DeleteOutline />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {room?.isOwner && <FileUpload onFilesChange={(files) => handleUploadDocuments(files)} isUploading={loading} />}
      {!room?.isOwner && !room?.presentation?.length && (
        <NoData
          icon={<CloudUploadIcon />}
          title="No presentation"
          description="Presentations will appear here after the moderator upload them to the meeting."
          onRefresh={getUser}
        />
      )}

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth>
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: "1.4rem" }}>
          Edit document
        </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ marginTop: 1 }}
            fullWidth
            label="Presentation's name"
            placeholder="Enter presentation's name"
            value={splitFilenameAndExtension(selectedDocument?.name).name}
            onChange={(e) => {
              setSelectedDocument({
                ...selectedDocument,
                name: `${e.target.value}.${splitFilenameAndExtension(selectedDocument?.name).extension}`,
              });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenEditModal(false)}>
            Cancel
          </Button>
          <LoadingButton
            disabled={!splitFilenameAndExtension(selectedDocument?.name).name}
            variant="contained"
            onClick={() => handleEditDocument()}
            loading={loading}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
