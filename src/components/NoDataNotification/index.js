import { Cached } from "@mui/icons-material";
import { Button, Card, IconButton } from "@mui/material";
import styles from "./styles.module.scss";

export const NoData = ({ icon, title, description, onRefresh = null }) => (
  <Card className={styles.noRecordWrapper}>
    <IconButton className={styles.camIcon} color="primary">
      {icon}
    </IconButton>
    <h2>{title}</h2>

    <p>{description}</p>
    {onRefresh && (
      <Button startIcon={<Cached />} onClick={() => onRefresh()} variant="contained">
        Refresh
      </Button>
    )}
  </Card>
);
