import React from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormGroup,
  Checkbox,
  TextField,
  useTheme,
  useMediaQuery,
  Slider,
  FormHelperText,
  Chip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { Section, Question, Option } from "../../interface/interface";
import TableDisplay from "./tableDisplay";

// Define a type for form responses
type FormResponse = string | number | boolean | string[] | null;

// Define validation error type
interface ValidationError {
  questionId: string;
  message: string;
}

const useStyles = makeStyles((theme) => ({
  questionContainer: {
    marginBottom: theme.spacing(4),
    position: "relative",
    padding: theme.spacing(2),
    borderRadius: "10px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.01)",
    },
  },
  errorQuestion: {
    backgroundColor: "rgba(244, 67, 54, 0.05)",
    border: `1px solid ${theme.palette.error.light}`,
  },
  questionText: {
    fontWeight: 500,
    marginBottom: theme.spacing(1.5),
    display: "flex",
    alignItems: "center",
  },
  requiredLabel: {
    color: theme.palette.error.main,
    marginLeft: theme.spacing(0.5),
  },
  errorMessage: {
    color: theme.palette.error.main,
    display: "flex",
    alignItems: "center",
    fontSize: "0.85rem",
    marginTop: theme.spacing(0.5),
  },
  errorIcon: {
    fontSize: "1rem",
    marginRight: theme.spacing(0.5),
  },
  checkboxGroup: {
    marginTop: theme.spacing(1),
  },
  checkbox: {
    padding: theme.spacing(0.5),
  },
  radioGroup: {
    marginTop: theme.spacing(1),
  },
  radio: {
    padding: theme.spacing(0.5),
  },
  slider: {
    padding: theme.spacing(2, 1),
    width: "90%",
    margin: "0 auto",
  },
  textField: {
    marginTop: theme.spacing(1),
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      transition: "all 0.2s ease",
      "&:hover": {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
      "&.Mui-focused": {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  inputLabel: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
  },
  multiSelectChip: {
    margin: theme.spacing(0.5),
    borderRadius: "16px",
    fontWeight: 500,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.15)",
    },
  },
  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: theme.spacing(1),
  },
  sliderValueLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
    width: "90%",
    margin: "0 auto",
  },
  disabledQuestion: {
    opacity: 0.65,
  },
}));

interface SectionDisplayProps {
  section: Section;
  responses: Record<string, FormResponse>;
  onResponseChange: (questionId: string, value: FormResponse) => void;
  validationErrors?: ValidationError[];
}

const SectionDisplay: React.FC<SectionDisplayProps> = ({
  section,
  responses,
  onResponseChange,
  validationErrors = [],
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Check if a section has any validation errors
  const sectionHasErrors = section.questions.some((question) =>
    validationErrors.some((error) => error.questionId === question.questionId)
  );

  // Get error message for a specific question
  const getErrorMessage = (questionId: string): string | null => {
    const error = validationErrors.find((e) => e.questionId === questionId);
    return error ? error.message : null;
  };

  // Check if a question has validation errors
  const hasError = (questionId: string): boolean => {
    return validationErrors.some((error) => error.questionId === questionId);
  };

  // Handle various input changes
  const handleTextChange =
    (questionId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onResponseChange(questionId, e.target.value);
    };

  const handleNumberChange =
    (questionId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onResponseChange(questionId, e.target.value === "" ? "" : e.target.value);
    };

  const handleRadioChange =
    (questionId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onResponseChange(questionId, e.target.value);
    };

  const handleCheckboxChange =
    (questionId: string, value: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentResponses = (responses[questionId] as string[]) || [];
      const newResponses = e.target.checked
        ? [...currentResponses, value]
        : currentResponses.filter((val) => val !== value);
      onResponseChange(questionId, newResponses);
    };

  const handleSliderChange =
    (questionId: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_event: any, value: number | number[]) => {
      onResponseChange(questionId, value as number);
    };

  const isCheckboxSelected = (
    questionId: string,
    value: string | undefined
  ): boolean => {
    if (value === undefined) return false;
    const currentResponses = (responses[questionId] as string[]) || [];
    return currentResponses.includes(value);
  };

  // Function to render different question types
  const renderQuestionInput = (question: Question) => {
    const errorMessage = getErrorMessage(question.questionId);
    const isErrorState = hasError(question.questionId);

    // Determine question type and render appropriate input
    const qType = question.type as string;

    if (qType === "text") {
      return (
        <TextField
          id={question.questionId}
          value={responses[question.questionId] || ""}
          onChange={handleTextChange(question.questionId)}
          variant="outlined"
          multiline={false}
          rows={1}
          fullWidth
          placeholder={`Enter your answer${question.isRequired ? "*" : ""}`}
          error={isErrorState}
          helperText={errorMessage}
          className={classes.textField}
        />
      );
    }

    if (qType === "paragraph") {
      return (
        <TextField
          id={question.questionId}
          value={responses[question.questionId] || ""}
          onChange={handleTextChange(question.questionId)}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          placeholder={`Enter your answer${question.isRequired ? "*" : ""}`}
          error={isErrorState}
          helperText={errorMessage}
          className={classes.textField}
        />
      );
    }

    if (qType === "number" || qType === "integer") {
      return (
        <TextField
          id={question.questionId}
          value={responses[question.questionId] || ""}
          onChange={handleNumberChange(question.questionId)}
          variant="outlined"
          type="number"
          fullWidth
          placeholder={`Enter a number${question.isRequired ? "*" : ""}`}
          error={isErrorState}
          helperText={errorMessage}
          className={classes.textField}
        />
      );
    }

    if (qType === "single-select") {
      return (
        <FormControl component="fieldset" error={isErrorState} fullWidth>
          <RadioGroup
            aria-label={question.questionText}
            name={question.questionId}
            value={responses[question.questionId] || ""}
            onChange={handleRadioChange(question.questionId)}
            className={classes.radioGroup}
          >
            {question.options.map((option: Option) => (
              <FormControlLabel
                key={option.optionId}
                value={option.value || ""}
                control={<Radio color="primary" className={classes.radio} />}
                label={
                  <Typography variant="body2">{option.value || ""}</Typography>
                }
              />
            ))}
          </RadioGroup>
          {errorMessage && (
            <FormHelperText error>{errorMessage}</FormHelperText>
          )}
        </FormControl>
      );
    }

    if (qType === "multi-select") {
      return (
        <FormControl component="fieldset" error={isErrorState} fullWidth>
          <FormGroup className={classes.checkboxGroup}>
            {question.options.map((option: Option) => (
              <FormControlLabel
                key={option.optionId}
                control={
                  <Checkbox
                    checked={isCheckboxSelected(
                      question.questionId,
                      option.value
                    )}
                    onChange={handleCheckboxChange(
                      question.questionId,
                      option.value || ""
                    )}
                    name={option.optionId}
                    color="primary"
                    className={classes.checkbox}
                  />
                }
                label={
                  <Typography variant="body2">{option.value || ""}</Typography>
                }
              />
            ))}
          </FormGroup>
          <Box className={classes.chipContainer}>
            {responses[question.questionId] &&
              Array.isArray(responses[question.questionId]) &&
              (responses[question.questionId] as string[]).map(
                (selected, index) => (
                  <Chip
                    key={index}
                    label={selected}
                    color="primary"
                    className={classes.multiSelectChip}
                    onDelete={() => {
                      const newSelections = (
                        responses[question.questionId] as string[]
                      ).filter((val) => val !== selected);
                      onResponseChange(question.questionId, newSelections);
                    }}
                  />
                )
              )}
          </Box>
          {errorMessage && (
            <FormHelperText error>{errorMessage}</FormHelperText>
          )}
        </FormControl>
      );
    }

    if (qType === "linear-scale") {
      return (
        <Box mt={2} width="100%">
          <Slider
            value={
              responses[question.questionId] !== undefined
                ? (responses[question.questionId] as number)
                : 0
            }
            onChange={handleSliderChange(question.questionId)}
            aria-labelledby={`slider-${question.questionId}`}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={5}
            color={isErrorState ? "secondary" : "primary"}
            className={classes.slider}
          />
          <Box className={classes.sliderValueLabel}>
            <Typography variant="caption" color="textSecondary">
              0
            </Typography>
            <Typography variant="caption" color="textSecondary">
              5
            </Typography>
          </Box>
          {errorMessage && (
            <FormHelperText error>{errorMessage}</FormHelperText>
          )}
        </Box>
      );
    }

    if (qType === "table") {
      // Check if we have the table data available
      if (
        question.options &&
        question.options.length > 0 &&
        question.options[0].tableData
      ) {
        const tableData = question.options[0].tableData;
        return (
          <TableDisplay
            tableData={tableData}
            selectedValue={(responses[question.questionId] as string) || ""}
            onRadioChange={(value) =>
              onResponseChange(question.questionId, value)
            }
            error={isErrorState}
            errorMessage={errorMessage}
          />
        );
      }
      return (
        <Typography color="error">
          Table data is missing or in incorrect format
        </Typography>
      );
    }

    return (
      <Typography color="error">
        Unsupported question type: {question.type}
      </Typography>
    );
  };

  // Sort questions by their order property
  const sortedQuestions = [...section.questions].sort(
    (a, b) => a.order - b.order
  );

  return (
    <Box>
      {sortedQuestions.map((question) => (
        <Box
          key={question.questionId}
          className={`${classes.questionContainer} ${
            hasError(question.questionId) ? classes.errorQuestion : ""
          }`}
        >
          <Typography variant="body1" className={classes.questionText}>
            {question.questionText}
            {question.isRequired && (
              <span className={classes.requiredLabel}>*</span>
            )}
          </Typography>
          {renderQuestionInput(question)}
          {hasError(question.questionId) && (
            <Typography className={classes.errorMessage}>
              <ErrorOutlineIcon className={classes.errorIcon} />
              {getErrorMessage(question.questionId)}
            </Typography>
          )}
        </Box>
      ))}

      {section.questions.length === 0 && section.description && (
        <Typography
          variant="body1"
          style={{
            fontStyle: "italic",
            color: theme.palette.text.secondary,
            textAlign: isMobile ? "left" : "center",
          }}
        >
          {section.description}
        </Typography>
      )}

      {section.questions.length === 0 && !section.description && (
        <Typography
          variant="body1"
          color="textSecondary"
          style={{ fontStyle: "italic", textAlign: "center" }}
        >
          No questions in this section.
        </Typography>
      )}
    </Box>
  );
};

export default SectionDisplay;
