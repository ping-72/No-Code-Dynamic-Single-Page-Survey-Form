import React from "react";
import {
  Box,
  // Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { Section, Question as _BaseQuestion } from "../../interface/interface";
import QuestionDisplay from "./questionDisplay";

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
}));

interface SectionDisplayProps {
  section: Section;
  responses: Record<string, FormResponse>;
  onResponseChange: (questionId: string, value: FormResponse) => void;
  validationErrors: ValidationError[];
}

const SectionDisplay: React.FC<SectionDisplayProps> = ({
  section,
  responses,
  onResponseChange,
  validationErrors,
}) => {
  const classes = useStyles();

  // Sort questions by their order property if available
  const sortedQuestions = [...section.questions].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  // Helper function to find the error message for a question
  const getErrorMessage = (questionId: string): string | undefined => {
    const error = validationErrors.find((err) => err.questionId === questionId);
    return error?.message;
  };

  return (
    <Box>
      {sortedQuestions.map((question) => (
        <Box key={question.questionId} className={classes.questionContainer}>
          <QuestionDisplay
            question={question}
            value={responses[question.questionId] || null}
            onChange={onResponseChange}
            error={getErrorMessage(question.questionId)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default SectionDisplay;
