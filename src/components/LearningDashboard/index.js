import { Download } from "@mui/icons-material";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import {
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
import { getLearningDashboardFromInternalMeetingId, updateLearningDashboards } from "src/service";
import { downloadSessionData } from "src/service/UserService";
import { formatTime, isValid } from "src/utils";
import { NoData } from "../NoDataNotification";
import LearningDashboardDetail from "./LearningDashBoardDetail";
let intervalID;

export default function LearningDashboards({ room, getUser }) {
  const [learningDashboard, setLearningDashboard] = useState(null);

  const getLearningDashboard = async () => {
    const res = await getLearningDashboardFromInternalMeetingId(room.meetingInfo?.internalMeetingID || "");
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

  return (
    <Container maxWidth="xl">
      {learningDashboard ? (
        <LearningDashboardDetail jsonData={learningDashboard} />
      ) : (
        <NoData
          title="Not available"
          description="Learning dashboard information will appear here after you start a meeting."
          icon={<CastForEducationIcon />}
          onRefresh={getUser}
        />
      )}

      {room?.learningDashboards?.length > 0 && (
        <>
          <Typography variant="h5" color="primary" sx={{ marginTop: 4, marginBottom: 2 }}>
            Room sessions
          </Typography>
          <Card>
            <TableContainer>
              <Table>
                <TableHead className="tableHead">
                  <TableRow>
                    <TableCell>Meeting name</TableCell>
                    <TableCell>Created time</TableCell>
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
        </>
      )}
    </Container>
  );
}
