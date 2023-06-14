import { Cached } from "@mui/icons-material";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import { Button, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { callBBBClient } from "src/client/bbb-client";
import { isValid } from "src/utils";
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
    }
  };

  useEffect(() => {
    if (!learningDashboard) getLearningDashboard();
    intervalID = setInterval(() => getLearningDashboard(), 10 * 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

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
    </Container>
  );
}
