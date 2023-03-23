/* eslint-disable @next/next/no-html-link-for-pages */
import Logout from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Container } from "@mui/system";
import Link from "next/link";
import React from "react";
import styles from "./styles.module.scss";

const Header = ({ logout, user }) => {
  const [anchorEllAvatar, setanchorEllAvatar] = React.useState(null);
  const openAvatar = Boolean(anchorEllAvatar);
  const handleClickAvatar = (event) => {
    setanchorEllAvatar(event.currentTarget);
  };
  const handleCloseAvatar = () => {
    setanchorEllAvatar(null);
  };
  return (
    <div className={styles.headerWrapper}>
      <Container container className={styles.content} maxWidth="xl" sx={{ display: "flex" }}>
        <div className={styles.leftContent}>
          <a href="/" className={styles.logo}>
            <img src="/images/logo.png" />
            <span>MEOW CLASSROOM</span>
          </a>
        </div>

        <div className={styles.rightContent}>
          <Avatar className={styles.avatar} aria-controls={openAvatar ? "basic-menu" : undefined} aria-haspopup="true" aria-expanded={openAvatar ? "true" : undefined} onClick={handleClickAvatar}>
            {user?.name[0]}
          </Avatar>
          <Menu
            id="basic-menu"
            anchorEl={anchorEllAvatar}
            open={openAvatar}
            onClose={handleCloseAvatar}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Link href="/profile">
              <MenuItem onClick={handleCloseAvatar}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
            </Link>
            <MenuItem
              onClick={() => {
                logout();
                handleCloseAvatar();
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Container>
    </div>
  );
};

export default Header;
