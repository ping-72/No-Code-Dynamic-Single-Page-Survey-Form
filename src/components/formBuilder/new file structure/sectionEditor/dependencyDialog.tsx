// src/components/SectionEditor/DependencyDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import {
  Form,
  Question,
  Option,
  Section,
} from "../../../../interface/interface";

interface DependencyDialogProps {
  open: boolean;
  onClose: () => void;
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  section: Section;
  currentQuestionForDependency: Question | null;
}

export const DependencyDialog: React.FC<DependencyDialogProps> = ({
  open,
  onClose,
  form,
  setForm,
  section,
  currentQuestionForDependency,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [dependencyType, setDependencyType] = useState<
    "visibility" | "options"
  >("visibility");
  const [targetOptions, setTargetOptions] = useState<string[]>([]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ style: { padding: "16px" } }}
    >
      <DialogTitle style={dependencyDialogStyles.headerTitle}>
        {currentQuestionForDependency
          ? "Add Dependency"
          : "Create Dependent Question"}
      </DialogTitle>
      <DialogContent>
        {selectedSectionId && selectedQuestionId && (
          <div style={dependencyDialogStyles.selectedDependency}>
            <Typography variant="subtitle2">Selected Dependency:</Typography>
            <Typography>
              Section:{" "}
              {
                form.sections.find((s) => s.SectionId === selectedSectionId)
                  ?.sectionTitle
              }
            </Typography>
            <Typography>
              Question:{" "}
              {
                form.sections
                  .find((s) => s.SectionId === selectedSectionId)
                  ?.question.find((q) => q.questionId === selectedQuestionId)
                  ?.questionText
              }
            </Typography>
          </div>
        )}

        {!currentQuestionForDependency && (
          <div style={dependencyDialogStyles.section}>
            <Typography variant="subtitle2" gutterBottom>
              1. Select Question Type
            </Typography>
            <FormControl fullWidth>
              <InputLabel>New Question Type</InputLabel>
              <Select
                value={newQuestionType}
                onChange={(e) => setNewQuestionType(e.target.value as string)}
              >
                <MenuItem value="single-select">Single Select</MenuItem>
                <MenuItem value="multi-select">Multi Select</MenuItem>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="integer">Integer</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}

        <div style={dependencyDialogStyles.section}>
          <Typography variant="subtitle2" gutterBottom>
            {currentQuestionForDependency ? "1" : "2"}. Configure Dependency
          </Typography>
          <FormControl fullWidth style={{ marginBottom: "16px" }}>
            <InputLabel>Select Section</InputLabel>
            <Select
              value={selectedSectionId}
              onChange={(e) => {
                setSelectedSectionId(e.target.value as string);
                setSelectedQuestionId("");
              }}
            >
              {form.sections
                .filter((sec) => {
                  const currentSection = form.sections.find(
                    (s) => s.SectionId === selectedSectionId
                  );
                  return currentSection
                    ? sec.order < currentSection.order
                    : true;
                })
                .map((sec) => (
                  <MenuItem key={sec.SectionId} value={sec.SectionId}>
                    {sec.sectionTitle}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {selectedSectionId && (
            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel>Select Question</InputLabel>
              <Select
                value={selectedQuestionId}
                onChange={(e) =>
                  setSelectedQuestionId(e.target.value as string)
                }
              >
                {form.sections
                  .find((sec) => sec.SectionId === selectedSectionId)
                  ?.question.filter((q) =>
                    ["single-select", "integer", "number"].includes(q.type)
                  )
                  .map((q) => (
                    <MenuItem key={q.questionId} value={q.questionId}>
                      {q.questionText}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}

          {selectedQuestionId && (
            <>
              {form.sections
                .find((sec) => sec.SectionId === selectedSectionId)
                ?.question.find((q) => q.questionId === selectedQuestionId)
                ?.type === "single-select" ? (
                <FormControl fullWidth style={{ marginBottom: "16px" }}>
                  <InputLabel>Expected Answer</InputLabel>
                  <Select
                    value={expectedAnswer}
                    onChange={(e) =>
                      setExpectedAnswer(e.target.value as string)
                    }
                  >
                    {getSelectedQuestionOptions().map((option) => (
                      <MenuItem key={option.optionId} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="textSecondary">
                    Select the option that will trigger this dependency
                  </Typography>
                </FormControl>
              ) : (
                <TextField
                  label="Expected Answer"
                  fullWidth
                  value={expectedAnswer}
                  onChange={(e) => setExpectedAnswer(e.target.value)}
                  style={{ marginBottom: "16px" }}
                  helperText="Enter a numeric value"
                  type="number"
                />
              )}
            </>
          )}
        </div>

        {dependencyType === "options" &&
          currentQuestionForDependency?.type === "single-select" && (
            <div style={dependencyDialogStyles.section}>
              <Typography variant="subtitle2" gutterBottom>
                {currentQuestionForDependency ? "2" : "3"}. Configure Options
              </Typography>
              {currentQuestionForDependency.options.map((option) => (
                <FormControlLabel
                  key={option.optionId}
                  control={
                    <Checkbox
                      checked={targetOptions.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTargetOptions([...targetOptions, option.value]);
                        } else {
                          setTargetOptions(
                            targetOptions.filter((opt) => opt !== option.value)
                          );
                        }
                      }}
                    />
                  }
                  label={option.value}
                />
              ))}
            </div>
          )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            resetDependencyStates();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (currentQuestionForDependency) {
              handleAddDependency();
            } else {
              handleAddQuestionWithDependency();
            }
          }}
          color="primary"
          disabled={
            !selectedQuestionId ||
            !expectedAnswer ||
            (dependencyType === "options" && targetOptions.length === 0)
          }
        >
          {currentQuestionForDependency ? "Add Dependency" : "Create Question"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
