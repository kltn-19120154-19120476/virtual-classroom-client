import LogoutIcon from "@mui/icons-material/Logout";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import { Container } from "@mui/material";
import { useContext } from "react";
import { NoData } from "src/components/NoDataNotification";
import { AuthContext } from "src/context/authContext";

function NotfoundPage() {
  const { logout } = useContext(AuthContext);

  return (
    <Container>
      <NoData
        title="403"
        description={"Your account is not exist or be activated. Please contact your administrator."}
        icon={<NoAccountsIcon />}
        onRefresh={() => logout()}
        refreshBtnText="Logout"
        refreshBtnIcon={<LogoutIcon />}
      />
    </Container>
  );
}

export default NotfoundPage;
