import { Close, Download, Edit, PlayArrow } from "@mui/icons-material";
import CachedIcon from "@mui/icons-material/Cached";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import VideocamIcon from "@mui/icons-material/Videocam";
import {
  AppBar,
  Card,
  Container,
  Dialog,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Toolbar,
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
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { deleteRecording, updateRecording } from "src/client/room";
import { getRecordings } from "src/service";
import { WEB_HOST } from "src/sysconfig";
import { checkURL, formatTime, isValid } from "src/utils";
import { NoData } from "../NoDataNotification";
import { MyCardHeader } from "../atoms/CustomCardHeader";
import { WhiteButton } from "../atoms/WhiteButton";
import styles from "./styles.module.scss";

export default function RoomRecordings({ room }) {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRecording, setSelectedRecording] = useState(null);

  const getRecordingsData = async () => {
    const res = await getRecordings({ meetingID: room?._id });
    if (res) {
      setRecordings(res);
    }
    setLoading(false);
  };

  const handlePublishRecording = async (e, recording) => {
    const res = await updateRecording({ data: { published: e.target.checked }, roomId: room?._id, recordId: recording.recordId });
    if (isValid(res)) {
      toast.success(res.message);
      getRecordingsData();
    }
  };

  const handleDeleteRecording = async (recording) => {
    const res = await deleteRecording({ recordId: recording.recordId, roomId: room?._id });
    if (isValid(res)) {
      toast.info("Recordings deleted successfully");
      getRecordingsData();
    }
  };

  const handleUpdateRecording = async (e, recording) => {
    const res = await updateRecording({
      data: { recordName: e.target.value || recording.recordName },
      roomId: room?._id,
      recordId: recording.recordId,
    });
    if (isValid(res)) {
      toast.success(res.message);
      getRecordingsData();
    }
  };

  const handleDownloadRecording = async (recording) => {
    const isConverted = await checkURL(`${WEB_HOST}/recording/${recording.recordId}.mp4`);
    if (isConverted) {
      window.open(`${WEB_HOST}/recording/${recording.recordId}.mp4`, "_blank");
    } else toast.info("Recording is being coverted to MP4 format. Please try again later.");
  };

  useEffect(() => {
    setLoading(true);
    getRecordingsData();
  }, []);

  const RefreshButton = (props) => (
    <WhiteButton startIcon={<CachedIcon />} onClick={() => getRecordingsData()} {...props}>
      Refresh
    </WhiteButton>
  );

  return (
    <Container maxWidth="xl" className={styles.recordWrapper}>
      {!loading && (
        <>
          {recordings?.length > 0 ? (
            <Card>
              <MyCardHeader label="recordings">
                <RefreshButton />
              </MyCardHeader>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 1200 }}>
                  <colgroup>
                    <col width="35%"></col>
                    <col width="15%"></col>
                    <col width="20%"></col>
                    <col width="6%"></col>
                    <col width="6%"></col>
                    <col width="18%"></col>
                  </colgroup>
                  <TableHead className="tableHead">
                    <TableRow>
                      <TableCell align="left">Recording name</TableCell>
                      <TableCell align="left">Meeting name</TableCell>
                      <TableCell align="left">Time</TableCell>
                      <TableCell align="left">Published</TableCell>
                      <TableCell align="left">Participants</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recordings?.map((recording) => (
                      <TableRow key={recording?.recordId}>
                        <TableCell align="left">
                          <IconButton sx={{ background: "#f5f5f5", marginRight: 1 }}>
                            <VideocamIcon color="primary" />
                          </IconButton>
                          <TextField
                            disabled={!room?.isOwner}
                            placeholder="Enter recording name"
                            defaultValue={recording?.recordName}
                            onBlur={(e) => handleUpdateRecording(e, recording)}
                            size="small"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Edit />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">{recording?.name}</TableCell>
                        <TableCell align="left">
                          <span className={styles.timeLabel}>From:</span> {formatTime(recording?.startTime)} <br />{" "}
                          <span className={styles.timeLabel}>To:</span> {formatTime(recording?.endTime)}
                        </TableCell>
                        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
                          <Switch
                            disabled={!room?.isOwner}
                            checked={recording?.published}
                            onChange={(e) => handlePublishRecording(e, recording)}
                          />
                        </TableCell>
                        <TableCell align="left">{recording?.participants}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Play recording">
                            <IconButton onClick={() => setSelectedRecording(recording)}>
                              <PlayArrow />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download recording">
                            <IconButton onClick={() => handleDownloadRecording(recording)}>
                              <Download />
                            </IconButton>
                          </Tooltip>
                          <CopyToClipboard
                            text={recording?.playbackUrl}
                            onCopy={() => toast.success("Recording URL has been copied to clipboard")}
                          >
                            <Tooltip title="Copy recording URL">
                              <IconButton>
                                <ContentCopyIcon />
                              </IconButton>
                            </Tooltip>
                          </CopyToClipboard>

                          {room?.isOwner && (
                            <Tooltip title="Delete recording">
                              <IconButton color="error" onClick={() => handleDeleteRecording(recording)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          ) : (
            <NoData
              onRefresh={getRecordingsData}
              title="You don't have any recordings yet!"
              description={`Recordings will appear here after ${room?.isOwner ? "you" : "the moderator"} start a meeting and record it.`}
              icon={<VideocamIcon />}
            />
          )}
        </>
      )}

      {selectedRecording && (
        <Dialog fullScreen open={selectedRecording?.playbackUrl} onClose={() => setSelectedRecording(null)}>
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                <b>{selectedRecording.recordName}</b> <br />
                <span style={{ fontSize: "0.9rem" }}>
                  From {formatTime(selectedRecording?.startTime)} to {formatTime(selectedRecording?.endTime)}
                </span>
              </Typography>
              <IconButton autoFocus color="inherit" onClick={() => setSelectedRecording(null)} sx={{ ml: "auto" }}>
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
          <iframe style={{ height: "100%" }} src={selectedRecording?.playbackUrl}></iframe>
        </Dialog>
      )}
    </Container>
  );
}
