import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import DownloadIcon from "@mui/icons-material/Download";
import GroupsIcon from "@mui/icons-material/Groups";
import PollIcon from "@mui/icons-material/Poll";
import { Button, Chip, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import React from "react";
import { emojiConfigs } from "src/service/EmojiService";
import { downloadSessionData, tsToHHmmss } from "src/service/UserService";
import { formatTime } from "src/utils";
import CardBody from "./Card";
import ErrorMessage from "./ErrorMessage";
import PollsTable from "./PollsTable";
import StatusTable from "./StatusTable";
import UsersTable from "./UsersTable";
import styles from "./styles.module.scss";
const TABS = {
  OVERVIEW: 0,
  TIMELINE: 1,
  POLLING: 2,
};

export default class LearningDashboardDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      invalidSessionCount: 0,
      activitiesJson: {},
      tab: 0,
      meetingId: "",
      lastUpdated: null,
    };
  }

  componentDidMount() {
    this.setDashboardParams(() => {
      this.fetchActivitiesJson();
    });
  }

  handleSaveSessionData() {
    const { activitiesJson } = this.state;

    downloadSessionData(activitiesJson);
  }

  setDashboardParams(callback) {
    let meetingId = "";

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (typeof params.meeting !== "undefined") {
      meetingId = params.meeting;
    }

    this.setState({ meetingId }, () => {
      if (typeof callback === "function") callback();
    });
  }

  fetchMostUsedEmojis() {
    const { activitiesJson } = this.state;
    if (!activitiesJson) {
      return [];
    }

    // Icon elements
    const emojis = [...Object.keys(emojiConfigs)];
    const icons = {};
    emojis.forEach((emoji) => {
      icons[emoji] = <i className={`${emojiConfigs[emoji].icon} bbb-icon-card`} />;
    });

    // Count each emoji
    const emojiCount = {};
    emojis.forEach((emoji) => {
      emojiCount[emoji] = 0;
    });
    const allEmojisUsed = Object.values(activitiesJson.users || {})
      .map((user) => user.emojis || [])
      .flat(1);
    allEmojisUsed.forEach((emoji) => {
      emojiCount[emoji.name] += 1;
    });

    // Get the three most used
    const mostUsedEmojis = Object.entries(emojiCount)
      .filter(([, count]) => count)
      .sort(([, countA], [, countB]) => countA - countB)
      .reverse()
      .slice(0, 3);
    return mostUsedEmojis.map(([emoji]) => icons[emoji]);
  }

  fetchActivitiesJson() {
    const { invalidSessionCount } = this.state;
    this.setState({
      activitiesJson: JSON.parse(this.props.jsonData),
      loading: false,
      invalidSessionCount: 0,
      lastUpdated: Date.now(),
    });

    setTimeout(() => {
      this.fetchActivitiesJson();
    }, 10000 * 2 ** invalidSessionCount);
  }

  render() {
    const { activitiesJson, tab, loading, lastUpdated } = this.state;

    document.title = `LMS DEMO - Learning Analytics Dashboard - ${activitiesJson.name}`;

    function totalOfEmojis() {
      if (activitiesJson && activitiesJson.users) {
        return Object.values(activitiesJson.users).reduce((prevVal, elem) => prevVal + elem.emojis.length, 0);
      }
      return 0;
    }

    function totalOfActivity() {
      const usersTimes = Object.values(activitiesJson.users || {}).reduce((prev, user) => [...prev, ...Object.values(user.intIds)], []);

      const minTime = Object.values(usersTimes || {}).reduce((prevVal, elem) => {
        if (prevVal === 0 || elem.registeredOn < prevVal) return elem.registeredOn;
        return prevVal;
      }, 0);

      const maxTime = Object.values(usersTimes || {}).reduce((prevVal, elem) => {
        if (elem.leftOn === 0) return new Date().getTime();
        if (elem.leftOn > prevVal) return elem.leftOn;
        return prevVal;
      }, 0);

      return maxTime - minTime;
    }

    function getAverageActivityScore() {
      let meetingAveragePoints = 0;

      const allUsers = Object.values(activitiesJson.users || {}).filter((currUser) => !currUser.isModerator);
      const nrOfUsers = allUsers.length;

      if (nrOfUsers === 0) return meetingAveragePoints;

      // Calculate points of Talking
      const usersTalkTime = allUsers.map((currUser) => currUser.talk.totalTime);
      const maxTalkTime = Math.max(...usersTalkTime);
      const totalTalkTime = usersTalkTime.reduce((prev, val) => prev + val, 0);
      if (totalTalkTime > 0) {
        meetingAveragePoints += (totalTalkTime / nrOfUsers / maxTalkTime) * 2;
      }

      // Calculate points of Chatting
      const usersTotalOfMessages = allUsers.map((currUser) => currUser.totalOfMessages);
      const maxMessages = Math.max(...usersTotalOfMessages);
      const totalMessages = usersTotalOfMessages.reduce((prev, val) => prev + val, 0);
      if (maxMessages > 0) {
        meetingAveragePoints += (totalMessages / nrOfUsers / maxMessages) * 2;
      }

      // Calculate points of Raise hand
      const usersRaiseHand = allUsers.map((currUser) => currUser.emojis.filter((emoji) => emoji.name === "raiseHand").length);
      const maxRaiseHand = Math.max(...usersRaiseHand);
      const totalRaiseHand = usersRaiseHand.reduce((prev, val) => prev + val, 0);
      if (maxRaiseHand > 0) {
        meetingAveragePoints += (totalRaiseHand / nrOfUsers / maxRaiseHand) * 2;
      }

      // Calculate points of Emojis
      const usersEmojis = allUsers.map((currUser) => currUser.emojis.filter((emoji) => emoji.name !== "raiseHand").length);
      const maxEmojis = Math.max(...usersEmojis);
      const totalEmojis = usersEmojis.reduce((prev, val) => prev + val, 0);
      if (maxEmojis > 0) {
        meetingAveragePoints += (totalEmojis / nrOfUsers / maxEmojis) * 2;
      }

      // Calculate points of Polls
      const totalOfPolls = Object.values(activitiesJson.polls || {}).length;
      if (totalOfPolls > 0) {
        const totalAnswers = allUsers.reduce((prevVal, currUser) => prevVal + Object.values(currUser.answers || {}).length, 0);
        meetingAveragePoints += (totalAnswers / nrOfUsers / totalOfPolls) * 2;
      }

      return meetingAveragePoints;
    }

    function getErrorMessage() {
      if (JSON.stringify(activitiesJson || "{}") === "{}" || typeof activitiesJson.name === "undefined") {
        return "Data is no longer available";
      }

      return "";
    }

    if (loading === false && getErrorMessage() !== "") return <ErrorMessage message={getErrorMessage()} />;

    const usersCount = Object.values(activitiesJson.users || {}).filter(
      (u) => activitiesJson.endedOn > 0 || Object.values(u.intIds)[Object.values(u.intIds).length - 1].leftOn === 0,
    ).length;

    return (
      <div className="mx-10">
        <div className={styles.userTableHeader}>
          <Typography
            variant="h4"
            fontWeight={"bold"}
            color="primary"
            textTransform="uppercase"
            sx={{ borderLeft: "10px solid #467fcf", paddingLeft: 2 }}
          >
            {activitiesJson.name || ""} Dashboard
          </Typography>
          <div>
            <p style={{ fontWeight: 600 }}>
              <span>{formatTime(activitiesJson.createdOn)}</span>
              &nbsp;&nbsp;
              {activitiesJson.endedOn > 0 ? <Chip color="error" label="Ended" /> : null}
              {activitiesJson.endedOn === 0 ? <Chip color="success" label="Active" /> : null}
            </p>
            <p>
              Duration:&nbsp;
              {tsToHHmmss(totalOfActivity())}
            </p>
          </div>
        </div>

        <TabsUnstyled
          defaultValue={0}
          onChange={(e, v) => {
            this.setState({ tab: v });
          }}
        >
          <TabsListUnstyled className={styles.userTableTab}>
            <TabUnstyled style={{ border: "none" }}>
              <Card className={tab === TABS.OVERVIEW && styles.cardActive}>
                <CardContent>
                  <CardBody name={activitiesJson.endedOn === 0 ? "Active Users" : "Total Number Of Users"} number={usersCount}>
                    <GroupsIcon fontSize="large" color="primary" />
                  </CardBody>
                </CardContent>
              </Card>
            </TabUnstyled>
            <TabUnstyled style={{ border: "none" }}>
              <Card className={tab === TABS.TIMELINE && styles.cardActive}>
                <CardContent>
                  <CardBody name={"Timeline"} number={totalOfEmojis()}>
                    {this.fetchMostUsedEmojis()}
                  </CardBody>
                </CardContent>
              </Card>
            </TabUnstyled>
            <TabUnstyled style={{ border: "none" }}>
              <Card className={tab === TABS.POLLING && styles.cardActive}>
                <CardContent>
                  <CardBody name={"Polls"} number={Object.values(activitiesJson.polls || {}).length}>
                    <PollIcon fontSize="large" color="primary" />
                  </CardBody>
                </CardContent>
              </Card>
            </TabUnstyled>
          </TabsListUnstyled>
          <TabPanelUnstyled value={0}>
            <Typography variant="h4" color="primary" sx={{ marginTop: 6, marginBottom: 2 }}>
              Overview
            </Typography>
            <UsersTable
              allUsers={activitiesJson.users}
              totalOfActivityTime={totalOfActivity()}
              totalOfPolls={Object.values(activitiesJson.polls || {}).length}
              tab="overview"
            />
          </TabPanelUnstyled>
          <TabPanelUnstyled value={1}>
            <Typography variant="h4" color="primary" sx={{ marginTop: 6, marginBottom: 2 }}>
              Timeline
            </Typography>
            <StatusTable allUsers={activitiesJson.users} slides={activitiesJson.presentationSlides} meetingId={activitiesJson.intId} />
          </TabPanelUnstyled>
          <TabPanelUnstyled value={2}>
            <Typography variant="h4" color="primary" sx={{ marginTop: 6, marginBottom: 2 }}>
              Polls
            </Typography>
            <PollsTable polls={activitiesJson.polls} allUsers={activitiesJson.users} />
          </TabPanelUnstyled>
        </TabsUnstyled>
        <div className={styles.userTableFooter}>
          <div>
            <p style={{ fontWeight: 600 }}>
              {lastUpdated && (
                <>
                  Last updated at &nbsp;
                  {formatTime(lastUpdated)}
                </>
              )}
            </p>
          </div>
          <Button color="primary" variant="contained" onClick={this.handleSaveSessionData.bind(this)} startIcon={<DownloadIcon />}>
            Download Session Data
          </Button>
        </div>
      </div>
    );
  }
}
