import React from "react";
import { Delete } from "@material-ui/icons";
import { useStyles } from "../../../../formbuilderStyle";
import { QuestionController } from "../../../../formController/questionController";
import { OptionController } from "../../../../formController/optioncontroller";
import { DependencyDialog } from "../../dependencyDialog";
import {
  DependencyCondition,
  Form,
  Section,
  Question,
  QuestionType,
} from "../../../../../../interface/interface";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@mui/material";
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
} from "@material-ui/core";
import { StylesforQuestions } from "./questionstyles";

interface QuestionEditorProps {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  section: Section;
  responses: Record<string, string>;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  form,
  setForm,
  section,
}) => {
  const classes = useStyles();
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [dependencyDialogOpen, setDependencyDialogOpen] = React.useState(false);

  const [newQuestionType, setNewQuestionType] = React.useState<
    | "single-select"
    | "multi-select"
    | "integer"
    | "number"
    | "text"
    | "linear-scale"
  >("single-select");

  const handleCreateIndependnentQuestion = (questionType: QuestionType) => {
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
        message: `Error adding independent question: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleUpdateQuestionTitle = (questionId: string, title: string) => {
    try {
      const updatedForm = QuestionController.updateQuestionTitle(
        form,
        section.SectionId,
        questionId,
        title
      );
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Question title updated successfully.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error updating question title: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleUpdateQuestionType = (
    questionId: string,
    newtype: QuestionType
  ) => {
    try {
      const updatedForm = QuestionController.updateAnswerType(
        form,
        section.SectionId,
        questionId,
        newtype
      );
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Question type updated successfully.",
        severity: "success",
      });
    } catch (error: Error) {
      setSnackbar({
        open: true,
        message: `Error updating question type: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    const question: Question | undefined = section.questions.find(
      (q) => q.questionId === questionId
    );
    if (!question) {
      throw new Error(
        `Question with ID '${questionId}' not found in section '${section.sectionTitle}'.`
      );
    }
    if (question.dependentOn && question.dependentOn.length > 0) {
      handleDeleteDependentQuestion(questionId);
    } else {
      handleDeleteIndependentQuestion(questionId);
    }
  };

  const handleDeleteIndependentQuestion = (questionId: string) => {
    try {
      const updatedForm = QuestionController.deleteIndependentQuestion(
        form,
        section.SectionId,
        questionId
      );
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Independent question deleted successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Error deleting independent question: ${error.message}`,
        severity: "error",
      });
    }
  };
  const handleDeleteDependentQuestion = (questionId: string) => {
    try {
      const question = section.questions.find(
        (q) => q.questionId === questionId
      );
      if (!question) {
        throw new Error(`Question not found in section '.`);
      }
      let updatedForm: Form;

      if (!question.dependentOn || question.dependentOn.length === 0) {
        updatedForm = QuestionController.deleteIndependentQuestion(
          form,
          section.SectionId,
          questionId
        );
      } else {
        updatedForm = QuestionController.deleteDependentQuestion(
          form,
          section.SectionId,
          questionId
        );
      }

      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Dependent question deleted successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Error deleting dependent question: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleAddOption = (questionId: string) => {
    try {
      const updatedForm = OptionController.addOption(
        form,
        section.SectionId,
        questionId,
        "normal",
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
        message: `Error updating option value: ${error.message}`,
        severity: "error",
      });
    }
  };

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

  const eligibleDependencies = form.sections
    .filter((sec) => sec.SectionId <= section.SectionId)
    .flatMap((sec) => sec.questions)
    .flatMap((q) =>
      q.options.filter((opt) =>
        ["number", "single-select", "integer", "linear-scale"].includes(q.type)
      )
    );

  const getDependencyInfo = (
    dependentOn?: DependencyCondition[]
  ): {
    sectionName: string;
    questionText: string;
    expectedAnswer: string;
    type: "visibility" | "options";
  } | null => {
    if (!dependentOn || dependentOn.length === 0) return null;

    const dep = dependentOn[0];

    if (!form.sections || !Array.isArray(form.sections)) {
      console.error("Form sections are undefined or not an array.");
      return null;
    }

    const dependentSection = form.sections.find(
      (s) => s.SectionId === dep.sectionId
    );

    if (!dependentSection) {
      console.warn(`Section with ID ${dep.sectionId} not found.`);
      return null;
    }

    if (
      !dependentSection.questions ||
      !Array.isArray(dependentSection.questions)
    ) {
      console.error(
        "Dependent section questions are undefined or not an array."
      );
      return null;
    }

    const dependentQuestion = dependentSection.questions.find(
      (q) => q.questionId === dep.questionId
    );

    if (!dependentQuestion) {
      console.warn(
        `Question with ID ${dep.questionId} not found in section ${dep.sectionId}.`
      );
      return null;
    }

    return {
      sectionName: dependentSection.sectionTitle,
      questionText: dependentQuestion.questionText,
      expectedAnswer: dep.expectedAnswer,
      type: dep.dependencyType,
    };
  };

  const questionStyles = StylesforQuestions();

  const getLikertLabels = (range: 5): { value: number; label: string }[] => {
    return [
      { value: 1, label: "Strongly Disagree" },
      { value: 2, label: "Disagree" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Agree" },
      { value: 5, label: "Strongly Agree" },
    ];
  };

  return (
    <>
      {/* Render questions */}
      {section &&
        section.questions &&
        section.questions.map((ques: Question) => (
          <Paper
            key={ques.questionId}
            elevation={2}
            className={classes.questionPaper}
            style={{
              ...(!ques.dependentOn?.length
                ? questionStyles.independent
                : questionStyles.dependent),
            }}
          >
            {/* Question Type Badge */}
            <div style={{ marginBottom: "16px" }}>
              <span
                style={{
                  ...questionStyles.questionBadge,
                  ...(ques.dependentOn?.length
                    ? questionStyles.dependentBadge
                    : questionStyles.independentBadge),
                }}
              >
                {ques.dependentOn?.length
                  ? "Dependent Question"
                  : "Independent Question"}
              </span>
            </div>

            {/* Add dependency info at the top if question has dependencies */}
            {ques.dependentOn?.length > 0 && (
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
                  const info = getDependencyInfo(ques.dependentOn);
                  return (
                    <>
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
                      gap: "8px",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleAddOption(ques.questionId)}
                    >
                      Add Option
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleAddOption(ques.questionId)}
                    >
                      Add Table
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
                    {getLikertLabels(5).map(({ value, label }) => (
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
                          {label}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 16 }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Delete />}
                onClick={() => handleDeleteQuestion(ques.questionId)}
              >
                Delete Question
              </Button>
            </div>
          </Paper>
        ))}

      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleCreateIndependnentQuestion("single-select")}
          className={classes.addQuestionBtn}
        >
          Add Question
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setDependencyDialogOpen(true)}
        >
          Add Dependent Question
        </Button>
      </div>

      {/* Dependency Dialog */}
      <DependencyDialog
        open={dependencyDialogOpen}
        onClose={() => setDependencyDialogOpen(false)}
        form={form}
        section={section}
        setForm={setForm}
        setSnackbar={(message, severity, open) =>
          setSnackbar({ open, message, severity })
        }
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
