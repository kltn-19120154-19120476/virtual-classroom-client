import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PersonIcon from "@mui/icons-material/Person";

function UserAvatar(props) {
  const { user } = props;

  return user.isModerator ? <AccountBoxIcon /> : <PersonIcon />;
}

export default UserAvatar;
