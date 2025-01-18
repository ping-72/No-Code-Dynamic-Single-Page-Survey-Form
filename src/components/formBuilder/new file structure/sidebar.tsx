import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Typography,
} from "@material-ui/core";
import { ArrowDownward } from "@material-ui/icons";
import { useStyles } from "../formbuilderStyle";
import { Section } from "../../../interface/interface";

interface SidebarProps {
  sections: Section[];
  activeSection: number;
  setActiveSection: (index: number) => void;
  handleAddSection: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSection,
  setActiveSection,
  handleAddSection,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.sidebar}>
      <Typography variant="subtitle1" className={classes.sidebarTitle}>
        Form Sections
      </Typography>
      <List disablePadding>
        {sections.map((section, index) => (
          <ListItem
            key={section.SectionId}
            className={`${classes.listItem} ${
              activeSection === index ? classes.activeListItem : ""
            }`}
            onClick={() => setActiveSection(index)}
          >
            <ListItemText
              primary={section.sectionTitle || "Untitled"}
              style={{
                color: activeSection === index ? "#fff" : "inherit",
              }}
            />
            <div className="MoveIcons">
              <IconButton
                className={classes.moveIcon}
                style={{
                  color: activeSection === index ? "#fff" : "inherit",
                }}
                title="Move Section"
              >
                <ArrowDownward fontSize="small" />
                <ArrowDownward
                  fontSize="small"
                  style={{ transform: "rotate(180deg)", margin: "2px" }}
                />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        className={classes.addSectionBtn}
        onClick={handleAddSection}
      >
        Add Section
      </Button>
    </div>
  );
};
