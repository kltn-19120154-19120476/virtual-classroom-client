import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Button, Container } from "@mui/material";
import { NoData } from "src/components/NoDataNotification";

function NotfoundPage() {
  return (
    <Container>
      <NoData
        title="404"
        description="The page you were looking for does not exist."
        icon={<SearchOffIcon />}
        refreshButton={
          <Button variant="contained" onClick={() => (window.location.href = "/")}>
            Back to home screen
          </Button>
        }
      />
    </Container>
  );
}

export default NotfoundPage;
