import { VideoCameraBackSharp } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MicIcon from "@mui/icons-material/Mic";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import PanToolIcon from "@mui/icons-material/PanTool";
import TextsmsIcon from "@mui/icons-material/Textsms";
import { Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import React from "react";
import { emojiConfigs, getUserEmojisSummary } from "src/service/EmojiService";
import { getActivityScore, getSumOfTime, tsToHHmmss } from "src/service/UserService";
import { formatTime } from "src/utils";
import UserAvatar from "./UserAvatar";
import styles from "./styles.module.scss";

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
          <TableHead className="tableHead">
            <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-700 uppercase border-b bg-gray-100">
              <TableCell
                className={`px-3.5 2xl:px-4 py-3 col-text-left ${tab === "overview" ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (tab === "overview") this.toggleOrder("userOrder");
                }}
              >
                User
              </TableCell>
              <TableCell
                className={`px-3.5 2xl:px-4 py-3 text-center ${tab === "overview" ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (tab === "overview") this.toggleOrder("onlineTimeOrder");
                }}
              >
                Online time
              </TableCell>
              <TableCell
                className={`px-3.5 2xl:px-4 py-3 text-center ${tab === "overview" ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (tab === "overview") this.toggleOrder("talkTimeOrder");
                }}
              >
                Talk time
              </TableCell>
              <TableCell
                className={`px-3.5 2xl:px-4 py-3 text-center ${tab === "overview" ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (tab === "overview") this.toggleOrder("webcamTimeOrder");
                }}
              >
                Webcam Time
              </TableCell>
              <TableCell>Messages</TableCell>
              <TableCell>Emojis</TableCell>
              <TableCell>Raise Hand</TableCell>
              <TableCell
                onClick={() => {
                  if (tab === "overview_activityscore") this.toggleOrder("activityscoreOrder");
                }}
              >
                Activity Score
              </TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {typeof allUsers === "object" && Object.values(allUsers || {}).length > 0 ? (
              Object.values(allUsers || {})
                .sort(tab === "overview" ? sortFunctions[lastFieldClicked] : sortFunctions.activityscoreOrder)
                .map((user) => {
                  const opacity = user.leftOn > 0 ? "opacity-75" : "";
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <Button variant="outlined" startIcon={<UserAvatar user={user} style={{ pointerEvents: "none" }} />}>
                            {user.name}
                          </Button>
                          {Object.values(user.intIds || {}).map((intId, index) => (
                            <>
                              <Tooltip title="Join meeting time" placement="right">
                                <Button sx={{ color: "#000" }} startIcon={<LoginIcon color="primary" />}>
                                  {formatTime(intId.registeredOn)}
                                </Button>
                              </Tooltip>

                              {intId.leftOn > 0 ? (
                                <Tooltip title="Leave meeting time" placement="right">
                                  <Button sx={{ color: "#000" }} startIcon={<LogoutIcon color="warning" />}>
                                    {formatTime(intId.leftOn)}
                                  </Button>
                                </Tooltip>
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
                      <TableCell>
                        {user.talk.totalTime > 0 ? (
                          <span className={styles.userTableCell}>
                            <MicIcon color="primary" />
                            {tsToHHmmss(user.talk.totalTime)}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className={`px-4 py-3 text-sm text-center ${opacity}`} data-test="userWebcamTimeDashboard">
                        {getSumOfTime(user.webcams) > 0 ? (
                          <span className={styles.userTableCell}>
                            <VideoCameraBackSharp color="primary" />
                            {tsToHHmmss(getSumOfTime(user.webcams))}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className={`px-4 py-3 text-sm text-center ${opacity}`} data-test="userTotalMessagesDashboard">
                        {user.totalOfMessages > 0 ? (
                          <span className={styles.userTableCell}>
                            <TextsmsIcon color="primary" />
                            {user.totalOfMessages}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {Object.keys(usersEmojisSummary[user.userKey] || {}).map((emoji) => (
                          <div key={emojiConfigs[emoji].icon} className={styles.userTableCell}>
                            <i className={`${emojiConfigs[emoji].icon} text-sm`} />
                            &nbsp;
                            {usersEmojisSummary[user.userKey][emoji]}
                            &nbsp;
                            {emojiConfigs[emoji].defaultMessage}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {user.emojis.filter((emoji) => emoji.name === "raiseHand").length > 0 ? (
                          <span className={styles.userTableCell}>
                            <PanToolIcon color="primary" />
                            {user.emojis.filter((emoji) => emoji.name === "raiseHand").length}
                          </span>
                        ) : null}
                      </TableCell>
                      {!user.isModerator ? (
                        <TableCell>
                          <svg viewBox="0 0 82 12" width="82" height="12" className="flex-none m-auto inline">
                            <rect width="12" height="12" fill={usersActivityScore[user.userKey] > 0 ? "#A7F3D0" : "#e4e4e7"} />
                            <rect width="12" height="12" x="14" fill={usersActivityScore[user.userKey] > 2 ? "#6EE7B7" : "#e4e4e7"} />
                            <rect width="12" height="12" x="28" fill={usersActivityScore[user.userKey] > 4 ? "#34D399" : "#e4e4e7"} />
                            <rect width="12" height="12" x="42" fill={usersActivityScore[user.userKey] > 6 ? "#10B981" : "#e4e4e7"} />
                            <rect width="12" height="12" x="56" fill={usersActivityScore[user.userKey] > 8 ? "#059669" : "#e4e4e7"} />
                            <rect width="12" height="12" x="70" fill={usersActivityScore[user.userKey] === 10 ? "#047857" : "#e4e4e7"} />
                          </svg>
                          &nbsp;
                          <span>{usersActivityScore[user.userKey]}</span>
                        </TableCell>
                      ) : (
                        <TableCell>Not available</TableCell>
                      )}
                      <TableCell>
                        {Object.values(user.intIds)[Object.values(user.intIds).length - 1].leftOn > 0 ? (
                          <Chip color="error" label="Offline" />
                        ) : (
                          <Chip color="success" label="Online" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No users</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default UsersTable;
