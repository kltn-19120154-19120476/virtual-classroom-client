import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import NorthIcon from "@mui/icons-material/North";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import PanToolIcon from "@mui/icons-material/PanTool";
import SouthIcon from "@mui/icons-material/South";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";
import { emojiConfigs, getUserEmojisSummary } from "src/service/EmojiService";
import { getActivityScore, getSumOfTime, tsToHHmmss } from "src/service/UserService";
import { formatTime } from "src/utils";
import UserAvatar from "./UserAvatar";
import styles from "./styles.module.scss";
function renderArrow(order = "asc") {
  return order === "asc" ? <NorthIcon /> : <SouthIcon />;
}

class UsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userOrder: "asc",
      onlineTimeOrder: "desc",
      talkTimeOrder: "desc",
      webcamTimeOrder: "desc",
      activityscoreOrder: "desc",
      lastFieldClicked: "userOrder",
    };

    this.openUserModal = this.openUserModal.bind(this);
  }

  toggleOrder(field) {
    const { [field]: fieldOrder } = this.state;
    const { tab } = this.props;

    if (fieldOrder === "asc") {
      this.setState({ [field]: "desc" });
    } else {
      this.setState({ [field]: "asc" });
    }

    if (tab === "overview") this.setState({ lastFieldClicked: field });
  }

  openUserModal(user) {
    console.log(user);
  }

  render() {
    const { allUsers, totalOfActivityTime, totalOfPolls, tab } = this.props;

    const { activityscoreOrder, userOrder, onlineTimeOrder, talkTimeOrder, webcamTimeOrder, lastFieldClicked } = this.state;

    const usersEmojisSummary = {};
    Object.values(allUsers || {}).forEach((user) => {
      usersEmojisSummary[user.userKey] = getUserEmojisSummary(user, "raiseHand");
    });

    function getOnlinePercentage(registeredOn, leftOn) {
      const totalUserOnlineTime = (leftOn > 0 ? leftOn : new Date().getTime()) - registeredOn;
      return Math.ceil((totalUserOnlineTime / totalOfActivityTime) * 100);
    }

    const usersActivityScore = {};
    Object.values(allUsers || {}).forEach((user) => {
      usersActivityScore[user.userKey] = getActivityScore(user, allUsers, totalOfPolls);
    });

    const sortFunctions = {
      userOrder(a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return userOrder === "desc" ? 1 : -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return userOrder === "desc" ? -1 : 1;
        }
        return 0;
      },
      onlineTimeOrder(a, b) {
        const onlineTimeA = Object.values(a.intIds).reduce(
          (prev, intId) => prev + ((intId.leftOn > 0 ? intId.leftOn : new Date().getTime()) - intId.registeredOn),
          0,
        );

        const onlineTimeB = Object.values(b.intIds).reduce(
          (prev, intId) => prev + ((intId.leftOn > 0 ? intId.leftOn : new Date().getTime()) - intId.registeredOn),
          0,
        );

        if (onlineTimeA < onlineTimeB) {
          return onlineTimeOrder === "desc" ? 1 : -1;
        }

        if (onlineTimeA > onlineTimeB) {
          return onlineTimeOrder === "desc" ? -1 : 1;
        }

        return 0;
      },
      talkTimeOrder(a, b) {
        const talkTimeA = a.talk.totalTime;
        const talkTimeB = b.talk.totalTime;

        if (talkTimeA < talkTimeB) {
          return talkTimeOrder === "desc" ? 1 : -1;
        }

        if (talkTimeA > talkTimeB) {
          return talkTimeOrder === "desc" ? -1 : 1;
        }

        return 0;
      },
      webcamTimeOrder(a, b) {
        const webcamTimeA = getSumOfTime(a.webcams);
        const webcamTimeB = getSumOfTime(b.webcams);

        if (webcamTimeA < webcamTimeB) {
          return webcamTimeOrder === "desc" ? 1 : -1;
        }

        if (webcamTimeA > webcamTimeB) {
          return webcamTimeOrder === "desc" ? -1 : 1;
        }

        return 0;
      },
      activityscoreOrder(a, b) {
        if (usersActivityScore[a.userKey] < usersActivityScore[b.userKey]) {
          return activityscoreOrder === "desc" ? 1 : -1;
        }
        if (usersActivityScore[a.userKey] > usersActivityScore[b.userKey]) {
          return activityscoreOrder === "desc" ? -1 : 1;
        }
        if (a.isModerator === false && b.isModerator === true) return 1;
        if (a.isModerator === true && b.isModerator === false) return -1;
        return 0;
      },
    };

    return (
      <TableContainer>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-700 uppercase border-b bg-gray-100">
              <TableCell
                className={`px-3.5 2xl:px-4 py-3 col-text-left ${tab === "overview" ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (tab === "overview") this.toggleOrder("userOrder");
                }}
              >
                User
                {tab === "overview" && lastFieldClicked === "userOrder" ? renderArrow(userOrder) : null}
              </TableCell>
              <TableCell
                className={`px-3.5 2xl:px-4 py-3 text-center ${tab === "overview" ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (tab === "overview") this.toggleOrder("onlineTimeOrder");
                }}
              >
                Online time
                {tab === "overview" && lastFieldClicked === "onlineTimeOrder" ? renderArrow(onlineTimeOrder) : null}
              </TableCell>
              <TableCell
                className={`px-3.5 2xl:px-4 py-3 text-center ${tab === "overview" ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (tab === "overview") this.toggleOrder("talkTimeOrder");
                }}
              >
                Talk time
                {tab === "overview" && lastFieldClicked === "talkTimeOrder" ? renderArrow(talkTimeOrder) : null}
              </TableCell>
              <TableCell
                className={`px-3.5 2xl:px-4 py-3 text-center ${tab === "overview" ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (tab === "overview") this.toggleOrder("webcamTimeOrder");
                }}
              >
                Webcam Time
                {tab === "overview" && lastFieldClicked === "webcamTimeOrder" ? renderArrow(webcamTimeOrder) : null}
              </TableCell>
              <TableCell className="px-3.5 2xl:px-4 py-3 text-center">Messages</TableCell>
              <TableCell className="px-3.5 2xl:px-4 py-3 col-text-left">Emojis</TableCell>
              <TableCell className="px-3.5 2xl:px-4 py-3 text-center">Raise Hand</TableCell>
              <TableCell
                className={`px-3.5 2xl:px-4 py-3 text-center ${tab === "overview_activityscore" ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (tab === "overview_activityscore") this.toggleOrder("activityscoreOrder");
                }}
              >
                Activity Score
                {tab === "overview_activityscore" ? renderArrow(activityscoreOrder) : null}
              </TableCell>
              <TableCell className="px-3.5 2xl:px-4 py-3 text-center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-white divide-y whitespace-nowrap">
            {typeof allUsers === "object" && Object.values(allUsers || {}).length > 0 ? (
              Object.values(allUsers || {})
                .sort(tab === "overview" ? sortFunctions[lastFieldClicked] : sortFunctions.activityscoreOrder)
                .map((user) => {
                  const opacity = user.leftOn > 0 ? "opacity-75" : "";
                  return (
                    <TableRow key={user} className="text-gray-700">
                      <TableCell>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <Button variant="outlined" onClick={() => this.openUserModal(user)} startIcon={<UserAvatar user={user} />}>
                            {user.name}
                          </Button>
                          {Object.values(user.intIds || {}).map((intId, index) => (
                            <>
                              <Button sx={{ color: "#000" }} startIcon={<LoginIcon color="primary" />}>
                                {formatTime(intId.registeredOn)}
                              </Button>
                              {intId.leftOn > 0 ? (
                                <Button sx={{ color: "#000" }} startIcon={<LogoutIcon color="warning" />}>
                                  {formatTime(intId.leftOn)}
                                </Button>
                              ) : null}
                            </>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <OnlinePredictionIcon color="success" />
                          {tsToHHmmss(
                            Object.values(user.intIds).reduce(
                              (prev, intId) => prev + ((intId.leftOn > 0 ? intId.leftOn : new Date().getTime()) - intId.registeredOn),
                              0,
                            ),
                          )}
                        </div>
                        <br />
                        {(function getPercentage() {
                          const { intIds } = user;
                          const percentage = Object.values(intIds || {}).reduce(
                            (prev, intId) => prev + getOnlinePercentage(intId.registeredOn, intId.leftOn),
                            0,
                          );

                          return (
                            <div style={{ background: "#ccc" }} title={`${percentage.toString()}%`}>
                              <div
                                aria-label=" "
                                style={{
                                  backgroundColor: "green",
                                  width: `${percentage.toString()}%`,
                                  height: 6,
                                  borderRadius: 5,
                                }}
                                role="progressbar"
                              />
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell className={`px-4 py-3 text-sm text-center items-center ${opacity}`} data-test="userTotalTalkTimeDashboard">
                        {user.talk.totalTime > 0 ? (
                          <span className="text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 inline"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                              />
                            </svg>
                            &nbsp;
                            {tsToHHmmss(user.talk.totalTime)}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className={`px-4 py-3 text-sm text-center ${opacity}`} data-test="userWebcamTimeDashboard">
                        {getSumOfTime(user.webcams) > 0 ? (
                          <span className="text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 inline"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            &nbsp;
                            {tsToHHmmss(getSumOfTime(user.webcams))}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className={`px-4 py-3 text-sm text-center ${opacity}`} data-test="userTotalMessagesDashboard">
                        {user.totalOfMessages > 0 ? (
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 inline"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            &nbsp;
                            {user.totalOfMessages}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className={`px-4 py-3 text-sm col-text-left ${opacity}`} data-test="userTotalEmojisDashboard">
                        {Object.keys(usersEmojisSummary[user.userKey] || {}).map((emoji) => (
                          <div className="text-xs whitespace-nowrap" key={emoji}>
                            <i className={`${emojiConfigs[emoji].icon} text-sm`} />
                            &nbsp;
                            {usersEmojisSummary[user.userKey][emoji]}
                            &nbsp;
                            {emojiConfigs[emoji].defaultMessage}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell className={`px-4 py-3 text-sm text-center ${opacity}`} data-test="userRaiseHandDashboard">
                        {user.emojis.filter((emoji) => emoji.name === "raiseHand").length > 0 ? (
                          <span>
                            <PanToolIcon />
                            {user.emojis.filter((emoji) => emoji.name === "raiseHand").length}
                          </span>
                        ) : null}
                      </TableCell>
                      {!user.isModerator ? (
                        <TableCell className={`px-4 py-3 text-sm text-center items ${opacity}`} data-test="userActivityScoreDashboard">
                          <svg viewBox="0 0 82 12" width="82" height="12" className="flex-none m-auto inline">
                            <rect width="12" height="12" fill={usersActivityScore[user.userKey] > 0 ? "#A7F3D0" : "#e4e4e7"} />
                            <rect width="12" height="12" x="14" fill={usersActivityScore[user.userKey] > 2 ? "#6EE7B7" : "#e4e4e7"} />
                            <rect width="12" height="12" x="28" fill={usersActivityScore[user.userKey] > 4 ? "#34D399" : "#e4e4e7"} />
                            <rect width="12" height="12" x="42" fill={usersActivityScore[user.userKey] > 6 ? "#10B981" : "#e4e4e7"} />
                            <rect width="12" height="12" x="56" fill={usersActivityScore[user.userKey] > 8 ? "#059669" : "#e4e4e7"} />
                            <rect width="12" height="12" x="70" fill={usersActivityScore[user.userKey] === 10 ? "#047857" : "#e4e4e7"} />
                          </svg>
                          &nbsp;
                          <span className="text-xs bg-gray-200 rounded-full px-2">{usersActivityScore[user.userKey]}</span>
                        </TableCell>
                      ) : (
                        <TableCell className="px-4 py-3 text-sm text-center">Not available</TableCell>
                      )}
                      <TableCell className="px-3.5 2xl:px-4 py-3 text-xs text-center" data-test="userStatusDashboard">
                        {Object.values(user.intIds)[Object.values(user.intIds).length - 1].leftOn > 0 ? (
                          <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full">Offline</span>
                        ) : (
                          <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">Online</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow className="text-gray-700">
                <TableCell colSpan="8" className="px-3.5 2xl:px-4 py-3 text-sm text-center">
                  No users
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default UsersTable;
