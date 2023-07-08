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
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { callBBBClient } from "src/client/bbb-client";
import { createDocument, deleteDocument, getDocuments } from "src/client/room";
import FileUpload from "src/components/FileUpload";
import withLogin from "src/components/HOC/withLogin";
import { getData, isValid, uploadImageToFirebase } from "src/utils";

function DocumentsPage({ user, getUser }) {
  const [loading, setLoading] = useState(false);
  const [presentations, setPresentations] = useState([]);

  const getPresentations = async () => {
    const uploadedDocuments = getData(await getDocuments());
    setPresentations(uploadedDocuments);
  };

  const handleUploadDocuments = async (files) => {
    setLoading(true);

    const filesCanUpload = [];

    files.forEach((file) => {
      filesCanUpload.push(file);
    });

    if (filesCanUpload.length > 0) {
      const fileUrls = await Promise.all(filesCanUpload.map((file) => uploadImageToFirebase(file, file.name)));

      const uploadedFiles = filesCanUpload.map((file, index) => ({
        name: file.name,
        url: fileUrls[index],
      }));

      const res = await callBBBClient(
        {
          apiCall: "insertDocumentToCommonLibrary",
        },
        { files: JSON.stringify(uploadedFiles) },
      );

      if (isValid(res)) {
        try {
          await Promise.all(getData(res).map((file) => createDocument(file)));
        } catch (e) {
          console.log(e);
        }

        toast.success("Documents uploaded successfully");
      }
    }
    getUser();
    setLoading(false);
  };

  useEffect(() => {
    getPresentations();
  }, [user]);

  const handleDeletePresentation = async (presentation) => {
    try {
      const res = await deleteDocument(presentation.presId);
      if (isValid(res)) {
        toast.success(res.message);
        getUser();
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Container maxWidth="xl">
      {presentations?.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead className="tableHead">
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presentations?.map((presentation) => (
                <TableRow key={presentation.url}>
                  <TableCell align="left">{presentation.filename}</TableCell>
                  <TableCell align="center">
                    <CopyToClipboard
                      text={presentation?.uploadUrl}
                      onCopy={() => toast.success("Presentation URL has been copied to clipboard")}
                    >
                      <Tooltip title="Copy presentation URL">
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

export default withLogin(DocumentsPage);
