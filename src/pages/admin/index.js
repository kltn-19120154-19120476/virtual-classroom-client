import { DeleteOutline, Edit } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { callBBBClient } from "src/client/bbb-client";
import { createDocument, deleteDocument, getDocuments, updateDocument } from "src/client/room";
import FileUpload from "src/components/FileUpload";
import withLogin from "src/components/HOC/withLogin";
import { MyCardHeader } from "src/components/atoms/CustomCardHeader";
import { USER_TYPE } from "src/sysconfig";
import { getData, isValid, splitFilenameAndExtension, uploadImageToFirebase } from "src/utils";
const TABS = [
  {
    label: "Document management",
    value: "document-management",
    icon: <SummarizeIcon />,
  },
  {
    label: "User management",
    value: "user-management",
    icon: <ManageAccountsIcon />,
  },
];

const TAB_VALUES = {
  DOCUMENT_MANAGEMENT: "document-management",
  USER_MANAGEMENT: "user-management",
};

function DocumentsPage({ user, getUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [loadingEditDocument, setLoadingEditDocument] = useState(false);

  const [tabItem, setTabItem] = useState(router.query?.tab || TAB_VALUES.DOCUMENT_MANAGEMENT);

  const handleEditDocument = async () => {
    setLoadingEditDocument(true);
    try {
      const res = await updateDocument(selectedDocument.presId, { filename: selectedDocument.filename });
      if (isValid(res)) {
        toast.success(res.message);
        getUser();
      } else {
        toast.error(res?.message);
      }
    } catch (e) {
      toast.error(e?.message || e);
      setLoadingEditDocument(false);
    }
    setOpenEditModal(false);
    setLoadingEditDocument(false);
  };

  const getDocumentsList = async () => {
    const uploadedDocuments = getData(await getDocuments());
    setDocuments(uploadedDocuments);
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
    getDocumentsList();
    if (user && user.type !== USER_TYPE.ADMIN) window.location.href = "/";
    setTabItem(router.query?.tab || TAB_VALUES.DOCUMENT_MANAGEMENT);
  }, [user, router]);

  const handleDeleteDocument = async (document) => {
    try {
      const res = await deleteDocument(document.presId);
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
      <Typography variant="h4" fontWeight={600} color="primary" textAlign="left" marginBottom={10}>
        ADMINISTRATOR PANEL
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          {TABS.map((tab) => (
            <Button
              sx={{ marginBottom: 1 }}
              key={tab.value}
              startIcon={tab.icon}
              fullWidth
              variant={tab.value === tabItem ? "contained" : "outlined"}
              onClick={() => router.push(`/admin?tab=${tab.value}`)}
            >
              {tab.label}
            </Button>
          ))}
        </Grid>
        <Grid item xs={12} md={9}>
          {tabItem === TAB_VALUES.DOCUMENT_MANAGEMENT && (
            <>
              {documents?.length > 0 && (
                <TableContainer component={Paper}>
                  <MyCardHeader label="Document management" />
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead className="tableHead">
                      <TableRow>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents?.map((document) => (
                        <TableRow key={document.url}>
                          <TableCell align="left">{document.filename}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit document">
                              <IconButton
                                onClick={() => {
                                  setSelectedDocument(document);
                                  setOpenEditModal(true);
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>

                            <CopyToClipboard
                              text={document?.uploadUrl}
                              onCopy={() => toast.success("Document URL has been copied to clipboard")}
                            >
                              <Tooltip title="Copy document URL">
                                <IconButton>
                                  <ContentCopyIcon />
                                </IconButton>
                              </Tooltip>
                            </CopyToClipboard>

                            <Tooltip title="Delete document">
                              <IconButton color="error" onClick={() => handleDeleteDocument(document)}>
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
            </>
          )}

          {tabItem === TAB_VALUES.USER_MANAGEMENT && (
            <>
              <TableContainer component={Paper}>
                <MyCardHeader label="User management" />
                <Table sx={{ minWidth: 650 }}>
                  <TableHead className="tableHead">
                    <TableRow>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
            </>
          )}
        </Grid>
      </Grid>
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} fullWidth>
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: "1.4rem" }}>
          Edit document
        </DialogTitle>
        <DialogContent>
          <TextField
            sx={{ marginTop: 1 }}
            fullWidth
            label="Document's name"
            placeholder="Enter document's name"
            value={splitFilenameAndExtension(selectedDocument?.filename).name}
            onChange={(e) => {
              setSelectedDocument({
                ...selectedDocument,
                filename: `${e.target.value}.${splitFilenameAndExtension(selectedDocument?.filename).extension}`,
              });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenEditModal(false)}>
            Cancel
          </Button>
          <LoadingButton
            disabled={!splitFilenameAndExtension(selectedDocument?.filename).name}
            variant="contained"
            onClick={() => handleEditDocument()}
            loading={loadingEditDocument}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default withLogin(DocumentsPage);
