import PollIcon from "@mui/icons-material/Poll";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { NoData } from "../NoDataNotification";
import UserAvatar from "./UserAvatar";

const PollsTable = (props) => {
  const { allUsers, polls } = props;

  if (typeof polls === "object" && Object.values(polls).length === 0) {
    return (
      <NoData
        title="No polls have been created"
        description="Once a poll has been sent to users, their results will appear in this list."
        icon={<PollIcon />}
      />
    );
  }

  const commonUserProps = {
    field: "User",
    headerName: "User",
    flex: 1,
    sortable: true,
  };

  const commonCountProps = {
    field: "count",
    headerName: "Total",
    flex: 1,
    sortable: true,
  };

  const anonGridCols = [
    {
      ...commonUserProps,
      valueGetter: (params) => params?.row?.User?.name,
      renderCell: () => (
        <div className="flex items-center text-sm">
          <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="relative hidden w-8 h-8 mr-3 rounded-full md:block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold">Anonymous</p>
          </div>
        </div>
      ),
    },
  ];

  const gridCols = [
    {
      ...commonUserProps,
      valueGetter: (params) => params?.row?.User?.name,
      renderCell: (params) => <Button startIcon={<UserAvatar user={params?.row?.User} />}>{params?.value}</Button>,
    },
  ];

  anonGridCols.push({
    ...commonCountProps,
    renderCell: () => "",
  });

  gridCols.push({
    ...commonCountProps,
    valueGetter: (params) => Object.keys(params?.row?.User?.answers)?.length || 0,
    renderCell: (params) => params?.value,
  });

  const isOverflown = (element) => element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;

  // eslint-disable-next-line react/display-name
  const GridCellExpand = React.memo((cellProps) => {
    const { width, value, isMostCommonAnswer, anonymous } = cellProps;
    const wrapper = React.useRef(null);
    const cellDiv = React.useRef(null);
    const cellValue = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showFullCell, setShowFullCell] = React.useState(false);
    const [showPopper, setShowPopper] = React.useState(false);

    const handleMouseEnter = () => {
      const isCurrentlyOverflown = isOverflown(cellValue.current);
      setShowPopper(isCurrentlyOverflown);
      setAnchorEl(cellDiv.current);
      setShowFullCell(true);
    };

    const handleMouseLeave = () => {
      setShowFullCell(false);
    };

    React.useEffect(() => {
      if (!showFullCell) {
        return undefined;
      }

      function handleKeyDown(nativeEvent) {
        if (nativeEvent.key === "Escape" || nativeEvent.key === "Esc") {
          setShowFullCell(false);
        }
      }

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [setShowFullCell, showFullCell]);

    if (anonymous) {
      return (
        <span title={"Anonymous Poll (answers in the last row)"}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      );
    }

    let val = value;
    if (typeof value === "object") {
      val = Object.values(value)?.join(", ");
    }

    return (
      <Box
        ref={wrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          alignItems: "center",
          lineHeight: "24px",
          width: 1,
          height: 1,
          position: "relative",
          display: "flex",
        }}
      >
        <Box
          ref={cellDiv}
          sx={{
            height: 1,
            width,
            display: "block",
            position: "absolute",
            top: 0,
          }}
        />
        <Box
          ref={cellValue}
          sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          className={isMostCommonAnswer ? "font-bold" : ""}
        >
          {val}
        </Box>
        {showPopper && (
          <Popper open={showFullCell && anchorEl !== null} anchorEl={anchorEl} style={{ width, marginLeft: -17 }}>
            <Paper elevation={1} style={{ minHeight: wrapper.current.offsetHeight - 3 }}>
              <Typography className={isMostCommonAnswer ? "font-bold" : ""} variant="body2" style={{ padding: 8 }}>
                {val}
              </Typography>
            </Paper>
          </Popper>
        )}
      </Box>
    );
  });

  let hasAnonymousPoll = false;
  const initPollData = {};
  const anonymousPollData = {};
  const anonGridRow = [];
  const gridRows = [];

  Object.values(polls).map((v, i) => {
    initPollData[`${v?.pollId}`] = "";
    const headerName = v?.question?.length > 0 ? v?.question : `Poll ${i + 1}`;
    if (v?.anonymous) {
      hasAnonymousPoll = true;
      anonymousPollData[`${v?.pollId}`] = v?.anonymousAnswers;
    }

    const commonColProps = {
      field: v?.pollId,
      headerName,
      flex: 1,
    };

    anonGridCols.push({
      ...commonColProps,
      sortable: false,
      renderCell: (params) => <GridCellExpand value={params?.value || ""} width={params?.colDef?.computedWidth} />,
    });

    gridCols.push({
      ...commonColProps,
      sortable: true,
      valueGetter: (params) => {
        const colVal = params?.row[params?.field];
        return colVal === "" ? "" : colVal?.join(", ");
      },
      renderCell: (params) => {
        // Here we count each poll vote in order to find out the most common answer.
        const pollVotesCount = Object.keys(polls || {}).reduce((prevPollVotesCount, pollId) => {
          const currPollVotesCount = { ...prevPollVotesCount };
          currPollVotesCount[pollId] = {};

          if (polls[pollId].anonymous) {
            polls[pollId].anonymousAnswers.forEach((answer) => {
              const answerLowerCase = answer.toLowerCase();
              if (currPollVotesCount[pollId][answerLowerCase] === undefined) {
                currPollVotesCount[pollId][answerLowerCase] = 1;
              } else {
                currPollVotesCount[pollId][answerLowerCase] += 1;
              }
            });
            return currPollVotesCount;
          }

          Object.values(allUsers).forEach((currUser) => {
            if (currUser.answers[pollId] !== undefined) {
              const userAnswers = Array.isArray(currUser.answers[pollId]) ? currUser.answers[pollId] : [currUser.answers[pollId]];

              userAnswers.forEach((answer) => {
                const answerLowerCase = answer.toLowerCase();
                if (currPollVotesCount[pollId][answerLowerCase] === undefined) {
                  currPollVotesCount[pollId][answerLowerCase] = 1;
                } else {
                  currPollVotesCount[pollId][answerLowerCase] += 1;
                }
              });
            }
          });
          return currPollVotesCount;
        }, {});
        const answersSorted = Object.entries(pollVotesCount[v?.pollId]).sort(([, countA], [, countB]) => countB - countA);
        const isMostCommonAnswer = answersSorted[0]?.[0]?.toLowerCase() === params?.value?.toLowerCase() && answersSorted[0]?.[1] > 1;
        return (
          <GridCellExpand
            anonymous={v?.anonymous}
            isMostCommonAnswer={isMostCommonAnswer}
            value={params?.value || ""}
            width={params?.colDef?.computedWidth}
          />
        );
      },
    });
    return v;
  });

  Object.values(allUsers).map((u, i) => {
    if (u?.isModerator && Object.keys(u?.answers)?.length === 0) return u;
    if (u?.name) gridRows.push({ id: i + 1, User: u, ...{ ...initPollData, ...u?.answers } });
    return u;
  });

  if (hasAnonymousPoll) {
    anonGridRow.push({ id: 1, User: { name: "Anonymous" }, ...{ ...initPollData, ...anonymousPollData } });
  }

  const commonGridProps = {
    hideFooter: true,
    disableColumnMenu: true,
    disableColumnSelector: true,
    disableSelectionOnClick: true,
    rowHeight: 45,
  };

  const anonymousDataGrid = (
    <DataGrid
      {...commonGridProps}
      rows={anonGridRow}
      columns={anonGridCols}
      sx={{
        "& .MuiDataGrid-columnHeaders": {
          display: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          marginTop: "0!important",
        },
      }}
    />
  );

  return (
    <div className="bg-white" style={{ width: "100%" }}>
      <DataGrid
        {...commonGridProps}
        rows={gridRows}
        columns={gridCols}
        sortingOrder={["asc", "desc"]}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#ebebeb",
            textTransform: "uppercase",
            letterSpacing: ".025em",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "600",
          },
        }}
      />
      {hasAnonymousPoll && anonymousDataGrid}
    </div>
  );
};

export default PollsTable;
