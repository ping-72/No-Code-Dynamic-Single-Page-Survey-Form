import React from "react";
import { Box, Typography } from "@material-ui/core";
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
  sectionContainer: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    color: theme.palette.primary.main,
  },
  sectionDescription: {
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  formInfoContainer: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(3),
  },
  formTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  formDescription: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
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
  const isFormInfoSection = section.type === "form-info";

  if (isFormInfoSection) {
    return (
      <Box className={classes.formInfoContainer}>
        <Typography variant="h4" className={classes.formTitle}>
          {section.sectionTitle}
        </Typography>
        {section.description && (
          <Typography variant="body1" className={classes.formDescription}>
            {section.description}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box className={classes.sectionContainer}>
      <Typography variant="h5" className={classes.sectionTitle}>
        {section.sectionTitle}
      </Typography>
      {section.description && (
        <Typography variant="body1" className={classes.sectionDescription}>
          {section.description}
        </Typography>
      )}
      {section.questions.map((question) => (
        <Box key={question.questionId} className={classes.questionContainer}>
          <QuestionDisplay
            question={question}
            value={responses[question.questionId] || null}
            onChange={onResponseChange}
            error={
              validationErrors.find(
                (err) => err.questionId === question.questionId
              )?.message
            }
          />
        </Box>
      ))}
    </Box>
  );
};

export default SectionDisplay;
