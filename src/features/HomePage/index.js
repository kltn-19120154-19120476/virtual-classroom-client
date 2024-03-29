import { MovieCreation, Settings } from "@mui/icons-material";
import DuoIcon from "@mui/icons-material/Duo";
import GroupsIcon from "@mui/icons-material/Groups";
import LineAxisIcon from "@mui/icons-material/LineAxis";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import { Button, Card, Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "src/context/authContext";
import styles from "./styles.module.scss";

const FeatureCard = ({ item }) => {
  return (
    <Card className={styles.featureItem}>
      <div className={styles.featureItemIcon}>{item.icon}</div>

      <Typography variant="h3" color="primary">
        {item.label}
      </Typography>

      <p>{item.description}</p>
    </Card>
  );
};

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  if (user) {
    router.push("/rooms");
  }

  const FEATURES = [
    {
      icon: <DuoIcon />,
      label: "Launch a meeting",
      description: "Launch a virtual class with video, audio, screen sharing, chat, and all the tools required for applied learning",
    },
    {
      icon: <MovieCreation />,
      label: "Record your meetings",
      description: "Record meetings and share them with the students",
    },
    {
      icon: <GroupsIcon />,
      label: "Manage your rooms",
      description: "Configure your rooms and meeting settings to be in charge of an effective classroom",
    },
    {
      icon: <LineAxisIcon />,
      label: "Learning dashboard",
      description: "Tracking students attendance and activities in real-time with monitoring screen and downloadable logs",
    },
    {
      icon: <PlagiarismIcon />,
      label: "Document management",
      description: "Configure, share your documents to other users and pre-upload them before the meeting is started",
    },
    {
      icon: <Settings />,
      label: "And more!",
      description:
        "BigBlueButtonLMS offers BigBlueButton's built-in tools for applied learning and is designed to save you time during class",
    },
  ];

  return (
    <Container maxWidth="xl" className={styles.homePageWrapper}>
      <Typography variant="h1" color="primary" textTransform="uppercase" letterSpacing="1px" fontWeight={600}>
        welcome to BigBlueButton LMS
      </Typography>
      <p className={styles.description}>
        BigBlueButtonLMS is a cutting-edge learning management system that brings together the power of BigBlueButton, a feature-rich web
        conferencing platform, with a comprehensive suite of educational tools. Our platform is designed to transform online learning by
        fostering collaboration and engagement in virtual classrooms.
        <br />
        <br />
        BigBlueButtonLMS offers a range of interactive features to create dynamic learning environments. With real-time audio and video
        conferencing, screen sharing, whiteboarding, breakout rooms and interactive chat, educators can deliver immersive lessons and
        facilitate meaningful discussions from BigBlueButton.
        <br />
        <br />
        Our user-friendly management interface simplifies navigation and enhances the teaching experience with integrated BigBlueButton,
        empowering educators to focus on delivering high-quality education.
        <br />
        <br />
        Join us on the journey to revolutionize online education. With BigBlueButtonLMS, collaboration, interactivity, and engagement are
        just a click away.
        <br />
        <br />
        <a href="https://bigbluebutton.org/" target="_blank" className={styles.learnMore}>
          Learn more about BigBlueButton
        </a>
      </p>

      <Link href="/register">
        <Button variant="contained" sx={{ margin: "50px auto", display: "block" }}>
          <Typography variant="h5" fontWeight={600} color="white" letterSpacing={1}>
            JOIN NOW
          </Typography>
        </Button>
      </Link>

      <div>
        <Typography variant="h2" color="primary" textTransform="uppercase" fontWeight={600} marginBottom={3}>
          our features
        </Typography>

        <Grid container spacing={2}>
          {FEATURES.map((item) => (
            <Grid item sm={6} xs={12} md={4} lg={3} key={item.label}>
              <FeatureCard item={item} />
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
};

export default HomePage;
