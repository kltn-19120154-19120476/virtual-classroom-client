import { Download } from "@mui/icons-material";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import { Card, Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { getLearningDashboardFromInternalMeetingId, updateLearningDashboards } from "src/service";
import { downloadSessionData } from "src/service/UserService";
import { formatTime, isValid } from "src/utils";
import { NoData } from "../NoDataNotification";
import { MyCardHeader } from "../atoms/CustomCardHeader";
import { WhiteButton } from "../atoms/WhiteButton";
import LearningDashboardDetail from "./LearningDashBoardDetail";
let intervalID;

export default function LearningDashboards({ room, getUser, user }) {
  const [learningDashboard, setLearningDashboard] = useState(null);

  const getLearningDashboard = async () => {
    const res = await getLearningDashboardFromInternalMeetingId(room.meetingInfo?.internalMeetingID || "", user._id);
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
        <Card sx={{ mt: 3 }}>
          <MyCardHeader label="Room sessions">
            <Tooltip title="Download all session data">
              <WhiteButton
                startIcon={<Download />}
                onClick={() => {
                  room?.learningDashboards?.forEach((dashboard) => downloadSessionData(JSON.parse(dashboard)));
                }}
              >
                Download all
              </WhiteButton>
            </Tooltip>
          </MyCardHeader>
          <TableContainer>
            <Table>
              <colgroup>
                <col width="40%"></col>
                <col width="20%"></col>
                <col width="20%"></col>
                <col width="20%"></col>
              </colgroup>
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
      )}
    </Container>
  );
}
