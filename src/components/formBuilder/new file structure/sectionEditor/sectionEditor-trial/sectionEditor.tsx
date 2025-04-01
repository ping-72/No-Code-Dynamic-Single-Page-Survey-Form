import React, { useEffect } from "react";
import { Paper, TextField, Box } from "@material-ui/core";
import { useStyles } from "../../../formbuilderStyle";
import { Section, Form } from "../../../../../interface/interface";
import { SectionHeader } from "./sectionHeader";
import { QuestionEditor } from "./QuestionEditor/questionEditor";

interface SectionEditorProps {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  section: Section;
  handleDeleteSection: (sectionId: string) => void;
  handleUpdateSectionTitle: (sectionId: string, title: string) => void;
  handleUpdateSectionDescription: (sectionId: string, desc: string) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  form,
  setForm,
  section,
  handleDeleteSection,
  handleUpdateSectionTitle,
  handleUpdateSectionDescription,
}) => {
  const classes = useStyles();

  useEffect(() => {
    console.log("Active section is ", section);
  }, []);

  return (
    <Paper elevation={3} className={classes.sectionPaper}>
      <SectionHeader
        section={section}
        handleUpdateSectionTitle={handleUpdateSectionTitle}
        handleDeleteSection={handleDeleteSection}
      />
      <br />
      <br />

      <Box>
        <TextField
          label="Section Description"
          fullWidth
          value={section.description || ""}
          margin="normal"
          onChange={(e) =>
            handleUpdateSectionDescription(section.SectionId, e.target.value)
          }
          multiline
        />
        <QuestionEditor form={form} setForm={setForm} section={section} />
        <br />
      </Box>
    </Paper>
  );
};
