import React from "react";
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import { useStyles } from "../formbuilderStyle";

export const HeaderBar: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" elevation={0} className={classes.headerBar}>
      <Toolbar className={classes.toolBar}>
        <Typography variant="h1" className={classes.headerTitle}>
          Form Builder
        </Typography>
        <div className={classes.headerButtons}>
          <Button variant="contained" className={classes.previewButton}>
            Preview
          </Button>
          <Button variant="contained" className={classes.saveButton}>
            Save
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};
