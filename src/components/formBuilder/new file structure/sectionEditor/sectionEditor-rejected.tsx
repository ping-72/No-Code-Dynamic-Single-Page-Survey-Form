// sectionEditor.tsx

import React, { useState } from "react";
import { FormController } from "../../formController/formcontroller";
import { DependencyDialog } from "./dependencyDialog";
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
import { Delete } from "@material-ui/icons";
import { useStyles } from "../../formbuilderStyle";
import {
  DependencyCondition,
  Form,
  Section,
  Question,
  Option,
} from "../../../../interface/interface";

interface SectionEditorProps {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  section: Section;
  responses: Record<string, string>;
  handleUpdateSectionTitle: (sectionId: string, title: string) => void;
  handleDeleteSection: (sectionId: string) => void;
  handleAddQuestion: (sectionId: string) => string; // Returns new questionId
  handleUpdateQuestion: (
    sectionId: string,
    questionId: string,
    text: string
  ) => void;
  handleDeleteQuestion: (sectionId: string, questionId: string) => void;
  handleUpdateQuestionType: (
    sectionId: string,
    questionId: string,
    type:
      | "single-select"
      | "multi-select"
      | "integer"
      | "number"
      | "text"
      | "linear-scale"
  ) => void;
  handleAddOption: (sectionId: string, questionId: string) => void;
  handleUpdateOption: (
    sectionId: string,
    questionId: string,
    optionId: string,
    value: string
  ) => void;
  handleDeleteOption: (
    sectionId: string,
    questionId: string,
    optionId: string
  ) => void;
  setFormTitle: (title: string) => void;
  setDescription: (description: string) => void;
  handleUpdateScaleRange: (
    sectionId: string,
    questionId: string,
    range: 5 | 10
  ) => void;
  handleRemoveDependency: (
    sectionId: string,
    questionId: string,
    dependencyIndex: number
  ) => void;
  handleCreateDependentQuestion: (
    targetSectionId: string,
    parentSectionId: string,
    parentQuestionId: string,
    expectedAnswer: string,
    parentOptionId: string | undefined,
    dependencyType: "visibility" | "options",
    questionType:
      | "single-select"
      | "multi-select"
      | "integer"
      | "number"
      | "text"
      | "linear-scale",
    triggerOptionId?: string
  ) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  form,
  setFormTitle,
  setDescription,
  section,
  handleDeleteSection,
  handleUpdateSectionTitle,
  responses,
  handleAddQuestion,
  handleUpdateQuestion,
  handleDeleteQuestion,
  handleUpdateQuestionType,
  handleAddOption,
  handleUpdateOption,
  handleDeleteOption,
  handleCreateDependentQuestion,
}) => {
  const classes = useStyles();

  const shouldDisplay = (
    dependencies: DependencyCondition[] | undefined,
    responses: Record<string, string>
  ): boolean => {
    return FormController.shouldDisplayQuestion(dependencies, responses);
  };

  // State for managing dependency dialog
  const [dependencyDialogOpen, setDependencyDialogOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [expectedAnswer, setExpectedAnswer] = useState<string>("");
  const [dependencyType, setDependencyType] = useState<
    "visibility" | "options"
  >("visibility");
  const [targetOptions, setTargetOptions] = useState<string[]>([]);
  const [newQuestionType, setNewQuestionType] = useState<
    | "single-select"
    | "multi-select"
    | "integer"
    | "number"
    | "text"
    | "linear-scale"
  >("single-select");

  // Styles
  const dependencyDialogStyles = {
    header: {
      backgroundColor: "#f5f5f5",
      padding: "16px",
      marginBottom: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
    },
    headerTitle: {
      color: "#2196f3",
      marginBottom: "8px",
    },
    selectedDependency: {
      backgroundColor: "#e3f2fd",
      padding: "12px",
      marginBottom: "16px",
      borderRadius: "4px",
    },
    section: {
      marginBottom: "24px",
    },
    divider: {
      margin: "16px 0",
    },
  };

  const questionStyles = {
    independent: {
      backgroundColor: "#f5f7fa",
      border: "1px solid #e0e0e0",
      borderLeft: "4px solid #4caf50", // green border for independent questions
    },
    dependent: {
      backgroundColor: "#f3f7fa",
      borderLeft: "4px solid #2196f3", // blue border for dependent questions
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

  // Reset dialog states
  const resetDependencyStates = () => {
    setSelectedSectionId("");
    setSelectedQuestionId("");
    setExpectedAnswer("");
    setDependencyType("visibility");
    setTargetOptions([]);
    setNewQuestionType("single-select");
  };

  // Handle creating a new dependent question
  const handleCreateQuestionWithDependency = () => {
    if (
      !selectedSectionId ||
      !selectedQuestionId ||
      !expectedAnswer ||
      !newQuestionType
    )
      return;

    // Find the parent question to determine if it's single-select
    const parentQuestion = form.sections
      .find((sec) => sec.SectionId === selectedSectionId)
      ?.questions.find((q) => q.questionId === selectedQuestionId);

    // Determine if a specific option triggers the dependency
    let triggerOptionId: string | undefined = undefined;
    if (
      dependencyType === "options" &&
      parentQuestion?.type === "single-select"
    ) {
      // Here, you need to capture which option(s) trigger the dependency
      // This requires additional UI to select the triggering option(s)
      // For simplicity, we'll assume a single triggerOptionId is selected
      // You should implement the UI to capture this based on your requirements
      // Example:
      // triggerOptionId = selectedTriggerOptionId; // Capture from UI
    }

    handleCreateDependentQuestion(
      section.SectionId, // targetSectionId
      selectedSectionId, // parentSectionId
      selectedQuestionId, // parentQuestionId
      expectedAnswer, // expectedAnswer
      dependencyType === "options" ? undefined : undefined, // parentOptionId: Adjust as needed
      dependencyType, // dependencyType
      newQuestionType, // questionType
      triggerOptionId // triggerOptionId
    );

    resetDependencyStates();
    setDependencyDialogOpen(false);
  };

  // Compute eligible dependency questions from earlier sections
  const eligibleDependencies = form.sections
    .filter((sec) => sec.order < section.order) // Only earlier sections
    .flatMap((sec) => sec.questions)
    .filter((q) => ["single-select", "integer", "number"].includes(q.type));

  const getLikertLabels = (range: 5): { value: number; label: string }[] => {
    return [
      { value: 1, label: "Strongly Disagree" },
      { value: 2, label: "Disagree" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Agree" },
      { value: 5, label: "Strongly Agree" },
    ];
  };

  // Helper function to check if an option should be displayed
  const shouldDisplayOption = (
    option: Option,
    responses: Record<string, string>
  ): boolean => {
    return FormController.shouldDisplayOption(
      option,
      responses,
      option.dependencies
    );
  };

  // Get options for the selected question (if single-select)
  const getSelectedQuestionOptions = () => {
    const selectedQuestion = form.sections
      .find((sec) => sec.SectionId === selectedSectionId)
      ?.questions.find((q) => q.questionId === selectedQuestionId);

    return selectedQuestion?.type === "single-select"
      ? selectedQuestion.options
      : [];
  };

  // Get dependency information for display
  const getDependencyInfo = (dependencies?: DependencyCondition[]) => {
    if (!dependencies?.length) return null;

    const dep = dependencies[0]; // Show first dependency for now
    const dependentSection = form.sections.find((sec) =>
      sec.questions.some((q) => q.questionId === dep.questionId)
    );
    const dependentQuestion = dependentSection?.questions.find(
      (q) => q.questionId === dep.questionId
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
          Delete Section
        </Button>
      </div>
      <br />
      <br />

      {section.sectionTitle.toLowerCase().includes("introduction") && (
        <div>
          <TextField
            label="Form Title"
            fullWidth
            value={form.formTitle}
            margin="normal"
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <TextField
            label="Form Description"
            fullWidth
            value={form.description}
            margin="normal"
            onChange={(e) => setDescription(e.target.value)}
            multiline
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-image"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  console.log(ev.target?.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <label htmlFor="upload-image">
            <Button variant="contained" color="primary" component="span">
              Upload Image
            </Button>
          </label>
        </div>
      )}

      {/* Render questions */}
      {section.questions
        .filter((ques: Question) => shouldDisplay(ques.dependencies, responses))
        .map((ques: Question) => (
          <Paper
            key={ques.questionId}
            elevation={2}
            className={classes.questionPaper}
            style={{
              ...(!ques.dependencies?.length
                ? questionStyles.independent
                : questionStyles.dependent),
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
            {/* @ts-ignore */}
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
                    handleUpdateQuestion(
                      section.SectionId,
                      ques.questionId,
                      e.target.value
                    )
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
                        section.SectionId,
                        ques.questionId,
                        e.target.value as
                          | "single-select"
                          | "multi-select"
                          | "integer"
                          | "number"
                          | "text"
                          | "linear-scale"
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
                  {ques.options
                    .filter((opt: Option) =>
                      shouldDisplayOption(opt, responses)
                    )
                    .map((option: Option) => (
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
                            handleUpdateOption(
                              section.SectionId,
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
                            handleDeleteOption(
                              section.SectionId,
                              ques.questionId,
                              option.optionId
                            )
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
                      onClick={() =>
                        handleAddOption(section.SectionId, ques.questionId)
                      }
                    >
                      Add Options
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
                    {getLikertLabels(ques.scaleRange || 5).map(
                      ({ value, label }) => (
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
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 16 }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Delete />}
                onClick={() =>
                  handleDeleteQuestion(section.SectionId, ques.questionId)
                }
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
          onClick={() => handleAddQuestion(section.SectionId)}
          className={classes.addQuestionBtn}
        >
          Add Question
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={openDependencyDialog}
        >
          Add Dependent Question
        </Button>
      </div>

      {/* Dependency Dialog */}
      <DependencyDialog
        open={dependencyDialogOpen}
        form={form}
        currentSectionOrder={form.sections[activeSection]?.order || 0}
        targetSectionId={form.sections[activeSection]?.SectionId || ""}
        handleCreateDependentQuestion={handleCreateQuestionWithDependency}
        onClose={() => {
          setDependencyDialogOpen(false);
          resetDependencyStates();
        }}
      />
    </Paper>
  );
};
