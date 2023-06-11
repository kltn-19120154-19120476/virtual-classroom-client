import { Card, IconButton } from "@mui/material";
import styles from "./styles.module.scss";

export const NoData = ({ icon, title, description, refreshButton = null }) => (
  <Card className={styles.noRecordWrapper}>
    <IconButton className={styles.camIcon} color="primary">
      {icon}
    </IconButton>
    <h2>{title}</h2>

    <p>{description}</p>

    {refreshButton}
  </Card>
);
