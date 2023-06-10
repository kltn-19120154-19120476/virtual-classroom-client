import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { callBBBClient } from "src/client/bbb-client";
import { isValid } from "src/utils";

let intervalID;

export default function LearningDashboards({ room }) {
  const [learningDashboard, setLearningDashboard] = useState(null);

  const getLearningDashboard = async () => {
    const res = await callBBBClient({
      meeting: room.meetingInfo.internalMeetingID,
      apiCall: "learningDashboardFromMeetingId",
    });
    if (isValid(res)) {
      console.log(JSON.parse(res.data));
      setLearningDashboard(JSON.parse(res.data || "{}"));
    }
  };

  useEffect(() => {
    if (!learningDashboard) getLearningDashboard();
    intervalID = setInterval(() => getLearningDashboard(), 10 * 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return <Container maxWidth="xl">{JSON.stringify(learningDashboard)}</Container>;
}
