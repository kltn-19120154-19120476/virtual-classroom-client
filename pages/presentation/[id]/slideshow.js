import { HelpCenter, QuestionMark, ZoomInMapRounded, ZoomOutMapRounded } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid, IconButton, Tooltip } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import SendIcon from "@mui/icons-material/Send";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import { useContext, useEffect } from "react";
import { clearChat, getPresentationDetail, getQuestionList, updatePresentation } from "../../../client/presentation";
import LoadingScreen from "../../../components/LoadingScreen";
import HeadingPresentation from "../../../components/Presentation/Heading";
import MultipleChoicePresentation from "../../../components/Presentation/MultipleChoice";
import ParagraphPresentation from "../../../components/Presentation/Paragraph";
import { AuthContext } from "../../../context/authContext";
import { SocketContext } from "../../../context/socketContext";
import styles from "./styles.module.scss";
import ChatBox from "../../../components/ChatBox";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EventNoteIcon from "@mui/icons-material/EventNote";

const SlideShow = () => {
  const { socket } = useContext(SocketContext);
  const [openQuestion, setOpenQuestion] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const handle = useFullScreenHandle();
  const router = useRouter();
  const { user, isLoadingAuth } = useContext(AuthContext);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [presentation, setPresentation] = useState({});
  const [slides, setSlides] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [history, setHistory] = useState([]);

  const [openInputAnonymousName, setOpenInputAnonymousName] = useState(!user?.name);
  const [anonymousName, setAnonymousName] = useState("");

  const getPresentation = async () => {
    setIsLoading(true);
    try {
      const { id } = router.query;
      const res = await getPresentationDetail(id);
      const presentation = res?.data?.[0];
      const questionRes = await getQuestionList(id);
      const lst = questionRes?.data;
      setQuestionList(lst || []);
      setPresentation(presentation);
      setSlides(JSON.parse(presentation?.slides) || []);
      setHistory(presentation?.history || []);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const updatePresentationDetail = async (config = {}) => {
    try {
      const newPresentation = {
        ...presentation,
        ...config,
      };
      const res = await updatePresentation(newPresentation);
    } catch (e) {}
  };

  const [index, setIndex] = useState(0);

  const [viewIndex, setViewIndex] = useState(0);

  const [isAnswered, setIsAnswered] = useState(false);

  const PresentButton = () => (
    <Tooltip title={handle.active ? "Exit full screen" : "Go to full screen (press F11 instead)"}>
      <IconButton onClick={handle.active ? handle.exit : handle.enter} className={styles.zoomButton} color="primary">
        {handle.active ? <ZoomInMapRounded /> : <ZoomOutMapRounded />}
      </IconButton>
    </Tooltip>
  );

  useEffect(() => {
    if (router.isReady) {
      setViewIndex(+router.query.page || 0);
      setIndex(+router.query.page || 0);
      getPresentation();
    }
  }, [router.isReady]);

  useEffect(() => {
    socket.on("voted", (data) => {
      if (data?._id === presentation?._id) {
        setSlides(JSON.parse(data.slides) || []);
      }
    });

    socket.on("changeSlideIndex", (data) => {
      if (data?.presentationId === presentation?._id) {
        router.push({
          ...router,
          query: {
            id: presentation._id,
            page: data.viewIndex,
          },
        });
        setViewIndex(data.viewIndex);
        setIsAnswered(false);
      }
    });

    socket.on("startPresent", (data) => {
      if (user?._id !== presentation?.ownerId && !presentation?.collaborators?.includes(user?._id) && !presentation?.isPresent && data.presentationId === presentation?._id) router.reload();
    });

    socket.on("stopPresent", (data) => {
      if ((!user || (user?._id !== presentation?.ownerId && !presentation?.collaborators?.includes(user?._id))) && data.presentationId === presentation?._id) router.reload();
    });

    socket.on("stopPresentByUpdateGroup", (data) => {
      if (data?.find((p) => p._id === presentation?._id)) router.reload();
    });
  }, [presentation]);

  useEffect(() => {
    socket.on("sendQuestion", (data) => {
      if (data) {
        sortQuestionList([...questionList, data]);
        // setQuestionList([...questionList, data]);
      }
    });
    socket.on("updateQuestion", (data) => {
      if (data) {
        const idx = questionList.findIndex((question) => question._id === data._id);
        if (idx !== -1) {
          const tmp = [...questionList];
          tmp.splice(idx, 1, data);
          // setQuestionList([...tmp]);
          sortQuestionList(tmp);
        }
      }
    });

    socket.on("updateHistory", (newHistory) => {
      if (newHistory?.presentationId === presentation._id) {
        setHistory(newHistory.data || []);
      }
    });
  });

  const sortQuestionList = (updatedQuestionList) => {
    const tmp = [...updatedQuestionList];
    tmp.sort((a, b) => a.answered - b.answered || b.vote - a.vote);
    setQuestionList([...tmp]);
  };

  return isLoading || isLoadingAuth ? (
    <LoadingScreen />
  ) : (
    <>
      {!presentation.groupId || user?.myGroupIds?.includes(presentation.groupId) || user?.joinedGroupIds?.includes(presentation.groupId) ? (
        <>
          {user?._id && (presentation?.ownerId === user?._id || presentation?.collaborators?.includes(user?._id)) ? (
            <FullScreen handle={handle}>
              <ChatBox room={presentation?._id} owner={presentation?.ownerId} />
              <PresentButton />
              <Grid
                container
                spacing={6}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  width: "100vw",
                  height: "100vh",
                  marginLeft: 0,
                }}
              >
                <Grid item xl={8} md={7} xs={12} className={styles.presentationSlideCol}>
                  <div className={styles.buttonWrapper}>
                    {index > 0 && (
                      <Button
                        className="custom-button"
                        startIcon={<SkipPreviousIcon />}
                        variant="contained"
                        onClick={() => {
                          setIndex(index - 1);
                          socket.emit("clientChangeSlideIndex", {
                            presentationId: presentation?._id,
                            viewIndex: index - 1,
                          });
                          router.push({
                            ...router,
                            query: {
                              id: presentation._id,
                              page: index - 1,
                            },
                          });
                        }}
                      >
                        Previous
                      </Button>
                    )}
                    {index < slides.length - 1 && (
                      <Button
                        className="custom-button"
                        startIcon={<SkipNextIcon />}
                        variant="contained"
                        onClick={() => {
                          setIndex(index + 1);
                          socket.emit("clientChangeSlideIndex", {
                            presentationId: presentation?._id,
                            viewIndex: index + 1,
                          });
                          router.push({
                            ...router,
                            query: {
                              id: presentation._id,
                              page: index + 1,
                            },
                          });
                        }}
                      >
                        Next
                      </Button>
                    )}

                    <Button startIcon={<QuestionMark />} className="custom-button-outlined" variant="outlined" onClick={() => setOpenQuestion(true)}>
                      Questions
                    </Button>
                    <Button startIcon={<EventNoteIcon />} className="custom-button-outlined" variant="outlined" onClick={() => setOpenHistory(true)}>
                      Submissions
                    </Button>
                    <Button
                      startIcon={<CancelPresentationIcon />}
                      variant="outlined"
                      onClick={async () => {
                        await clearChat(presentation?._id);
                        await updatePresentationDetail({ isPresent: false });
                        socket.emit("clientStopPresent", presentation?._id);
                        router.push(`/presentation/${presentation._id}`);
                        return;
                      }}
                      color="error"
                    >
                      Stop
                    </Button>
                    <Button startIcon={<QuestionAnswerIcon />} className="custom-button" variant="contained" onClick={() => setOpenQuestion(true)}>
                      Open Question
                    </Button>
                    {history?.filter((item) => item.slideId === slides[viewIndex]?.id)?.length > 0 && (
                      <Button startIcon={<EventNoteIcon />} className="custom-button" variant="contained" onClick={() => setOpenHistory(true)}>
                        Submissions
                      </Button>
                    )}
                  </div>
                  {slides[index].type === "Multiple Choice" && (
                    <MultipleChoicePresentation width="90%" height="60vh" options={slides[index].content.options} question={slides[index].content.question} />
                  )}
                  {slides[index].type === "Heading" && <HeadingPresentation heading={slides[index].content.heading} subHeading={slides[index].content.subHeading} />}
                  {slides[index].type === "Paragraph" && <ParagraphPresentation heading={slides[index].content.heading} paragraph={slides[index].content.paragraph} />}
                </Grid>
                <Grid item xs={12} md={5} xl={4} className={styles.previewPresentationSlideCol}>
                  {index + 1 < slides.length && <h2 className={styles.previewTitle}>Preview next slide:</h2>}
                  {index + 1 < slides.length ? (
                    <>
                      {slides[index + 1].type === "Multiple Choice" && (
                        <MultipleChoicePresentation width="90%" height="60vh" options={slides[index + 1].content.options} question={slides[index + 1].content.question} />
                      )}
                      {slides[index + 1].type === "Heading" && <HeadingPresentation heading={slides[index + 1].content.heading} subHeading={slides[index + 1].content.subHeading} />}
                      {slides[index + 1].type === "Paragraph" && <ParagraphPresentation heading={slides[index + 1].content.heading} paragraph={slides[index + 1].content.paragraph} />}
                    </>
                  ) : (
                    <p style={{ textAlign: "center" }}>
                      <i>End of slideshow</i>
                    </p>
                  )}
                </Grid>
              </Grid>
            </FullScreen>
          ) : presentation?.isPresent ? (
            <FullScreen handle={handle}>
              <ChatBox room={presentation?._id} owner={presentation?.ownerId} />
              <PresentButton />
              <Tooltip title="Open box question">
                <IconButton color="primary" size="large" onClick={() => setOpenQuestion(true)}>
                  <LiveHelpIcon />
                </IconButton>
              </Tooltip>
              <div className={styles.userVoteViewWrapper}>
                {isAnswered ? (
                  <MultipleChoicePresentation options={slides[index].content.options} question={slides[index].content.question} />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "30px",
                    }}
                  >
                    {slides[viewIndex].type === "Heading" && <HeadingPresentation heading={slides[viewIndex].content.heading} subHeading={slides[viewIndex].content.subHeading} />}
                    {slides[viewIndex].type === "Paragraph" && <HeadingPresentation heading={slides[viewIndex].content.heading} paragraph={slides[viewIndex].content.paragraph} />}
                    {slides[viewIndex].type === "Multiple Choice" && (
                      <>
                        <h1>{slides[viewIndex]?.content?.question}</h1>
                        {slides[viewIndex]?.content.options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => {
                              option.data += 1;
                              const updatedPresentation = {
                                ...presentation,
                                slides: JSON.stringify(slides),
                              };
                              socket.emit("vote", updatedPresentation);
                              socket.emit("clientUpdateHistory", {
                                data: [
                                  ...history,
                                  { userName: user?.name || anonymousName || "Anonymous user", time: new Date(), option: option.label, slideIndex: viewIndex, slideId: slides[viewIndex].id },
                                ],
                                presentationId: presentation._id,
                              });
                              setIsAnswered(true);
                            }}
                            variant="contained"
                          >
                            {option.label}
                          </Button>
                        ))}

                        {!user?.name && (
                          <Dialog open={openInputAnonymousName}>
                            <form>
                              <DialogContent>
                                <DialogContentText>Please enter your name to continue</DialogContentText>
                                <TextField
                                  autoFocus
                                  margin="dense"
                                  placeholder="Enter your name"
                                  label="Your name"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  onChange={(e) => setAnonymousName(e.target.value)}
                                  required
                                />
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (anonymousName) setOpenInputAnonymousName(false);
                                  }}
                                  type="submit"
                                  variant="contained"
                                >
                                  Submit
                                </Button>
                              </DialogActions>
                            </form>
                          </Dialog>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </FullScreen>
          ) : (
            <div className={styles.userVoteViewWrapper}>
              <span>This presentation has not been started yet.</span>
            </div>
          )}
          <Drawer anchor="right" open={openHistory} onClose={() => setOpenHistory(false)}>
            <div
              style={{
                width: "30vw",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center",
                marginTop: "50px",
                padding: "20px",
              }}
            >
              <h3 style={{ textAlign: "left", width: "100%" }}>All submissions:</h3>
              <ul style={{ padding: 20 }}>
                {history
                  ?.filter((item) => item.slideId === slides[viewIndex]?.id)
                  ?.map((history) => (
                    <li key={history.time} style={{ marginBottom: 10 }}>
                      <b>{history.userName}</b> choose option <b>{history.option}</b> at <b>{new Date(history.time).toLocaleTimeString()}</b>
                    </li>
                  ))}
              </ul>
            </div>
          </Drawer>

          <Drawer anchor="right" open={openQuestion} onClose={() => setOpenQuestion(false)}>
            <div
              style={{
                width: "30vw",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                alignItems: "center",
                marginTop: "50px",
                padding: "20px",
              }}
            >
              <h3 style={{ textAlign: "left", width: "100%" }}>Questions from viewers:</h3>

              {Array.isArray(questionList) &&
                questionList.length > 0 &&
                questionList.map((question, index) => (
                  <div key={question._id} className={styles.fullWidth}>
                    {user?._id === presentation?.ownerId && (
                      <Tooltip title="Check this question answered">
                        <Checkbox
                          checked={question.answered}
                          onChange={() => {
                            const updatedQuestionList = [...questionList];
                            const res = !question.answered;
                            updatedQuestionList.splice(index, 1, {
                              ...question,
                              answered: res,
                            });
                            // setQuestionList([...updatedQuestionList]);
                            socket.emit("clientUpdateQuestion", {
                              ...question,
                              answered: res,
                            });
                            // sortQuestionList(updatedQuestionList);
                          }}
                        />
                      </Tooltip>
                    )}

                    <TextField disabled id="outlined-disabled" label={question?.userName || "Username"} defaultValue={question?.content || "question"} />
                    <IconButton
                      onClick={() => {
                        const updatedQuestionList = [...questionList];
                        const res = question.vote + 1;
                        updatedQuestionList.splice(index, 1, {
                          ...question,
                          vote: res,
                        });

                        socket.emit("clientUpdateQuestion", {
                          ...question,
                          vote: res,
                        });
                        // sortQuestionList(updatedQuestionList);
                      }}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    {question?.vote || 0}
                  </div>
                ))}

              {presentation?.ownerId !== user?._id && (
                <div style={{ width: "100%", textAlign: "left" }}>
                  <h3>Send your question:</h3>
                  <div className={styles.fullWidth}>
                    <TextField id="outlined-basic" variant="outlined" multiline maxRows={5} minRows={3} value={question} onChange={(e) => setQuestion(e.target.value)} />
                    <IconButton
                      onClick={() => {
                        socket.emit("clientSendQuestion", {
                          presentationId: presentation?._id,
                          userName: user?.name,
                          content: question,
                        });
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </div>
                </div>
              )}
            </div>
          </Drawer>
        </>
      ) : (
        <div className={styles.userVoteViewWrapper}>
          <span>You are not allowed to join this presentation.</span>
        </div>
      )}
    </>
  );
};

export default SlideShow;
