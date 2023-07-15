import { DeleteOutline, Edit } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyIcon from "@mui/icons-material/Key";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SearchIcon from "@mui/icons-material/Search";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
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
import { adminDeleteUser, adminGetUserList, adminResetUserPassword, adminUpdateUser } from "src/client/user";
import FileUpload from "src/components/FileUpload";
import withLogin from "src/components/HOC/withLogin";
import ConfirmModal from "src/components/atoms/ConfirmModal";
import { MyCardHeader } from "src/components/atoms/CustomCardHeader";
import { Show } from "src/components/atoms/Show";
import { USER_TYPE } from "src/sysconfig";
import { getData, getFirst, isValid, splitFilenameAndExtension, uploadImageToFirebase } from "src/utils";

const TABS = [
  {
    label: "Public document management",
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
  const [users, setUsers] = useState([]);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);

  const [loadingEditDocument, setLoadingEditDocument] = useState(false);
  const [loadingEditUser, setLoadingEditUser] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

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

  const getDocumentsAndUserList = async () => {
    const [documentRes, userRes] = await Promise.all([getDocuments(), adminGetUserList()]);
    setDocuments(getData(documentRes));
    setUsers(getData(userRes));
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

  const handleUpdateUser = async (user, data) => {
    setLoadingEditUser(true);
    try {
      const res = await adminUpdateUser(user._id, data);
      if (isValid(res)) {
        toast.success(res.message);
        getUser();
      }
    } catch (e) {
      toast.error(e.message);
      setLoadingEditUser(false);
      setOpenEditUserModal(false);
    }
    setLoadingEditUser(false);
    setOpenEditUserModal(false);
  };

  const handleDeleteUser = async () => {
    setLoadingEditUser(true);
    try {
      const res = await adminDeleteUser(selectedUser?._id);
      if (isValid(res)) {
        toast.success(res.message);
        getUser();
      }
    } catch (e) {
      toast.error(e.message);
      setLoadingEditUser(false);
      setOpenConfirmDelete(false);
    }
    setLoadingEditUser(false);
    setOpenConfirmDelete(false);
  };

  const handleResetPassword = async (user) => {
    try {
      const newPassword = getFirst(await adminResetUserPassword(user?._id))?.newPassword;
      if (newPassword) {
        setNewPassword(newPassword);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    getDocumentsAndUserList();
    if (user && user.type !== USER_TYPE.ADMIN) window.location.href = "/";
    setTabItem(router.query?.tab || TAB_VALUES.DOCUMENT_MANAGEMENT);
  }, [user, router]);

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
              <TableContainer component={Paper}>
                <MyCardHeader label="Public document management" />
                <Table sx={{ minWidth: 650 }}>
                  <colgroup>
                    <col width="70%" />
                    <col width="30%" />
                  </colgroup>
                  <TableHead className="tableHead">
                    <TableRow>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <Show
                      when={documents?.length > 0}
                      fallback={
                        <TableRow>
                          <TableCell align="center" colSpan={4}>
                            Not found any documents
                          </TableCell>
                        </TableRow>
                      }
                    >
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
                    </Show>
                  </TableBody>
                </Table>
              </TableContainer>
              <FileUpload onFilesChange={(files) => handleUploadDocuments(files)} isUploading={loading} />
            </>
          )}

          {tabItem === TAB_VALUES.USER_MANAGEMENT && (
            <>
              <TableContainer component={Paper}>
                <MyCardHeader label="User management">
                  <Card>
                    <TextField
                      placeholder="Enter user name or email"
                      onChange={async (e) => {
                        const search = e.target.value || "";
                        try {
                          const data = getData(await adminGetUserList(search));
                          setUsers(data);
                        } catch (e) {
                          setUsers([]);
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Card>
                </MyCardHeader>
                <Table sx={{ minWidth: 650 }}>
                  <colgroup>
                    <col width="30%" />
                    <col width="30%" />
                    <col width="15%" />
                    <col width="25%" />
                  </colgroup>
                  <TableHead className="tableHead">
                    <TableRow>
                      <TableCell align="left">Email</TableCell>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <Show
                      when={users?.length > 0}
                      fallback={
                        <TableRow>
                          <TableCell align="center" colSpan={4}>
                            Not found any users
                          </TableCell>
                        </TableRow>
                      }
                    >
                      {users?.map((user) => (
                        <TableRow key={user.email}>
                          <TableCell align="left">{user.email}</TableCell>
                          <TableCell align="left">{user.name}</TableCell>
                          <TableCell align="left">
                            <FormControlLabel
                              control={<Switch color="success" />}
                              name={"activateUser"}
                              id={"activateUser"}
                              checked={user.isActive}
                              onChange={async (e) => {
                                handleUpdateUser(user, { isActive: e.target.checked });
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit user">
                              <IconButton
                                onClick={() => {
                                  setSelectedUser(user);
                                  setOpenEditUserModal(true);
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Reset user password">
                              <IconButton
                                onClick={() => {
                                  handleResetPassword(user);
                                }}
                              >
                                <KeyIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete user">
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setOpenConfirmDelete(true);
                                }}
                              >
                                <DeleteOutline />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Show>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Grid>
      </Grid>

      <ConfirmModal
        show={openConfirmDelete}
        setShow={() => setOpenConfirmDelete(false)}
        label={"Are you sure to delete this user ?"}
        content="This action can not be undone."
        onConfirm={handleDeleteUser}
        onCancel={() => setOpenConfirmDelete(false)}
      />

      <Dialog open={newPassword} onClose={() => setNewPassword("")} fullWidth>
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: "1.4rem" }}>
          Reset user password
        </DialogTitle>
        <DialogContent>
          New password: <b>{newPassword}</b>{" "}
        </DialogContent>
        <DialogActions>
          <CopyToClipboard
            text={newPassword}
            onCopy={() => {
              toast.success("Password has been copied to clipboard");
              setNewPassword("");
            }}
          >
            <Button color="primary" variant="contained">
              Copy new password
            </Button>
          </CopyToClipboard>
        </DialogActions>
      </Dialog>

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

      {selectedUser && (
        <Dialog open={openEditUserModal} onClose={() => setOpenEditUserModal(false)} fullWidth>
          <DialogTitle id="alert-dialog-title" sx={{ fontSize: "1.4rem" }}>
            Edit user
          </DialogTitle>
          <DialogContent>
            <TextField
              sx={{ marginTop: 1 }}
              fullWidth
              label="User's name"
              placeholder="Enter user's name"
              value={selectedUser.name}
              onChange={(e) => {
                setSelectedUser({
                  ...selectedUser,
                  name: e.target.value,
                });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setOpenEditUserModal(false)}>
              Cancel
            </Button>
            <LoadingButton
              disabled={!user.name}
              variant="contained"
              onClick={() => handleUpdateUser(selectedUser, { name: selectedUser.name })}
              loading={loadingEditUser}
            >
              Save
            </LoadingButton>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

export default withLogin(DocumentsPage);
