import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import React from "react";
import { emojiConfigs } from "src/service/EmojiService";
import { makeUserCSVData, tsToHHmmss } from "src/service/UserService";
import { formatTime } from "src/utils";
import CardBody from "./Card";
import ErrorMessage from "./ErrorMessage";
import PollsTable from "./PollsTable";
import StatusTable from "./StatusTable";
import UserDetails from "./UserDetails/component";
import UsersTable from "./UsersTable";

const TABS = {
  OVERVIEW: 0,
  OVERVIEW_ACTIVITY_SCORE: 1,
  TIMELINE: 2,
  POLLING: 3,
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

  handleSaveSessionData(e) {
    const { target: downloadButton } = e;
    const { activitiesJson } = this.state;
    const { name: meetingName, createdOn, users, polls } = activitiesJson;
    const link = document.createElement("a");
    const data = makeUserCSVData(users, polls);
    const filename = `LearningDashboard_${meetingName}_${new Date(createdOn).toISOString().substr(0, 10)}.csv`.replace(/ /g, "-");

    downloadButton.setAttribute("disabled", "true");
    downloadButton.style.cursor = "not-allowed";
    link.setAttribute("href", `data:text/csv;charset=UTF-8,${encodeURIComponent(data)}`);
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    downloadButton.innerHTML = "Downloaded!";
    setTimeout(() => {
      downloadButton.innerHTML = "Download Session Data";
      downloadButton.removeAttribute("disabled");
      downloadButton.style.cursor = "pointer";
      downloadButton.focus();
    }, 3000);
    document.body.removeChild(link);
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

  updateModalUser() {
    const { activitiesJson } = this.state;
    const { users } = activitiesJson;

    console.log(users);
  }

  fetchActivitiesJson() {
    const { invalidSessionCount } = this.state;
    this.setState({
      activitiesJson: JSON.parse(this.props.jsonData),
      loading: false,
      invalidSessionCount: 0,
      lastUpdated: Date.now(),
    });
    this.updateModalUser();

    setTimeout(() => {
      this.fetchActivitiesJson();
    }, 10000 * 2 ** invalidSessionCount);
  }

  render() {
    const { activitiesJson, tab, loading, lastUpdated } = this.state;

    document.title = `BigBlueButton - Learning Analytics Dashboard - ${activitiesJson.name}`;

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
      if (activitiesJson === {} || typeof activitiesJson.name === "undefined") {
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
        <div className="flex flex-col sm:flex-row items-start justify-between pb-3">
          <h1 className="mt-3 text-2xl font-semibold whitespace-nowrap inline-block">
            Learning Dashboard
            <br />
            <span className="text-sm font-medium">{activitiesJson.name || ""}</span>
          </h1>
          <div className="mt-3 col-text-right py-1 text-gray-500 inline-block">
            <p className="font-bold">
              <div className="inline" data-test="meetingDateDashboard">
                {formatTime(activitiesJson.createdOn)}
              </div>
              &nbsp;&nbsp;
              {activitiesJson.endedOn > 0 ? (
                <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full">Ended</span>
              ) : null}
              {activitiesJson.endedOn === 0 ? (
                <span
                  className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full"
                  data-test="meetingStatusActiveDashboard"
                >
                  Active
                </span>
              ) : null}
            </p>
            <p data-test="meetingDurationTimeDashboard">
              Duration :&nbsp;
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
          <TabsListUnstyled className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            <TabUnstyled
              className="rounded focus:outline-none focus:ring focus:ring-pink-500 ring-offset-2"
              data-test="activeUsersPanelDashboard"
            >
              <Card>
                <CardContent classes={{ root: "!p-0" }}>
                  <CardBody
                    name={activitiesJson.endedOn === 0 ? "Active Users" : "Total Number Of Users"}
                    number={usersCount}
                    cardClass={tab === TABS.OVERVIEW ? "border-pink-500" : "hover:border-pink-500 border-white"}
                    iconClass="bg-pink-50 text-pink-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </CardBody>
                </CardContent>
              </Card>
            </TabUnstyled>
            <TabUnstyled
              className="rounded focus:outline-none focus:ring focus:ring-green-500 ring-offset-2"
              data-test="activityScorePanelDashboard"
            >
              <Card>
                <CardContent classes={{ root: "!p-0" }}>
                  <CardBody
                    name="Activity Score"
                    number={getAverageActivityScore() || 0}
                    cardClass={tab === TABS.OVERVIEW_ACTIVITY_SCORE ? "border-green-500" : "hover:border-green-500 border-white"}
                    iconClass="bg-green-200 text-green-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </CardBody>
                </CardContent>
              </Card>
            </TabUnstyled>
            <TabUnstyled
              className="rounded focus:outline-none focus:ring focus:ring-purple-500 ring-offset-2"
              data-test="timelinePanelDashboard"
            >
              <Card>
                <CardContent classes={{ root: "!p-0" }}>
                  <CardBody
                    name={"Timeline"}
                    number={totalOfEmojis()}
                    cardClass={tab === TABS.TIMELINE ? "border-purple-500" : "hover:border-purple-500 border-white"}
                    iconClass="bg-purple-200 text-purple-500"
                  >
                    {this.fetchMostUsedEmojis()}
                  </CardBody>
                </CardContent>
              </Card>
            </TabUnstyled>
            <TabUnstyled
              className="rounded focus:outline-none focus:ring focus:ring-blue-500 ring-offset-2"
              data-test="pollsPanelDashboard"
            >
              <Card>
                <CardContent classes={{ root: "!p-0" }}>
                  <CardBody
                    name={"Polls"}
                    number={Object.values(activitiesJson.polls || {}).length}
                    cardClass={tab === TABS.POLLING ? "border-blue-500" : "hover:border-blue-500 border-white"}
                    iconClass="bg-blue-100 text-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </CardBody>
                </CardContent>
              </Card>
            </TabUnstyled>
          </TabsListUnstyled>
          <TabPanelUnstyled value={0}>
            <h2 className="block my-2 pr-2 text-xl font-semibold">Overview</h2>
            <UsersTable
              allUsers={activitiesJson.users}
              totalOfActivityTime={totalOfActivity()}
              totalOfPolls={Object.values(activitiesJson.polls || {}).length}
              tab="overview"
            />
          </TabPanelUnstyled>
          <TabPanelUnstyled value={1}>
            <h2 className="block my-2 pr-2 text-xl font-semibold">Overview</h2>
            <div className="w-full overflow-hidden rounded-md shadow-xs border-2 border-gray-100">
              <div className="w-full overflow-x-auto">
                <UsersTable
                  allUsers={activitiesJson.users}
                  totalOfActivityTime={totalOfActivity()}
                  totalOfPolls={Object.values(activitiesJson.polls || {}).length}
                  tab="overview_activityscore"
                />
              </div>
            </div>
          </TabPanelUnstyled>
          <TabPanelUnstyled value={2}>
            <h2 className="block my-2 pr-2 text-xl font-semibold">Timeline</h2>
            <div className="w-full overflow-hidden rounded-md shadow-xs border-2 border-gray-100">
              <div className="w-full overflow-x-auto">
                <StatusTable allUsers={activitiesJson.users} slides={activitiesJson.presentationSlides} meetingId={activitiesJson.intId} />
              </div>
            </div>
          </TabPanelUnstyled>
          <TabPanelUnstyled value={3}>
            <h2 className="block my-2 pr-2 text-xl font-semibold">Polls</h2>
            <div className="w-full overflow-hidden rounded-md shadow-xs border-2 border-gray-100">
              <div className="w-full overflow-x-auto">
                <PollsTable polls={activitiesJson.polls} allUsers={activitiesJson.users} />
              </div>
            </div>
          </TabPanelUnstyled>
        </TabsUnstyled>
        <UserDetails dataJson={activitiesJson} />
        <hr className="my-8" />
        <div className="flex justify-between pb-8 text-xs text-gray-800 dark:text-gray-400 whitespace-nowrap flex-col sm:flex-row">
          <div className="flex flex-col justify-center mb-4 sm:mb-0">
            <p className="text-gray-700">
              {lastUpdated && (
                <>
                  Last updated at &nbsp;
                  {formatTime(lastUpdated)}
                  &nbsp;
                  {formatTime(lastUpdated)}
                </>
              )}
            </p>
          </div>
          <button
            data-test="downloadSessionDataDashboard"
            type="button"
            className="border-2 text-gray-700 border-gray-200 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring ring-offset-2 focus:ring-gray-500 focus:ring-opacity-50"
            onClick={this.handleSaveSessionData.bind(this)}
          >
            Download Session Data
          </button>
        </div>
      </div>
    );
  }
}
