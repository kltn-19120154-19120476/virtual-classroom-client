import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Container } from "@mui/material";
import { NoData } from "src/components/NoDataNotification";

function NotfoundPage() {
  return (
    <Container>
      <NoData
        title="404"
        description="The page you were looking for does not exist."
        icon={<SearchOffIcon />}
        onRefresh={() => (window.location.href = "/")}
      />
    </Container>
  );
}

export default NotfoundPage;
