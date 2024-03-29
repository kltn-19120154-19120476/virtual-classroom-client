import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";
import { emojiConfigs, filterUserEmojis } from "src/service/EmojiService";
import { WEB_HOST } from "src/sysconfig";
import UserAvatar from "./UserAvatar";
class StatusTable extends React.Component {
  componentDidMount() {
    // This code is needed to prevent emojis from overflowing.
    const emojis = document.getElementsByClassName("timeline-emoji");
    for (let i = 0; i < emojis.length; i += 1) {
      const emojiStyle = window.getComputedStyle(emojis[i]);
      const offsetLeft = Number(emojiStyle.left.replace(/px/g, "").trim());
      if (offsetLeft < 0) {
        emojis[i].style.left = "0";
      }
    }
  }

  componentDidUpdate() {
    // This code is needed to prevent emojis from overflowing.
    const emojis = document.getElementsByClassName("timeline-emoji");
    for (let i = 0; i < emojis.length; i += 1) {
      const emojiStyle = window.getComputedStyle(emojis[i]);
      const offsetLeft = Number(emojiStyle.left.replace(/px/g, "").trim());
      if (offsetLeft < 0) {
        emojis[i].style.left = "0";
      }
    }
  }

  render() {
    const { allUsers, slides, meetingId } = this.props;

    function tsToHHmmss(ts) {
      return new Date(ts).toISOString().substr(11, 8);
    }

    const usersPeriods = {};
    Object.values(allUsers || {}).forEach((user) => {
      usersPeriods[user.userKey] = [];
      Object.values(user.intIds || {}).forEach((intId, index, intIdsArray) => {
        let { leftOn } = intId;
        const nextPeriod = intIdsArray[index + 1];
        if (nextPeriod && Math.abs(leftOn - nextPeriod.registeredOn) <= 30000) {
          leftOn = nextPeriod.leftOn;
          intIdsArray.splice(index + 1, 1);
        }
        usersPeriods[user.userKey].push({
          registeredOn: intId.registeredOn,
          leftOn,
        });
      });
    });

    const usersRegisteredTimes = Object.values(allUsers || {})
      .map((user) => Object.values(user.intIds).map((intId) => intId.registeredOn))
      .flat();
    const usersLeftTimes = Object.values(allUsers || {})
      .map((user) =>
        Object.values(user.intIds).map((intId) => {
          if (intId.leftOn === 0) return new Date().getTime();
          return intId.leftOn;
        }),
      )
      .flat();

    const firstRegisteredOnTime = Math.min(...usersRegisteredTimes);
    const lastLeftOnTime = Math.max(...usersLeftTimes);

    const periods = [];
    let hasSlides = false;
    if (slides && Array.isArray(slides) && slides.length > 0) {
      const filteredSlides = slides.filter((slide) => slide.presentationId !== "");
      if (filteredSlides.length > 0) {
        hasSlides = true;
        if (firstRegisteredOnTime < filteredSlides[0].setOn) {
          periods.push({
            start: firstRegisteredOnTime,
            end: filteredSlides[0].setOn - 1,
          });
        }
        filteredSlides.forEach((slide, index, slidesArray) => {
          periods.push({
            slide,
            start: slide.setOn,
            end: slidesArray[index + 1]?.setOn - 1 || lastLeftOnTime,
          });
        });
      }
    } else {
      periods.push({
        start: firstRegisteredOnTime,
        end: lastLeftOnTime,
      });
    }

    const isRTL = document.dir === "rtl";

    function makeLineThrough(userPeriod, period) {
      const { registeredOn, leftOn } = userPeriod;
      const boundaryLeft = period.start;
      const boundaryRight = period.end;
      const interval = period.end - period.start;
      let roundedLeft = registeredOn >= boundaryLeft && registeredOn <= boundaryRight ? "rounded-l" : "";
      let roundedRight = leftOn >= boundaryLeft && leftOn <= boundaryRight ? "rounded-r" : "";
      let offsetLeft = 0;
      let offsetRight = 0;
      if (registeredOn >= boundaryLeft && registeredOn <= boundaryRight) {
        offsetLeft = ((registeredOn - boundaryLeft) * 100) / interval;
      }
      if (leftOn >= boundaryLeft && leftOn <= boundaryRight) {
        offsetRight = ((boundaryRight - leftOn) * 100) / interval;
      }
      let width = "";
      if (offsetLeft === 0 && offsetRight >= 99) {
        width = "20px";
      }
      if (offsetRight === 0 && offsetLeft >= 99) {
        width = "20px";
      }
      if (offsetLeft && offsetRight) {
        const variation = offsetLeft - offsetRight;
        if (variation > -1 && variation < 1) {
          width = "20px";
        }
      }
      if (isRTL) {
        const aux = roundedRight;

        if (roundedLeft !== "") roundedRight = "rounded-r";
        else roundedRight = "";

        if (aux !== "") roundedLeft = "rounded-l";
        else roundedLeft = "";
      }
      const redress = "(0.375rem / 2)";
      return (
        <div
          style={{
            top: `calc(50% - ${redress})`,
            left: `${isRTL ? offsetRight : offsetLeft}%`,
            right: `${isRTL ? offsetLeft : offsetRight}%`,
            position: "absolute",
            backgroundColor: "#cfcfcf",
            zIndex: 10,
            height: 10,
          }}
        />
      );
    }

    return (
      <TableContainer>
        <Table sx={{ minWidth: 600 }}>
          <colgroup>
            <col width="20%"></col>
            <col width="80%"></col>
          </colgroup>
          <TableHead className="tableHead">
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell colSpan={periods.length}>Timeline</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hasSlides ? (
              <TableRow>
                <TableCell
                  style={{
                    position: "sticky",
                    left: isRTL ? "initial" : 0,
                    right: !isRTL ? "initial" : 0,
                    zIndex: 30,
                  }}
                />
                {periods.map((period) => {
                  const { slide, start, end } = period;
                  const padding = isRTL ? "paddingLeft" : "paddingRight";
                  const URLPrefix = `${WEB_HOST}/bigbluebutton/presentation/${meetingId}/${meetingId}`;
                  const { presentationId, pageNum, presentationName } = slide || {};
                  return (
                    <TableCell
                      key={`${URLPrefix}/${presentationId}/svg/${pageNum}`}
                      style={{
                        [padding]: `${(end - start) / 1000}px`,
                      }}
                    >
                      {slide && (
                        <div>
                          <a
                            href={`${URLPrefix}/${presentationId}/svg/${pageNum}`}
                            className="block border-2 border-gray-300"
                            target="_blank"
                            rel="noreferrer"
                            aria-describedby={`thumb-desc-${presentationId}`}
                          >
                            <img
                              src={`${URLPrefix}/${presentationId}/thumbnail/${pageNum}`}
                              alt={`Presentation thumbnail - presentation ${presentationName} - page number ${pageNum}`}
                              style={{
                                maxWidth: "150px",
                                width: "150px",
                                height: "auto",
                                whiteSpace: "pre-line",
                              }}
                            />
                          </a>
                          <p style={{ textAlign: "center" }}>{tsToHHmmss(slide.setOn - periods[0].start)}</p>
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ) : null}
            {typeof allUsers === "object" && Object.values(allUsers || {}).length > 0
              ? Object.values(allUsers || {})
                  .sort((a, b) => {
                    if (a.isModerator === false && b.isModerator === true) return 1;
                    if (a.isModerator === true && b.isModerator === false) return -1;
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                  })
                  .map((user) => (
                    <TableRow key={user.userKey}>
                      <TableCell
                        style={{
                          position: "sticky",
                          left: isRTL ? "initial" : 0,
                          right: !isRTL ? "initial" : 0,
                          zIndex: 30,
                          pointerEvents: "none",
                        }}
                      >
                        <Button startIcon={<UserAvatar user={user} />}>{user.name}</Button>
                      </TableCell>
                      {periods.map((period) => {
                        const boundaryLeft = period.start;
                        const boundaryRight = period.end;
                        const interval = period.end - period.start;
                        return (
                          <TableCell style={{ position: "relative", textAlign: "left" }} key={`${user.userKey}-period`}>
                            {usersPeriods[user.userKey].length > 0
                              ? usersPeriods[user.userKey].map((userPeriod) => {
                                  const { registeredOn, leftOn } = userPeriod;
                                  const userEmojisInPeriod = filterUserEmojis(
                                    user,
                                    null,
                                    registeredOn >= boundaryLeft && registeredOn <= boundaryRight ? registeredOn : boundaryLeft,
                                    leftOn >= boundaryLeft && leftOn <= boundaryRight ? leftOn : boundaryRight,
                                  );
                                  return (
                                    <>
                                      {(registeredOn >= boundaryLeft && registeredOn <= boundaryRight) ||
                                      (leftOn >= boundaryLeft && leftOn <= boundaryRight) ||
                                      (boundaryLeft > registeredOn && boundaryRight < leftOn) ||
                                      (boundaryLeft >= registeredOn && leftOn === 0)
                                        ? makeLineThrough(userPeriod, period)
                                        : null}
                                      {userEmojisInPeriod.map((emoji) => {
                                        const offset = ((emoji.sentOn - period.start) * 100) / interval;
                                        const origin = isRTL ? "right" : "left";
                                        const redress = "(0.875rem / 2 + 0.25rem)";
                                        return (
                                          <div
                                            key={emoji.name}
                                            className={`timeline-emoji`}
                                            role="generic"
                                            aria-label={emojiConfigs[emoji.name].defaultMessage}
                                            style={{
                                              position: "absolute",
                                              fontSize: "1rem",
                                              padding: "0.25rem",
                                              color: "#fff",
                                              borderRadius: "50%",
                                              backgroundColor: "#467fcf",
                                              display: "flex",
                                              top: `calc(50% - ${redress})`,
                                              [origin]: `calc(${offset}% - ${redress})`,
                                              zIndex: 20,
                                            }}
                                            title={emojiConfigs[emoji.name].defaultMessage}
                                          >
                                            <i className={`bbb-icon-timeline ${emojiConfigs[emoji.name].icon}`} />
                                          </div>
                                        );
                                      })}
                                    </>
                                  );
                                })
                              : null}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                  .flat()
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default StatusTable;
