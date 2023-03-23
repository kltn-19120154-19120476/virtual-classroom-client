import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import GroupsIcon from "@mui/icons-material/Groups";
import ShareIcon from "@mui/icons-material/Share";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { Button, Card, Container, Dialog, DialogActions, DialogTitle, Drawer, FormControl, Grid, IconButton, Select, TextField } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { deletePresentation, getPresentationDetail, updatePresentation } from "../../../client/presentation";
import Breadcrumb from "../../../components/Breadcrumb";
import Heading from "../../../components/Presentation/Heading";
import MultipleChoice from "../../../components/Presentation/MultipleChoice";
import Paragraph from "../../../components/Presentation/Paragraph";
import { AuthContext } from "../../../context/authContext";
import { SocketContext } from "../../../context/socketContext";
import { customToast } from "../../../utils";
import styles from "./styles.module.scss";
import LoadingScreen from "../../../components/LoadingScreen";

const PresentationItem = (props) => {
  const { presentType, ...rest } = props;
  if (presentType === "Multiple Choice") {
    return <MultipleChoice {...rest} />;
  }
  if (presentType === "Heading") {
    return <Heading {...rest} />;
  }
  return <Paragraph {...rest} />;
};

const PresentationDetail = ({ id }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const [presentation, setPresentation] = useState({});
  const [slides, setSlides] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [openHistory, setOpenHistory] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getPresentation = async () => {
    try {
      setLoading(true);
      const presentationRes = await getPresentationDetail(id);
      const presentation = presentationRes?.data?.[0];

      if (presentation.ownerId !== user?._id && !presentation.collaborators?.includes(user?._id)) {
        window.location.href = "/";
        return;
      }

      setPresentation(presentation);
      setSlides(JSON.parse(presentation?.slides) || null);
      setLoading(false);
    } catch (e) {
      window.location.href = "/";
    }
  };

  const updatePresentationDetail = async (config = {}) => {
    try {
      const newPresentation = {
        ...presentation,
        slides: JSON.stringify(slides),
        ...config,
      };
      await updatePresentation(newPresentation);
    } catch (e) {}
  };

  useEffect(() => {
    updatePresentationDetail();
  }, [slides]);

  useEffect(() => {
    getPresentation();
  }, []);

  const handleRemovePresentation = async (id) => {
    try {
      const res = await deletePresentation(id);
      if (res?.status === "OK") {
        await customToast("SUCCESS", `Delete presentation ${presentation?.name} successfully!`);
      } else {
        await customToast("ERROR", res?.message);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
    }
    window.location.href = "/presentation";
  };

  const handleAssignGroup = async (e) => {
    try {
      const groupId = e.target.value;
      const otherPresentations = user?.myPresentations?.filter((p) => p._id !== presentation._id && p.groupId === groupId) || [];
      await Promise.all(otherPresentations?.map((p) => updatePresentation({ ...p, groupId: "", isPresent: false })));

      socket.emit("clientStopPresentByUpdateGroup", otherPresentations);

      const res = await updatePresentation({ ...presentation, groupId });

      if (res?.status === "OK") {
        setPresentation({
          ...presentation,
          groupId,
        });
        if (groupId) {
          await customToast("SUCCESS", `Assign group to ${presentation.name} successfully!`);
        } else {
          await customToast("SUCCESS", `Presentation ${presentation.name} is public now`);
        }
      } else {
        await customToast("ERROR", res?.message);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
    }
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
        <DialogTitle id="alert-dialog-title">Please confirm to delete this presentation</DialogTitle>
        <DialogActions>
          <Button className="custom-button-outlined" variant="outlined" onClick={() => setOpenConfirmDelete(false)}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={() => handleRemovePresentation(presentation?._id)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Breadcrumb
        paths={[
          { label: "Home", href: "/" },
          { label: "Presentation", href: "/presentation" },
          { label: presentation?.name, href: `/presentation/${id}` },
        ]}
      />
      {slides ? (
        <Container className={styles.wrapper}>
          <Grid container spacing={3}>
            <Grid container item xs={12}>
              <Grid item xs={12} md={4}>
                <h1>{presentation?.name}</h1>
                <FormControl fullWidth sx={{ marginTop: 2 }}>
                  <h4 style={{ marginBottom: 10 }}>Assign to your group</h4>
                  <Select displayEmpty onChange={handleAssignGroup} value={presentation?.groupId || ""}>
                    <MenuItem value={""} key="public">
                      None
                    </MenuItem>
                    {user?.myGroups?.map((group) => (
                      <MenuItem value={group._id} key={group._id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8} className={styles.buttonGroup}>
                {user?._id === presentation?.ownerId && (
                  <Link href={`/presentation/${id}/collaboration`}>
                    <Button className="custom-button-outlined" sx={{ margin: "10px 0 10px 20px" }} variant="outlined">
                      <GroupsIcon />
                      &nbsp;Manage collaborators
                    </Button>
                  </Link>
                )}
                <CopyToClipboard text={`${window?.location?.href}/slideshow`} onCopy={async () => await customToast("SUCCESS", "Presentation link copied!")}>
                  <Button className="custom-button-outlined" sx={{ margin: "10px 0 10px 20px" }} variant="outlined">
                    <ShareIcon />
                    &nbsp;Share
                  </Button>
                </CopyToClipboard>
                <Button
                  className="custom-button"
                  sx={{ margin: "10px 0 10px 20px" }}
                  variant="contained"
                  onClick={async () => {
                    await updatePresentationDetail({ isPresent: true });
                    socket.emit("clientStartPresent", {
                      presentationId: presentation?._id,
                      groupId: presentation?.groupId,
                      presentationName: presentation?.name,
                    });
                    router.push(`/presentation/${id}/slideshow`);
                  }}
                >
                  <SlideshowIcon />
                  &nbsp;Present
                </Button>
                {user?._id === presentation?.ownerId && (
                  <Button
                    sx={{ margin: "10px 0 10px 20px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenConfirmDelete(true);
                    }}
                    startIcon={<DeleteIcon />}
                    color="error"
                    variant="outlined"
                  >
                    Delete
                  </Button>
                )}
              </Grid>
            </Grid>

            <Grid container item xs={12}>
              <div>
                <Button
                  sx={{ marginBottom: 1 }}
                  className="custom-button"
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  variant="contained"
                >
                  <AddIcon />
                  &nbsp;New Slide
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      const newSlides = [
                        ...slides,
                        {
                          id: uuidv4(),
                          type: "Multiple Choice",
                          content: {
                            question: "Your question",
                            options: [
                              {
                                label: "Option 1",
                                data: 0,
                              },
                              {
                                label: "Option 2",
                                data: 0,
                              },
                            ],
                          },
                        },
                      ];
                      setSlides(newSlides);
                      handleClose();
                    }}
                  >
                    Multiple Choice
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      const newSlides = [
                        ...slides,
                        {
                          id: uuidv4(),
                          type: "Heading",
                          content: {
                            heading: "This is heading",
                            subHeading: "This is sub heading",
                          },
                        },
                      ];
                      setSlides(newSlides);
                      handleClose();
                    }}
                  >
                    Heading
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      const newSlides = [
                        ...slides,
                        {
                          id: uuidv4(),
                          type: "Paragraph",
                          content: {
                            heading: "This is heading",
                            paragraph: "This is paragraph",
                          },
                        },
                      ];
                      setSlides(newSlides);
                      handleClose();
                    }}
                  >
                    Paragraph
                  </MenuItem>
                </Menu>
              </div>
            </Grid>

            <Grid container item xs={12} spacing={3}>
              <Grid item md={2} container spacing={2}>
                <div className={styles.slidesList}>
                  {slides.map((slide, index) => (
                    <Grid item xs={12} key={index} className={clsx(styles.slideItem, index === selectedSlide && styles.selected)}>
                      <span className={styles.index}>{index}</span>

                      <Card onClick={() => setSelectedSlide(index)} class={styles.previewSlideItem}>
                        <PresentationItem presentType={slides[index].type} {...slides[index].content} type="preview" />
                      </Card>
                      <IconButton
                        className={styles.deleteButton}
                        onClick={() => {
                          if (index === selectedSlide) {
                            const idx = index > 0 ? index - 1 : 0;
                            setSelectedSlide(idx);
                          }
                          const tmp = [...slides];
                          tmp.splice(index, 1);
                          setSlides([...tmp]);
                        }}
                        variant="contained"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  ))}
                </div>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <div className={styles.previewSlide}>{slides.length ? <PresentationItem presentType={slides[selectedSlide].type} {...slides[selectedSlide].content} /> : <h2>Empty slide</h2>}</div>
              </Grid>
              {slides.length ? (
                <Grid item md={4} sm={12} container className={styles.content}>
                  <div>
                    <h3>Edit your slide</h3>
                    {presentation?.history?.filter((item) => item.slideId === slides[selectedSlide]?.id)?.length > 0 && (
                      <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => setOpenHistory(true)} className="custom-button">
                        View submissions
                      </Button>
                    )}
                    <div item xs={12}>
                      {slides[selectedSlide].type === "Multiple Choice" ? (
                        <TextField
                          label="Your question"
                          placeholder="Type your question"
                          fullWidth
                          style={{ marginTop: "30px" }}
                          value={slides[selectedSlide].content.question}
                          onChange={(e) => {
                            const replaceSlide = {
                              ...slides[selectedSlide],
                              content: {
                                ...slides[selectedSlide].content,
                                question: e.target.value,
                              },
                            };
                            const tmp = [...slides];
                            tmp.splice(selectedSlide, 1, replaceSlide);
                            setSlides([...tmp]);
                          }}
                        />
                      ) : (
                        <TextField
                          label="Heading"
                          placeholder="Heading"
                          fullWidth
                          style={{ marginTop: "30px" }}
                          value={slides[selectedSlide].content.heading}
                          onChange={(e) => {
                            const replaceSlide = {
                              ...slides[selectedSlide],
                              content: {
                                ...slides[selectedSlide].content,
                                heading: e.target.value,
                              },
                            };
                            const tmp = [...slides];
                            tmp.splice(selectedSlide, 1, replaceSlide);
                            setSlides([...tmp]);
                          }}
                        />
                      )}
                      {slides[selectedSlide].type === "Heading" && (
                        <TextField
                          label="Sub Heading"
                          placeholder="Sub Heading"
                          fullWidth
                          style={{ marginTop: "30px" }}
                          value={slides[selectedSlide].content.subHeading}
                          onChange={(e) => {
                            const replaceSlide = {
                              ...slides[selectedSlide],
                              content: {
                                ...slides[selectedSlide].content,
                                subHeading: e.target.value,
                              },
                            };
                            const tmp = [...slides];
                            tmp.splice(selectedSlide, 1, replaceSlide);
                            setSlides([...tmp]);
                          }}
                        />
                      )}
                      {slides[selectedSlide].type === "Paragraph" && (
                        <TextField
                          label="Paragraph"
                          placeholder="Paragraph"
                          fullWidth
                          style={{ marginTop: "30px" }}
                          value={slides[selectedSlide].content.paragraph}
                          onChange={(e) => {
                            const replaceSlide = {
                              ...slides[selectedSlide],
                              content: {
                                ...slides[selectedSlide].content,
                                paragraph: e.target.value,
                              },
                            };
                            const tmp = [...slides];
                            tmp.splice(selectedSlide, 1, replaceSlide);
                            setSlides([...tmp]);
                          }}
                        />
                      )}
                      {slides[selectedSlide].type === "Multiple Choice" &&
                        slides[selectedSlide].content.options.length > 0 &&
                        slides[selectedSlide].content.options.map((option, index) => (
                          <div key={index}>
                            <TextField
                              label="Option 1"
                              placeholder="Type option 1"
                              fullWidth
                              style={{ marginTop: "30px" }}
                              value={slides[selectedSlide].content.options[index].label}
                              onChange={(e) => {
                                // full code to control option in slides state
                                const newOptions = [...slides[selectedSlide].content.options];
                                newOptions.splice(index, 1, {
                                  ...newOptions[index],
                                  label: e.target.value,
                                });
                                const replaceSlide = {
                                  ...slides[selectedSlide],
                                  content: {
                                    ...slides[selectedSlide].content,
                                    options: [...newOptions],
                                  },
                                };
                                const tmp = [...slides];
                                tmp.splice(selectedSlide, 1, replaceSlide);
                                setSlides([...tmp]);
                              }}
                            />
                            <Button
                              sx={{ marginTop: 1 }}
                              className="custom-button"
                              variant="contained"
                              size="small"
                              onClick={() => {
                                const newOptions = [...slides[selectedSlide].content.options];
                                newOptions.splice(index, 1);
                                const replaceSlide = {
                                  ...slides[selectedSlide],
                                  content: {
                                    ...slides[selectedSlide].content,
                                    options: [...newOptions],
                                  },
                                };
                                const tmp = [...slides];
                                tmp.splice(selectedSlide, 1, replaceSlide);
                                setSlides([...tmp]);
                              }}
                            >
                              <DeleteIcon style={{ fontSize: "18px" }} />
                              &nbsp;Delete option {index + 1}
                            </Button>
                          </div>
                        ))}
                    </div>
                    {slides[selectedSlide].type === "Multiple Choice" && (
                      <Button
                        className="custom-button"
                        startIcon={<AddIcon />}
                        variant="contained"
                        style={{ marginTop: "30px" }}
                        onClick={() => {
                          const newOptions = [...slides[selectedSlide].content.options];
                          newOptions.push({
                            label: `Option ${newOptions.length + 1}`,
                            data: 0,
                          });
                          const replaceSlide = {
                            ...slides[selectedSlide],
                            content: {
                              ...slides[selectedSlide].content,
                              options: [...newOptions],
                            },
                          };
                          const tmp = [...slides];
                          tmp.splice(selectedSlide, 1, replaceSlide);
                          setSlides([...tmp]);
                        }}
                      >
                        Add option
                      </Button>
                    )}
                  </div>
                </Grid>
              ) : null}
            </Grid>
          </Grid>

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
                {presentation?.history
                  ?.filter((item) => item.slideId === slides[selectedSlide]?.id)
                  ?.map((history) => (
                    <li key={history.time} style={{ marginBottom: 10 }}>
                      <b>{history.userName}</b> choose option <b>{history.option}</b> at <b>{new Date(history.time).toLocaleTimeString()}</b>
                    </li>
                  ))}
              </ul>
            </div>
          </Drawer>
        </Container>
      ) : (
        <p style={{ textAlign: "center" }}>This pesentation cannot be found</p>
      )}
    </>
  );
};

export default PresentationDetail;
