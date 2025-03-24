import React from "react";
import { Avatar, IconButton } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import styles from "./DashboardHeader.module.css";
import { useAuth } from "../../authentication/context/AuthContext";
// import { useAuth } from "../authentication/context/AuthContext";

const DashboardHeader: React.FC = () => {
  // Assume your Auth context provides the current user and a signOut function.
  const { user, signOut } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <Avatar
          alt={user?.name || "User"}
          src={user?.photo || ""}
          className={styles.avatar}
        />
        <span className={styles.userName}>{user?.name || "User"}</span>
      </div>
      <div className={styles.actions}>
        <IconButton onClick={signOut} className={styles.logoutButton}>
          <ExitToAppIcon />
        </IconButton>
      </div>
    </header>
  );
};

export default DashboardHeader;
