import VideocamIcon from "@mui/icons-material/Videocam";
import { Card, IconButton } from "@mui/material";
import { withLogin } from "src/components/HOC/withLogin";
import styles from "./styles.module.scss";

const RecordingsPage = ({ user }) => {
  return (
    <Card className={styles.noRecordWrapper}>
      <IconButton className={styles.camIcon} color="primary">
        <VideocamIcon />
      </IconButton>
      <h2>You don&apos;t have any recordings yet!</h2>

      <p>Recordings will appear here after you start a meeting and record it.</p>
    </Card>
  );
};

export default withLogin(RecordingsPage);
