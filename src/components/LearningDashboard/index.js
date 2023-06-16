import { Cached, Download } from "@mui/icons-material";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import {
  Button,
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { callBBBClient } from "src/client/bbb-client";
import { updateLearningDashboards } from "src/service";
import { downloadSessionData } from "src/service/UserService";
import { formatTime, isValid } from "src/utils";
import { NoData } from "../NoDataNotification";
import LearningDashboardDetail from "./LearningDashBoardDetail";
let intervalID;

export default function LearningDashboards({ room, getUser }) {
  const [learningDashboard, setLearningDashboard] = useState(null);

  const getLearningDashboard = async () => {
    const res = await callBBBClient({
      meeting: room.meetingInfo?.internalMeetingID || "",
      apiCall: "learningDashboardFromMeetingId",
    });
    if (isValid(res)) {
      setLearningDashboard(res.data);
      await updateLearningDashboards(room, res.data);
    }
  };

  useEffect(() => {
    if (!learningDashboard) getLearningDashboard();
    intervalID = setInterval(() => getLearningDashboard(), 10 * 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, [room]);

  const RefreshButton = (props) => (
    <Button startIcon={<Cached />} onClick={() => getUser()} variant="contained" {...props}>
      Refresh
    </Button>
  );

  return (
    <Container maxWidth="xl">
      {learningDashboard ? (
        <LearningDashboardDetail jsonData={learningDashboard} />
      ) : (
        <NoData
          title="Not available"
          description="Learning dashboard will appear here after you start a meeting"
          icon={<CastForEducationIcon />}
          refreshButton={<RefreshButton />}
        />
      )}

      <Typography variant="h5" color="primary" sx={{ marginTop: 4, marginBottom: 2 }}>
        Previous sessions
      </Typography>
      <Card>
        <TableContainer>
          <Table>
            <TableHead className="tableHead">
              <TableRow>
                <TableCell>Room name</TableCell>
                <TableCell>Created on</TableCell>
                <TableCell>participants</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {room?.learningDashboards?.map((dashboard) => {
                const parsedDashboard = JSON.parse(dashboard);
                return (
                  <TableRow key={`${parsedDashboard.extId}-${parsedDashboard.intId}`}>
                    <TableCell>{parsedDashboard.name}</TableCell>
                    <TableCell>{formatTime(parsedDashboard.createdOn)}</TableCell>
                    <TableCell>{Object.keys(parsedDashboard?.users)?.length || 0}</TableCell>
                    <TableCell>
                      <Tooltip title="Download session data">
                        <IconButton onClick={() => downloadSessionData(parsedDashboard)}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
}
