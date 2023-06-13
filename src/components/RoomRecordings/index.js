import CachedIcon from "@mui/icons-material/Cached";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import VideocamIcon from "@mui/icons-material/Videocam";
import { Button, Container, IconButton, Switch, Tooltip } from "@mui/material";
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
import { getRecordings } from "src/service";
import { formatTime, isValid } from "src/utils";
import { NoData } from "../NoDataNotification";
import styles from "./styles.module.scss";

export default function RoomRecordings({ room }) {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRecordingsData = async () => {
    const res = await getRecordings({ meetingID: room?._id });
    if (res) {
      setRecordings(res);
    }
    setLoading(false);
  };

  const handlePublishRecording = async (e, recording) => {
    const res = await callBBBClient({
      apiCall: "publishRecordings",
      publish: `${e.target.checked}`,
      recordID: recording.recordID,
    });
    if (isValid(res)) {
      toast.success(res.message);
      getRecordingsData();
    }
  };

  const handleDeleteRecording = async (recording) => {
    const res = await callBBBClient({ recordID: recording.recordID, apiCall: "deleteRecordings" });
    if (isValid(res)) {
      toast.info("Recordings deleted successfully");
      getRecordingsData();
    }
  };

  useEffect(() => {
    setLoading(true);
    getRecordingsData();
  }, []);

  const RefreshButton = (props) => (
    <Button startIcon={<CachedIcon />} onClick={() => getRecordingsData()} variant="contained" {...props}>
      Refresh
    </Button>
  );

  return (
    <Container maxWidth="xl" className={styles.recordWrapper}>
      {!loading && (
        <>
          {recordings?.length > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <RefreshButton sx={{ marginBottom: 2, marginLeft: "auto" }} />
              </div>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead className="tableHead">
                    <TableRow>
                      <TableCell align="left">Meeting name</TableCell>
                      <TableCell align="left">Time</TableCell>
                      <TableCell align="left">Published</TableCell>
                      <TableCell align="left">Participants</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recordings?.map((recording) => (
                      <TableRow key={recording?.internalMeetingID}>
                        <TableCell align="left">
                          <IconButton sx={{ background: "#f5f5f5", marginRight: 1 }}>
                            <VideocamIcon color="primary" />
                          </IconButton>{" "}
                          {recording?.name}
                        </TableCell>
                        <TableCell align="left">
                          <span className={styles.timeLabel}>From:</span> {formatTime(recording?.startTime)} <br />{" "}
                          <span className={styles.timeLabel}>To:</span> {formatTime(recording?.endTime)}
                        </TableCell>
                        <TableCell align="left" sx={{ textTransform: "capitalize" }}>
                          <Switch checked={recording?.state === "published"} onChange={(e) => handlePublishRecording(e, recording)} />
                        </TableCell>
                        <TableCell align="left">{recording?.participants}</TableCell>
                        <TableCell align="center">
                          <CopyToClipboard text={recording?.url} onCopy={() => toast.success("Copied recording url")}>
                            <Tooltip title="Copy recording urls">
                              <IconButton>
                                <ContentCopyIcon />
                              </IconButton>
                            </Tooltip>
                          </CopyToClipboard>

                          <Tooltip title="Delete recording">
                            <IconButton color="error" onClick={() => handleDeleteRecording(recording)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <NoData
              refreshButton={<RefreshButton />}
              title="You don't have any recordings yet!"
              description={`Recordings will appear here after ${room?.isOwner ? "you" : "the moderator"} start a meeting and record it.`}
              icon={<VideocamIcon />}
            />
          )}
        </>
      )}
    </Container>
  );
}
