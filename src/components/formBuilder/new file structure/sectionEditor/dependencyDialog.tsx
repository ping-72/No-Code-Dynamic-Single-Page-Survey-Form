import React, { useState, useEffect } from "react";
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
  Box,
  Icon,
  IconButton,
} from "@material-ui/core";
import { Remove, Delete, Add } from "@material-ui/icons";
import {
  Form,
  Option,
  Section,
  Range,
  DependencyCondition,
  QuestionType,
} from "../../../../interface/interface";
import { QuestionController } from "../../formController/questionController";

interface DependencyDialogProps {
  open: boolean;
  onClose: () => void;
  form: Form;
  section: Section;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  setSnackbar: (
    message: string,
    severity: "success" | "error",
    open: boolean
  ) => void;
}

export const DependencyDialog: React.FC<DependencyDialogProps> = ({
  open,
  onClose,
  form,
  section,
  setForm,
  setSnackbar,
}) => {
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
  const [triggerOptionId, setTriggerOptionId] = useState<string>("");
  const [ranges, setRanges] = useState<Range[]>([]);
  const resetDependencyStates = () => {
    setSelectedSectionId("");
    setSelectedQuestionId("");
    setExpectedAnswer("");
    setDependencyType("visibility");
    setTargetOptions([]);
    setNewQuestionType("single-select");
    setTriggerOptionId("");
    setRanges([]);
  };

  useEffect(() => {
    if (!open) resetDependencyStates();
    // console.log("Dependency states are: ", dependencyType);
  }, [open]);

  const getSelectedQuestionOptions = (): Option[] => {
    const selectedQuestion = form.sections
      .find((sec) => sec.SectionId === selectedSectionId)
      ?.questions.find((q) => q.questionId === selectedQuestionId);

    return selectedQuestion?.type === "single-select"
      ? selectedQuestion.options
      : [];
  };

  const addRange = () => {
    setRanges([...ranges, { minValue: undefined, maxValue: undefined }]);
  };
  const deleteRange = (index: number) => {
    const updatedRanges = [...ranges];
    updatedRanges.splice(index, 1);
    setRanges(updatedRanges);
  };
  const updateRange = (
    index: number,
    field: keyof Range,
    value: number | undefined
  ) => {
    const updatedRanges = [...ranges];
    updatedRanges[index][field] = value;
    setRanges(updatedRanges);
    console.log("The ranges are now: ", ranges);
  };

  const parentQuestionType: QuestionType | undefined = selectedQuestionId
    ? form.sections
        .find((sec) => sec.SectionId === selectedSectionId)
        ?.questions.find((q) => q.questionId === selectedQuestionId)?.type
    : undefined;
  const isNumerical =
    parentQuestionType === "integer" || parentQuestionType === "number";

  const handleCreateDependentQuestion = () => {
    if (!selectedQuestionId || !selectedSectionId) {
      setSnackbar(
        "Please select a parent section and question.",
        "error",
        true
      );
      return;
    }
    if (isNumerical) {
      if (ranges.length === 0) {
        setSnackbar("Please add at least one range.", "error", true);
        return;
      }
      for (let i = 0; i < ranges.length; i++) {
        if (
          ranges[i].minValue === undefined ||
          ranges[i].maxValue === undefined
        ) {
          setSnackbar("Please fill in all range values.", "error", true);
          return;
        }
        // @ts-ignore
        if (ranges[i].minValue > ranges[i].maxValue) {
          setSnackbar(
            `In range ${i + 1}, Min value cannot be greater than max value.`,
            "error",
            true
          );
          return;
        }
      }
    } else {
      if (dependencyType === "options" && !expectedAnswer) {
        setSnackbar("Please enter an expected answer.", "error", true);
        return;
      }
      if (dependencyType === "options" && !triggerOptionId) {
        setSnackbar("Please select a trigger option.", "error", true);
        return;
      }
    }

    const dependency: DependencyCondition = {
      sectionId: selectedSectionId,
      questionId: selectedQuestionId,
      dependencyType: dependencyType,
    };

    //Adding numerical or option dependency
    if (isNumerical) {
      dependency.range = ranges;
    } else {
      dependency.expectedAnswer = expectedAnswer;
      if (dependencyType === "options") {
        dependency.triggerOptionId = triggerOptionId;
      }
    }

    try {
      const updatedForm = QuestionController.addDependentQuestion(
        form,
        section.SectionId, // current Section
        [dependency]
      );
      setForm(updatedForm);
      setSnackbar("Dependent question added successfully.", "success", true);
      onClose();
      resetDependencyStates();
    } catch (error: any) {
      setSnackbar(
        `Error adding dependent question: ${error.message}`,
        "error",
        true
      );
    }
  };

  // Styles
  const dependencyDialogStyles = {
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
  };

  useEffect(() => {
    if (!open) {
      resetDependencyStates();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        resetDependencyStates();
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{ style: { padding: "16px" } }}
    >
      <DialogTitle style={dependencyDialogStyles.headerTitle}>
        "Create Dependent Question"
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
                  ?.questions.find((q) => q.questionId === selectedQuestionId)
                  ?.questionText
              }
            </Typography>
          </div>
        )}

        {/* 1. Select Question Type */}
        <div style={dependencyDialogStyles.section}>
          <Typography variant="subtitle2" gutterBottom>
            1. Select Question Type
          </Typography>
          <FormControl fullWidth>
            <InputLabel>New Question Type</InputLabel>
            <Select
              value={newQuestionType}
              onChange={(e) =>
                setNewQuestionType(
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
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="integer">Integer</MenuItem>
              <MenuItem value="linear-scale">Linear Scale</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* 2. Configure Dependency */}
        <div style={dependencyDialogStyles.section}>
          <Typography variant="subtitle2" gutterBottom>
            2. Configure Dependency
          </Typography>

          {/* Section Selection */}
          <FormControl fullWidth style={{ marginBottom: "16px" }}>
            <InputLabel>Select Section</InputLabel>
            <Select
              value={selectedSectionId}
              onChange={(e) => {
                resetDependencyStates();
                setSelectedSectionId(e.target.value as string);
              }}
            >
              {form.sections
                .filter((sec) => sec.order <= section.order)
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
                  ?.questions.filter((q) =>
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
          {selectedQuestionId && !isNumerical && (
            <>
              {form.sections
                .find((sec) => sec.SectionId === selectedSectionId)
                ?.questions.find((q) => q.questionId === selectedQuestionId)
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

          {/* Ranges Input for Numerical Questions */}
          {selectedQuestionId && isNumerical && (
            <div style={{ marginTop: "16px" }}>
              <Typography variant="subtitle1" gutterBottom>
                Define Ranges
              </Typography>
              {ranges.map((range, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  marginBottom="8px"
                >
                  {/* Min Value Field */}
                  <Box flex={1} mr={1}>
                    <TextField
                      label="Min Value"
                      type="number"
                      fullWidth
                      value={range.minValue !== undefined ? range.minValue : ""}
                      onChange={(e) =>
                        updateRange(
                          index,
                          "minValue",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </Box>

                  {/* Max Value Field */}
                  <Box flex={1} mr={1}>
                    <TextField
                      label="Max Value"
                      type="number"
                      fullWidth
                      value={range.maxValue !== undefined ? range.maxValue : ""}
                      onChange={(e) =>
                        updateRange(
                          index,
                          "maxValue",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </Box>

                  {/* Delete Button */}
                  <Box>
                    <IconButton
                      onClick={() => deleteRange(index)}
                      color="secondary"
                    >
                      <Delete />
                      {"Range"}
                    </IconButton>
                  </Box>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Add />}
                onClick={addRange}
              >
                Add Range
              </Button>
            </div>
          )}
        </div>

        {/* 3. Configure Trigger Option (if dependencyType is "options") */}
        {dependencyType === "options" &&
          form.sections
            .find((sec) => sec.SectionId === selectedSectionId)
            ?.questions.find((q) => q.questionId === selectedQuestionId)
            ?.type === "single-select" && (
            <div style={dependencyDialogStyles.section}>
              <Typography variant="subtitle2" gutterBottom>
                3. Configure Trigger Option
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select Trigger Option</InputLabel>
                <Select
                  value={triggerOptionId}
                  onChange={(e) => setTriggerOptionId(e.target.value as string)}
                >
                  {getSelectedQuestionOptions().map((option) => (
                    <MenuItem key={option.optionId} value={option.optionId}>
                      {option.value}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="textSecondary">
                  Select the option that will trigger this dependency
                </Typography>
              </FormControl>
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
          onClick={handleCreateDependentQuestion}
          color="primary"
          disabled={
            (isNumerical && ranges.length === 0) ||
            (!isNumerical &&
              (!selectedSectionId ||
                !selectedQuestionId ||
                (dependencyType === "options" && !triggerOptionId) ||
                (dependencyType !== "options" && !expectedAnswer)))
          }
        >
          Create Question
        </Button>
      </DialogActions>
    </Dialog>
  );
};
