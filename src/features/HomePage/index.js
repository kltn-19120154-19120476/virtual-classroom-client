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
      description: "Record the BigBlueButton meetings and share them with the students to review and reflect on the material.",
    },
    {
      icon: <GroupsIcon />,
      label: "Manage your rooms",
      description: "Configure your rooms and meeting settings to be in charge of an effective classroom",
    },
    {
      icon: <LineAxisIcon />,
      label: "Real-time learning dashboard",
      description:
        "Experience the convenience and efficiency of BigBlueButton's learning dashboard, a centralized hub that empowers educators and learners with easy access to course materials, progress tracking, and collaboration tools.",
    },
    {
      icon: <PlagiarismIcon />,
      label: "Document management",
      description: "Configure, share your documents to other users and pre-upload them before the meeting starts",
    },
    {
      icon: <Settings />,
      label: "And more!",
      description: "BigBlueButton offers built-in tools for applied learning and is designed to save you time during class",
    },
  ];

  return (
    <Container maxWidth="xl">
      <Typography variant="h1" color="primary" textTransform="uppercase" fontSize="4rem" letterSpacing="1px" fontWeight={600}>
        welcome to BigBlueButton LMS
      </Typography>
      <p className={styles.description}>
        BigBlueButtonLMS is a cutting-edge learning management system that brings together the power of BigBlueButton, a feature-rich web
        conferencing platform, with a comprehensive suite of educational tools. Our platform is designed to transform online learning by
        fostering collaboration and engagement in virtual classrooms.
        <br />
        <br />
        BigBlueButtonLMS offers a range of interactive features to create dynamic learning environments. With real-time audio and video
        conferencing, screen sharing, whiteboarding, and interactive chat, educators can deliver immersive lessons and facilitate meaningful
        discussions. Breakout rooms enable collaborative activities and projects, promoting teamwork and critical thinking.
        <br />
        <br />
        Seamless integration with other learning management systems allows for a smooth transition and easy management of content, grades,
        and enrollment. Our user-friendly interface simplifies navigation and enhances the teaching experience, empowering educators to
        focus on delivering high-quality education.
        <br />
        <br />
        Join us on the journey to revolutionize online education. With BigBlueButtonLMS, collaboration, interactivity, and engagement are
        just a click away.
      </p>

      <Link href="/register">
        <Button variant="contained" sx={{ mt: 4 }}>
          <Typography variant="h4" fontWeight={600} color="white" letterSpacing={1}>
            JOIN NOW
          </Typography>
        </Button>
      </Link>

      <a href="https://bigbluebutton.org/" target="_blank">
        <Typography color={"primary"} className={styles.learnMore} marginTop={3}>
          Learn more about BigBlueButton
        </Typography>
      </a>

      <div>
        <Typography variant="h1" color="primary" textTransform="uppercase" fontSize="3rem" fontWeight={600} marginTop={6} marginBottom={3}>
          our features
        </Typography>

        <Grid container spacing={2}>
          {FEATURES.map((item) => (
            <Grid item sm={12} xs={6} md={4} lg={3} key={item.label}>
              <FeatureCard item={item} />
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
};

export default HomePage;
