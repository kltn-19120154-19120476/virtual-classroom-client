import { Close, Download, PlayArrow } from "@mui/icons-material";
import CachedIcon from "@mui/icons-material/Cached";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VideocamIcon from "@mui/icons-material/Videocam";
import { AppBar, Container, Dialog, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
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
import withLogin from "src/components/HOC/withLogin";
import { NoData } from "src/components/NoDataNotification";
import { MyCardHeader } from "src/components/atoms/CustomCardHeader";
import { WhiteButton } from "src/components/atoms/WhiteButton";
import { getRecordings } from "src/service";
import { WEB_HOST } from "src/sysconfig";
import { formatTime } from "src/utils";
import styles from "./styles.module.scss";

function RecordingsPage({ user }) {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecording, setSelectedRecording] = useState(null);

  const getRecordingsData = async () => {
    const roomIDs = [...(user?.myRoomIds || []), ...(user?.joinedRoomIds || [])];

    const recordingsRes = await Promise.all(roomIDs.map((id) => getRecordings({ meetingID: id })));

    let recordings = [];

    recordingsRes.forEach((recordingRes) => {
      recordings = recordings.concat(...recordingRes);
    });

    setRecordings(recordings);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getRecordingsData();
  }, [user]);

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
            <>
              <TableContainer component={Paper}>
                <MyCardHeader label="Recordings">
                  <RefreshButton variant="outlined" sx={{ background: "#fff" }} />
                </MyCardHeader>
                <Table sx={{ minWidth: 650 }}>
                  <colgroup>
                    <col width="30%"></col>
                    <col width="20%"></col>
                    <col width="20%"></col>
                    <col width="10%"></col>
                    <col width="20%"></col>
                  </colgroup>
                  <TableHead className="tableHead">
                    <TableRow>
                      <TableCell align="left">Recording name</TableCell>
                      <TableCell align="left">Meeting name</TableCell>
                      <TableCell align="left">Time</TableCell>
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
                          </IconButton>{" "}
                          {recording?.recordName}
                        </TableCell>
                        <TableCell align="left">{recording?.name}</TableCell>
                        <TableCell align="left">
                          <span className={styles.timeLabel}>From:</span> {formatTime(recording?.startTime)} <br />{" "}
                          <span className={styles.timeLabel}>To:</span> {formatTime(recording?.endTime)}
                        </TableCell>
                        <TableCell align="left">{recording?.participants}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Play recording">
                            <IconButton onClick={() => setSelectedRecording(recording)}>
                              <PlayArrow />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download recording">
                            <IconButton onClick={() => window.open(`${WEB_HOST}/recording/${recording.recordId}.mp4`, "_blank")}>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <NoData
              onRefresh={getRecordingsData}
              title="You don't have any recordings yet!"
              description="Your available recordings will appear here."
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

export default withLogin(RecordingsPage);
