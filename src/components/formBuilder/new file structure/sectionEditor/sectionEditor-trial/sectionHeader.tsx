import React from "react";
import { Delete } from "@material-ui/icons";
import { useStyles } from "../../../formbuilderStyle";
import { Button, TextField, Typography, Box } from "@material-ui/core";
import { Section } from "../../../../../interface/interface";

interface SectionHeaderProps {
  section: Section;
  handleUpdateSectionTitle: (sectionId: string, title: string) => void;
  handleDeleteSection: (sectionId: string) => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  section,
  handleUpdateSectionTitle,
  handleDeleteSection,
}) => {
  const classes = useStyles();
  const isFormInfoSection = section.type === "form-info";

  return (
    <Box className={classes.sectionHeader}>
      <Box style={{ display: "flex", alignItems: "center", flex: 1 }}>
        {isFormInfoSection ? (
          <Typography variant="h6" className={classes.sectionTitle}>
            Form Information
          </Typography>
        ) : (
          <TextField
            label="Section Title"
            value={section.sectionTitle}
            onChange={(e) =>
              handleUpdateSectionTitle(section.SectionId, e.target.value)
            }
            fullWidth
            className={classes.sectionTitleInput}
          />
        )}
      </Box>
      {!isFormInfoSection && (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Delete />}
          onClick={() => handleDeleteSection(section.SectionId)}
        >
          Delete Section
        </Button>
      )}
    </Box>
  );
};
