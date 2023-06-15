import TerminalIcon from "@mui/icons-material/Terminal";
import { Container } from "@mui/material";
import withLogin from "src/components/HOC/withLogin";
import { NoData } from "src/components/NoDataNotification";

function DocumentPage({ user }) {
  return (
    <Container>
      <NoData title="This page is under development" description="" icon={<TerminalIcon />} />
    </Container>
  );
}

export default withLogin(DocumentPage);
