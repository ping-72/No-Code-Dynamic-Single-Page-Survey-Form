// src/components/SectionEditor.tsx

import React, { useState } from "react";
import { Delete, Add } from "@material-ui/icons";
import { useStyles } from "../formbuilderStyle";
import { DependencyDialog } from "./sectionEditor/dependencyDialog";
import {
  DependencyCondition,
  Form,
  Section,
  Question,
  Option,
  QuestionType,
} from "../../../interface/interface";
import {
  Paper,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Radio,
  Checkbox,
  Typography,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { QuestionController } from "../formController/QuestionController";
import { OptionController } from "../formController/OptionController";

interface SectionEditorProps {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  section: Section;
  responses: Record<string, string>;
  handleDeleteSection: (sectionId: string) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  form,
  setForm,
  section,
  responses,
  handleDeleteSection,
}) => {
  const classes = useStyles();

  // State for managing dependency dialog
  const [dependencyDialogOpen, setDependencyDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Styles
  const questionStyles = {
    independent: {
      backgroundColor: "#f5f7fa",
      border: "1px solid #e0e0e0",
      borderLeft: "4px solid #4caf50", // green border for independent questions
      padding: "16px",
      marginBottom: "16px",
      borderRadius: "4px",
    },
    dependent: {
      backgroundColor: "#f3f7fa",
      border: "1px solid #e0e0e0",
      borderLeft: "4px solid #2196f3", // blue border for dependent questions
      padding: "16px",
      marginBottom: "16px",
      borderRadius: "4px",
    },
    questionBadge: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.75rem",
      fontWeight: 500,
      marginBottom: "8px",
      display: "inline-block",
    },
    independentBadge: {
      backgroundColor: "#4caf50",
      color: "white",
    },
    dependentBadge: {
      backgroundColor: "#2196f3",
      color: "white",
    },
  };

  // Open dependency dialog for creating a dependent question
  const openDependencyDialog = () => {
    setDependencyDialogOpen(true);
  };

  // Close dependency dialog
  const closeDependencyDialog = () => {
    setDependencyDialogOpen(false);
  };

  // Handle creating a new dependent question
  const handleCreateDependentQuestion = (
    dependency: DependencyCondition,
    questionType: QuestionType
  ) => {
    try {
      const updatedForm = QuestionController.addQuestion(
        form,
        section.SectionId,
        [dependency]
      );

      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Dependent question added successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Error adding dependent question: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle updating question title
  const handleUpdateQuestionTitle = (
    questionId: string,
    questionText: string
  ) => {
    try {
      const updatedForm = QuestionController.updateQuestionTitle(
        form,
        section.SectionId,
        questionId,
        questionText
      );
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Question title updated successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Error updating question title: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle updating question type
  const handleUpdateQuestionType = (
    questionId: string,
    newType: QuestionType
  ) => {
    try {
      const updatedForm = QuestionController.updateAnswerType(
        form,
        section.SectionId,
        questionId,
        newType
      );
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Question type updated successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Error updating question type: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle deleting a question
  const handleDeleteQuestion = (questionId: string) => {
    try {
      const question = section.questions.find(
        (q) => q.questionId === questionId
      );
      if (!question) {
        throw new Error("Question not found.");
      }

      let updatedForm: Form;

      if (!question.dependentOn || question.dependentOn.length === 0) {
        // Independent Question
        updatedForm = QuestionController.deleteIndependentQuestion(
          form,
          section.SectionId,
          questionId
        );
      } else {
        // Dependent Question
        updatedForm = QuestionController.deleteDependentQuestion(
          form,
          section.SectionId,
          questionId
        );
      }

      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: `Question "${question.questionText}" deleted successfully.`,
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Error deleting question: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle adding an option to a question
  const handleAddOption = (questionId: string) => {
    try {
      const updatedForm = OptionController.addOption(
        form,
        section.SectionId,
        questionId,
        "New Option"
      );
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Option added successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Error adding option: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle updating an option's value
  const handleUpdateOptionValue = (
    questionId: string,
    optionId: string,
    newValue: string
  ) => {
    try {
      const updatedForm = OptionController.updateOptionValue(
        form,
        section.SectionId,
        questionId,
        optionId,
        newValue
      );
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Option value updated successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Error updating option: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle deleting an option
  const handleDeleteOption = (questionId: string, optionId: string) => {
    try {
      const updatedForm = OptionController.deleteOption(
        form,
        section.SectionId,
        questionId,
        optionId
      );
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Option deleted successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Error deleting option: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle updating scale range for linear-scale questions
  const handleUpdateScaleRange = (questionId: string, range: 5 | 10) => {
    try {
      const updatedForm = QuestionController.updateAnswerType(
        form,
        section.SectionId,
        questionId,
        "linear-scale"
      );
      // Assuming you have a method to set scale range
      // If not, you can extend the controller accordingly
      const updatedFormWithScale = {
        ...updatedForm,
        sections: updatedForm.sections.map((sec: Section) => {
          if (sec.SectionId !== section.SectionId) return sec;
          return {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.questionId !== questionId) return q;
              return {
                ...q,
                scaleRange: range,
              };
            }),
          };
        }),
      };
      setForm(updatedFormWithScale);
      setSnackbar({
        open: true,
        message: "Scale range updated successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Error updating scale range: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Compute eligible dependency questions from earlier sections
  const eligibleDependencies = form.sections
    .filter((sec: Section) => sec.order < section.order) // Only earlier sections
    .flatMap((sec: Section) => sec.questions)
    .filter((q: Question) =>
      ["single-select", "integer", "number"].includes(q.type)
    );

  // Get dependency information for display
  const getDependencyInfo = (dependencies?: DependencyCondition[]) => {
    if (!dependencies?.length) return null;

    const dep = dependencies[0]; // Show first dependency for simplicity
    const dependentSection = form.sections.find((sec: Section) =>
      sec.questions.some((q: Question) => q.questionId === dep.questionId)
    );
    const dependentQuestion = dependentSection?.questions.find(
      (q: Question) => q.questionId === dep.questionId
    );

    return {
      sectionName: dependentSection?.sectionTitle || "",
      questionText: dependentQuestion?.questionText || "",
      expectedAnswer: dep.expectedAnswer,
      type: dep.dependencyType,
    };
  };

  return (
    <Paper elevation={3} className={classes.sectionPaper}>
      <div className={classes.sectionHeader}>
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <TextField
            label="Section Title"
            value={section.sectionTitle}
            onChange={(e) =>
              // Update section title
              setForm((prevForm) => {
                const updatedForm = { ...prevForm };
                updatedForm.sections = updatedForm.sections.map((sec) =>
                  sec.SectionId === section.SectionId
                    ? { ...sec, sectionTitle: e.target.value }
                    : sec
                );
                updatedForm.updatedAt = new Date().toISOString();
                return updatedForm;
              })
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
          Delete Section
        </Button>
      </div>
      <br />
      <br />

      {/* Render questions */}
      {section &&
        section.questions &&
        section.questions.map((ques: Question) => (
          <Paper
            key={ques.questionId}
            elevation={2}
            className={classes.questionPaper}
            style={{
              ...(ques.dependencies?.length
                ? questionStyles.dependent
                : questionStyles.independent),
            }}
          >
            {/* Question Type Badge */}
            <div style={{ marginBottom: "16px" }}>
              <span
                style={{
                  ...questionStyles.questionBadge,
                  ...(ques.dependencies?.length
                    ? questionStyles.dependentBadge
                    : questionStyles.independentBadge),
                }}
              >
                {ques.dependencies?.length
                  ? "Dependent Question"
                  : "Independent Question"}
              </span>
            </div>

            {/* Add dependency info at the top if question has dependencies */}
            {ques.dependencies?.length > 0 && (
              <div
                style={{
                  padding: "8px",
                  marginBottom: "16px",
                  borderBottom: "1px dashed #2196f3",
                  fontSize: "0.875rem",
                  color: "#666",
                }}
              >
                {(() => {
                  const info = getDependencyInfo(ques.dependencies);
                  return (
                    <>
                      <Typography
                        variant="subtitle2"
                        style={{ color: "#2196f3" }}
                      >
                        Dependent Question
                      </Typography>
                      <div style={{ marginTop: "4px" }}>
                        <strong>Shows when:</strong> {info?.sectionName} →{" "}
                        {info?.questionText} = {info?.expectedAnswer}
                        {info?.type === "options" && " (Dynamic Options)"}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
            <Grid container spacing={2} className={classes.questionRow}>
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Question Text"
                  value={ques.questionText}
                  onChange={(e) =>
                    handleUpdateQuestionTitle(ques.questionId, e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id={`type-label-${ques.questionId}`}>
                    Answer Type
                  </InputLabel>
                  <Select
                    labelId={`type-label-${ques.questionId}`}
                    value={ques.type}
                    onChange={(e) =>
                      handleUpdateQuestionType(
                        ques.questionId,
                        e.target.value as QuestionType
                      )
                    }
                  >
                    <MenuItem value="single-select">Single Select</MenuItem>
                    <MenuItem value="multi-select">Multi Select</MenuItem>
                    <MenuItem value="integer">Input Integer</MenuItem>
                    <MenuItem value="number">Input Number</MenuItem>
                    <MenuItem value="text">Input Text</MenuItem>
                    <MenuItem value="linear-scale">Linear Scale</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* Render options/inputs based on question type */}
            <div>
              {["single-select", "multi-select"].includes(ques.type) && (
                <>
                  {ques.options.map((option) => (
                    <div
                      key={option.optionId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      {ques.type === "single-select" ? (
                        <Radio disabled style={{ marginRight: "8px" }} />
                      ) : (
                        <Checkbox disabled style={{ marginRight: "8px" }} />
                      )}
                      <TextField
                        label="Option"
                        value={option.value}
                        onChange={(e) =>
                          handleUpdateOptionValue(
                            ques.questionId,
                            option.optionId,
                            e.target.value
                          )
                        }
                        fullWidth
                        margin="dense"
                      />
                      <IconButton
                        aria-label="delete-option"
                        onClick={() =>
                          handleDeleteOption(ques.questionId, option.optionId)
                        }
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Add />}
                      onClick={() => handleAddOption(ques.questionId)}
                    >
                      Add Option
                    </Button>
                  </div>
                </>
              )}

              {["integer", "number", "text"].includes(ques.type) && (
                <>
                  {ques.type === "integer" && (
                    <TextField
                      label="Answer"
                      type="number"
                      inputProps={{ step: 1 }}
                      disabled
                      fullWidth
                      margin="dense"
                    />
                  )}
                  {ques.type === "number" && (
                    <TextField
                      label="Answer"
                      type="number"
                      inputProps={{ step: 0.01 }}
                      disabled
                      fullWidth
                      margin="dense"
                    />
                  )}
                  {ques.type === "text" && (
                    <TextField
                      label="Answer"
                      type="text"
                      disabled
                      fullWidth
                      margin="dense"
                      multiline
                    />
                  )}
                </>
              )}

              {ques.type === "linear-scale" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "16px",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    {Array.from(
                      { length: ques.scaleRange || 5 },
                      (_, i) => i + 1
                    ).map((value) => (
                      <div
                        key={value}
                        style={{
                          textAlign: "center",
                          minWidth: "80px",
                          flex: "1",
                        }}
                      >
                        <Radio disabled />
                        <div>{value}</div>
                        <Typography
                          variant="caption"
                          style={{
                            display: "block",
                            minHeight: "40px",
                            fontSize:
                              ques.scaleRange === 10 ? "0.7rem" : "0.75rem",
                          }}
                        >
                          {value === 1
                            ? "Strongly Disagree"
                            : value === 5
                            ? "Strongly Agree"
                            : ""}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 16 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Delete />}
                onClick={() => handleDeleteQuestion(ques.questionId)}
              >
                Delete Question
              </Button>
            </div>
          </Paper>
        ))}

      <div style={{ display: "flex", gap: "16px" }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          onClick={openDependencyDialog}
          className={classes.addQuestionBtn}
        >
          Add Dependent Question
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            // Add independent question
            try {
              const updatedForm = QuestionController.addQuestion(
                form,
                section.SectionId
              );
              setForm(updatedForm);
              setSnackbar({
                open: true,
                message: "Independent question added successfully.",
                severity: "success",
              });
            } catch (error: any) {
              setSnackbar({
                open: true,
                message: `Error adding question: ${error.message}`,
                severity: "error",
              });
            }
          }}
        >
          Add Independent Question
        </Button>
      </div>

      {/* Dependency Dialog */}
      <DependencyDialog
        open={dependencyDialogOpen}
        onClose={closeDependencyDialog}
        form={form}
        section={section}
        handleCreateDependentQuestion={handleCreateDependentQuestion}
        eligibleDependencies={eligibleDependencies}
      />

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
