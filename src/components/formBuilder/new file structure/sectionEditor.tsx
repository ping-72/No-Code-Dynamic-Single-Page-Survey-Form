import React, { useState } from "react";
import { FormController } from "../formController/formcontroller";
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
  RadioGroup,
  FormControlLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useStyles } from "../formbuilderStyle";
import {
  DependencyCondition,
  Form,
  Section,
  Question,
  Option,
} from "../../../interface/interface";

interface SectionEditorProps {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  section: Section;
  responses: Record<string, string>;
  handleUpdateSectionTitle: (sectionId: string, title: string) => void;
  handleDeleteSection: (sectionId: string) => void;
  handleAddQuestion: (sectionId: string) => void;
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
    sectionId: string,
    dependency: DependencyCondition,
    questionType: string
  ) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  form,
  setForm,
  section,
  responses,
  handleUpdateSectionTitle,
  handleDeleteSection,
  handleAddQuestion,
  handleUpdateQuestion,
  handleDeleteQuestion,
  handleUpdateQuestionType,
  handleAddOption,
  handleUpdateOption,
  handleDeleteOption,
  setFormTitle,
  setDescription,
  handleUpdateScaleRange,
  handleRemoveDependency,
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
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [currentQuestionForDependency, setCurrentQuestionForDependency] =
    useState<Question | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");

  // Additional state variables for dependency type and target options
  const [dependencyType, setDependencyType] = useState<
    "visibility" | "options"
  >("visibility");
  const [targetOptions, setTargetOptions] = useState<string[]>([]);

  // Add new state variable for new question type
  const [newQuestionType, setNewQuestionType] =
    useState<string>("single-select");

  // Add these styles at the beginning of the component
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

  // Add these styles to the existing dependencyDialogStyles object
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

  // Open dependency dialog for a specific question
  const openDependencyDialog = (ques: Question) => {
    setCurrentQuestionForDependency(ques);
    setDependencyDialogOpen(true);
  };

  const handleAddDependency = () => {
    if (currentQuestionForDependency && selectedQuestionId) {
      const selectedQuestion = form.sections
        .find((sec) => sec.SectionId === selectedSectionId)
        ?.question.find((q) => q.questionId === selectedQuestionId);

      if (selectedQuestion) {
        // Call FormController.addDependency if available, or invoke a prop function here.
        setForm((prev) =>
          FormController.addDependency(
            prev,
            section.SectionId,
            currentQuestionForDependency.questionId,
            {
              questionId: selectedQuestion.questionId,
              expectedAnswer,
              questionText: selectedQuestion.questionText,
              dependencyType,
              targetOptions:
                dependencyType === "options" ? targetOptions : undefined,
            }
          )
        );
      }
    }
    setDependencyDialogOpen(false);
    setSelectedSectionId("");
    setSelectedQuestionId("");
    setExpectedAnswer("");
    setDependencyType("visibility");
    setTargetOptions([]);
  };

  // Add this new function inside your SectionEditor component
  const handleAddQuestionWithDependency = () => {
    if (!selectedQuestionId || !expectedAnswer || !newQuestionType) return;

    // First, create the question
    const newQuestionId = handleAddQuestion(section.SectionId);

    // Then create its dependency
    const dependency: DependencyCondition = {
      questionId: selectedQuestionId,
      expectedAnswer,
      questionText: form.sections
        .find((sec) => sec.SectionId === selectedSectionId)
        ?.question.find((q) => q.questionId === selectedQuestionId)
        ?.questionText,
      dependencyType,
      targetOptions: dependencyType === "options" ? targetOptions : undefined,
    };

    // Update question type and add dependency
    setForm((prev) => {
      const withType = FormController.updateQuestionType(
        prev,
        section.SectionId,
        newQuestionId,
        newQuestionType
      );
      return FormController.addDependency(
        withType,
        section.SectionId,
        newQuestionId,
        dependency
      );
    });

    // Reset states
    resetDependencyStates();
    setDependencyDialogOpen(false);
  };

  // Compute eligible dependency questions from earlier sections
  const eligibleDependencies = form.sections
    .filter((sec) => sec.order < section.order) // Only earlier sections
    .flatMap((sec) => sec.question)
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

  // Add helper function to check if an option should be displayed
  const shouldDisplayOption = (
    option: Option,
    responses: Record<string, string>
  ): boolean => {
    return FormController.shouldDisplayOption(
      option,
      responses,
      option.dependentOn
    );
  };

  // Add this helper function to the component
  const getSelectedQuestionOptions = () => {
    const selectedQuestion = form.sections
      .find((sec) => sec.SectionId === selectedSectionId)
      ?.question.find((q) => q.questionId === selectedQuestionId);

    return selectedQuestion?.type === "single-select"
      ? selectedQuestion.options
      : [];
  };

  const resetDependencyStates = () => {
    setSelectedSectionId("");
    setSelectedQuestionId("");
    setExpectedAnswer("");
    setDependencyType("visibility");
    setTargetOptions([]);
  };

  // Add this helper function inside SectionEditor component
  const getDependencyInfo = (dependencies?: DependencyCondition[]) => {
    if (!dependencies?.length) return null;

    const dep = dependencies[0]; // Show first dependency for now
    const dependentSection = form.sections.find((sec) =>
      sec.question.some((q) => q.questionId === dep.questionId)
    );
    const dependentQuestion = dependentSection?.question.find(
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
          Section
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
      {section.question
        .filter((ques) => shouldDisplay(ques.dependencies, responses))
        .map((ques) => (
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
              {ques.type === "single-select" && (
                <>
                  {ques.options
                    .filter((opt) => shouldDisplayOption(opt, responses))
                    .map((option) => (
                      <div
                        key={option.optionId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Radio disabled style={{ marginRight: "8px" }} />
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

              {ques.type === "multi-select" && (
                <>
                  {ques.options
                    .filter((opt) => shouldDisplayOption(opt, responses))
                    .map((option) => (
                      <div
                        key={option.optionId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Checkbox disabled style={{ marginRight: "8px" }} />
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

              {(ques.type === "integer" ||
                ques.type === "number" ||
                ques.type === "text") && (
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
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      value={ques.scaleRange || 5}
                      onChange={(e) =>
                        handleUpdateScaleRange(
                          section.SectionId,
                          ques.questionId,
                          parseInt(e.target.value) as 5 | 10
                        )
                      }
                    >
                      <FormControlLabel
                        value={5}
                        control={<Radio />}
                        label="5-point scale"
                      />
                    </RadioGroup>
                  </FormControl>
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
                Question
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
          onClick={() => {
            setDependencyDialogOpen(true);
            setCurrentQuestionForDependency(null); // Reset since this is a new question
          }}
        >
          Add Dependent Question
        </Button>
      </div>

      {/* Dependency Dialog */}
      <Dialog
        open={dependencyDialogOpen}
        onClose={() => setDependencyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: { padding: "16px" },
        }}
      >
        <DialogTitle style={dependencyDialogStyles.headerTitle}>
          {currentQuestionForDependency
            ? "Add Dependency"
            : "Create Dependent Question"}
        </DialogTitle>

        <DialogContent>
          {/* Summary Section */}
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

          {/* Question Type Selection */}
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

          {/* Dependency Configuration */}
          <div style={dependencyDialogStyles.section}>
            <Typography variant="subtitle2" gutterBottom>
              {currentQuestionForDependency ? "1" : "2"}. Configure Dependency
            </Typography>

            {/* Section Selection */}
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
                  .filter((sec) => sec.order < section.order)
                  .map((sec) => (
                    <MenuItem key={sec.SectionId} value={sec.SectionId}>
                      {sec.sectionTitle}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {/* Question Selection */}
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

            {/* Expected Answer Input */}
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

          {/* Options Configuration */}
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
                            // </DialogActions>
                          } else {
                            setTargetOptions(
                              targetOptions.filter(
                                (opt) => opt !== option.value
                              )
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
              setDependencyDialogOpen(false);
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
            {currentQuestionForDependency
              ? "Add Dependency"
              : "Create Question"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
