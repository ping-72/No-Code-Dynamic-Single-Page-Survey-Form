import React from "react";
import { TextField, Button } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useStyles } from "./styles";
// import { TextField, Button } from "@material-ui/core";

import { Section } from "../../../../../interface/interface";

interface SectionHeaderProps {
  section: Section;
  handleDeleteSection: (sectionId: string) => void;
  handleUpdateSectionTitle: (sectionId: string, title: string) => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  section,
  handleDeleteSection,
  handleUpdateSectionTitle,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.sectionHeader}>
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        <TextField
          label="Section Title"
          variant="outlined"
          value={section.sectionTitle}
          onChange={(e) =>
            handleUpdateSectionTitle(section.SectionId, e.target.value)
          }
          fullWidth
          className={classes.sectionTitleInput}
        />
      </div>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<Delete />}
        onClick={() => handleDeleteSection(section.SectionId)}
      >
        Section
      </Button>
    </div>
  );
};

export default SectionHeader;
