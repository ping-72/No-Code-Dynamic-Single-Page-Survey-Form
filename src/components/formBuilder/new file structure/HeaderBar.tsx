import React from "react";
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import { useStyles } from "../formbuilderStyle";

interface HeaderBarProps {
  onPreview: () => void;
  onSave: () => void;
  onViewResponse: () => void;
  isSaving?: boolean;
  isExistingForm?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onPreview,
  onSave,
  isSaving = false,
  isExistingForm = false,
}) => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" elevation={0} className={classes.headerBar}>
      <Toolbar className={classes.toolBar}>
        <Typography variant="h1" className={classes.headerTitle}>
          Form Builder
        </Typography>
        <div className={classes.headerButtons}>
          <Button
            variant="contained"
            className={classes.previewButton}
            onClick={onPreview}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            className={classes.saveButton}
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : isExistingForm ? "Update" : "Save"}
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};
