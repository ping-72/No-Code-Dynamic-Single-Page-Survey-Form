import React from "react";
import {
  Avatar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import styles from "./DashboardHeader.module.css";
import { useAuth } from "../../authentication/context/AuthContext";
// import { useAuth } from "../authentication/context/AuthContext";

const DashboardHeader: React.FC = () => {
  // Assume your Auth context provides the current user and a signOut function.
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Function to generate a consistent color based on the user's name
  const getAvatarColor = (name: string) => {
    const colors = [
      "#1976d2", // Blue
      "#2e7d32", // Green
      "#d32f2f", // Red
      "#ed6c66", // Pink
      "#9c27b0", // Purple
      "#ff9800", // Orange
      "#795548", // Brown
      "#607d8b", // Blue Grey
      "#009688", // Teal
      "#673ab7", // Deep Purple
    ];

    const index =
      name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  // Function to get the first letter of the first name
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleClose();
    signOut();
  };

  const userName = user?.name || "User";
  const avatarColor = getAvatarColor(userName);
  const initials = getInitials(userName);

  return (
    <header className={styles.header}>
      <Box className={styles.headerContent}>
        <Box className={styles.logoSection}>
          <Typography variant="h6" className={styles.logo}>
            Form Builder
          </Typography>
        </Box>

        <Box className={styles.userSection}>
          <Box className={styles.userInfo}>
            <Typography variant="body1" className={styles.userName}>
              {userName}
            </Typography>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenu}
                className={styles.avatarButton}
                size="small"
              >
                <Avatar
                  alt={userName}
                  src={user?.photo || ""}
                  className={styles.avatar}
                  style={{
                    backgroundColor: !user?.photo ? avatarColor : undefined,
                  }}
                >
                  {!user?.photo && initials}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className={styles.menu}
          >
            <MenuItem onClick={handleClose} className={styles.menuItem}>
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleClose} className={styles.menuItem}>
              <SettingsIcon className={styles.menuIcon} />
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut} className={styles.menuItem}>
              <ExitToAppIcon className={styles.menuIcon} />
              <Typography variant="body2">Sign Out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </header>
  );
};

export default DashboardHeader;
