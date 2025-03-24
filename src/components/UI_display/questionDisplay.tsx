import React from "react";
import {
  Box,
  Typography,
  TextField,
  Radio,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  useTheme,
  useMediaQuery,
  Paper,
  Fade,
  Divider,
} from "@material-ui/core";
import { Question } from "../../interface/interface";
import TableDisplay from "./tableDisplay";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    questionContainer: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(2),
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
    },
    questionHeader: {
      padding: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    questionNumber: {
      color: theme.palette.primary.main,
      fontWeight: 600,
      marginRight: theme.spacing(1),
    },
    questionText: {
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
    questionContent: {
      padding: theme.spacing(2),
    },
    requiredLabel: {
      color: theme.palette.error.main,
      marginLeft: theme.spacing(0.5),
      fontSize: "0.875rem",
    },
    optionContainer: {
      margin: theme.spacing(1, 0),
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1),
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    linearScaleContainer: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.spacing(1),
    },
    scaleLabel: {
      color: theme.palette.text.secondary,
      fontSize: "0.875rem",
    },
    inputField: {
      "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
          borderColor: theme.palette.primary.main,
        },
      },
    },
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(10px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  })
);

// Define a type for form responses
type FormResponse = string | number | boolean | string[] | null;

interface QuestionDisplayProps {
  question: Question;
  responses: Record<string, FormResponse>;
  onResponseChange: (questionId: string, value: FormResponse) => void;
  index: number;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  responses,
  onResponseChange,
  index,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const renderSingleSelect = () => (
    <FormControl
      component="fieldset"
      required={question.isRequired}
      style={{ width: "100%" }}
    >
      <RadioGroup
        value={responses[question.questionId] || ""}
        onChange={(e) => onResponseChange(question.questionId, e.target.value)}
        style={{ width: "100%" }}
      >
        {question.options.map((option) => (
          <FormControlLabel
            key={option.optionId}
            value={option.value}
            control={<Radio color="primary" />}
            label={option.value}
            className={classes.optionContainer}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );

  const renderMultiSelect = () => {
    const currentResponses = (responses[question.questionId] as string[]) || [];
    return (
      <Box style={{ width: "100%" }}>
        {question.options.map((option) => (
          <FormControlLabel
            key={option.optionId}
            control={
              <Checkbox
                color="primary"
                checked={currentResponses.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onResponseChange(question.questionId, [
                      ...currentResponses,
                      option.value,
                    ]);
                  } else {
                    onResponseChange(
                      question.questionId,
                      currentResponses.filter((v) => v !== option.value)
                    );
                  }
                }}
                required={question.isRequired}
              />
            }
            label={option.value}
            className={classes.optionContainer}
          />
        ))}
      </Box>
    );
  };

  const renderLinearScale = () => {
    const scaleRange = question.scaleRange || 5;
    return (
      <Box className={classes.linearScaleContainer}>
        <RadioGroup
          row
          value={responses[question.questionId] || ""}
          onChange={(e) =>
            onResponseChange(question.questionId, e.target.value)
          }
          style={{ justifyContent: "space-between", width: "100%" }}
        >
          {Array.from({ length: scaleRange }).map((_, idx) => (
            <FormControlLabel
              key={idx}
              value={(idx + 1).toString()}
              control={<Radio color="primary" />}
              label={(idx + 1).toString()}
              style={{ margin: 0, flexGrow: 1, justifyContent: "center" }}
            />
          ))}
        </RadioGroup>
        {question.scaleLabels && (
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="caption" className={classes.scaleLabel}>
              {question.scaleLabels.start}
            </Typography>
            <Typography variant="caption" className={classes.scaleLabel}>
              {question.scaleLabels.end}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderInput = () => {
    const inputType = question.type === "text" ? "text" : "number";
    return (
      <TextField
        fullWidth
        variant="outlined"
        type={inputType}
        value={responses[question.questionId] || ""}
        onChange={(e) => onResponseChange(question.questionId, e.target.value)}
        multiline={question.type === "text"}
        rows={question.type === "text" ? 4 : 1}
        required={question.isRequired}
        className={classes.inputField}
      />
    );
  };

  const renderTable = () => {
    if (question.options?.[0]?.tableData) {
      return (
        <FormControl required={question.isRequired} style={{ width: "100%" }}>
          <TableDisplay
            tableData={question.options[0].tableData}
            inputValue={responses["<parentQuestionId>"]?.toString() || ""}
            onRadioChange={(value: FormResponse) =>
              onResponseChange(question.questionId, value)
            }
            selectedValue={responses[question.questionId]?.toString() || ""}
          />
        </FormControl>
      );
    }
    return null;
  };

  let content;
  switch (question.type) {
    case "single-select":
      content = renderSingleSelect();
      break;
    case "multi-select":
      content = renderMultiSelect();
      break;
    case "linear-scale":
      content = renderLinearScale();
      break;
    case "table":
      content = renderTable();
      break;
    case "number":
    case "integer":
    case "text":
      content = renderInput();
      break;
    default:
      content = null;
  }

  return (
    <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
      <Paper className={classes.questionContainer}>
        <div className={classes.questionHeader}>
          <Typography
            variant="h6"
            style={{ display: "flex", alignItems: "center" }}
          >
            <span className={classes.questionNumber}>Q{index + 1}</span>
            <span className={classes.questionText}>
              {question.questionText}
            </span>
            {question.isRequired && (
              <span className={classes.requiredLabel}>*</span>
            )}
          </Typography>
        </div>
        <div className={classes.questionContent}>{content}</div>
      </Paper>
    </Fade>
  );
};

export default QuestionDisplay;
