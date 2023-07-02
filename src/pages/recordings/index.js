import CachedIcon from "@mui/icons-material/Cached";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VideocamIcon from "@mui/icons-material/Videocam";
import { Button, Container, IconButton, Tooltip } from "@mui/material";
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
import { getRecordings } from "src/service";
import { formatTime } from "src/utils";
import styles from "./styles.module.scss";

function RecordingsPage({ user }) {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

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
                          {recording?.name}
                        </TableCell>
                        <TableCell align="left">
                          <span className={styles.timeLabel}>From:</span> {formatTime(recording?.startTime)} <br />{" "}
                          <span className={styles.timeLabel}>To:</span> {formatTime(recording?.endTime)}
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
              description="Recordings will appear here after you start a meeting and record it."
              icon={<VideocamIcon />}
            />
          )}
        </>
      )}
    </Container>
  );
}

export default withLogin(RecordingsPage);
