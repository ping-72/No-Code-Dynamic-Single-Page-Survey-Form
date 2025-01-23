import React, { useState } from "react";
import {
  Paper,
  Typography,
  Radio,
  Checkbox,
  TextField,
  FormControlLabel,
  Button,
  LinearProgress,
  Box,
  FormHelperText,
} from "@material-ui/core";
import {
  Form,
  Section,
  Question,
  DependencyCondition,
} from "../../interface/interface";
// import { Form, Section, Question, DependencyCondition } from '../../../interface/interface';

interface FormPreviewProps {
  formData: Form;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ formData }) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = formData.sections[currentSectionIndex];

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const checkDependency = (dependency: DependencyCondition): boolean => {
    const responseValue = responses[dependency.questionId];

    if (dependency.dependencyType === "visibility") {
      return responseValue === dependency.expectedAnswer;
    }

    if (dependency.dependencyType === "options") {
      return dependency.targetOptions?.includes(responseValue) ?? false;
    }

    return true;
  };

  const shouldDisplayQuestion = (
    dependencies?: DependencyCondition[]
  ): boolean => {
    if (!dependencies || dependencies.length === 0) return true;
    return dependencies.every(checkDependency);
  };

  const renderOptions = (question: Question) => {
    if (!question.options) return null;

    return question.options
      .filter((option) => shouldDisplayQuestion(option.dependencies))
      .map((option) => {
        if (question.type === "single-select") {
          return (
            <FormControlLabel
              key={option.optionId}
              control={
                <Radio
                  checked={responses[question.questionId] === option.value}
                  onChange={() =>
                    handleResponseChange(question.questionId, option.value)
                  }
                />
              }
              label={option.value}
            />
          );
        }

        if (question.type === "multi-select") {
          return (
            <FormControlLabel
              key={option.optionId}
              control={
                <Checkbox
                  checked={(responses[question.questionId] || []).includes(
                    option.value
                  )}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [
                          ...(responses[question.questionId] || []),
                          option.value,
                        ]
                      : (responses[question.questionId] || []).filter(
                          (v: string) => v !== option.value
                        );
                    handleResponseChange(question.questionId, newValue);
                  }}
                />
              }
              label={option.value}
            />
          );
        }

        return null;
      });
  };

  const renderQuestion = (question: Question) => {
    if (!shouldDisplayQuestion(question.dependencies)) return null;

    return (
      <Box mt={4} key={question.questionId}>
        <Typography variant="h6" gutterBottom>
          {question.questionText}
          {question.isRequired && <span style={{ color: "red" }}> *</span>}
        </Typography>

        {["single-select", "multi-select"].includes(question.type) &&
          renderOptions(question)}

        {question.type === "linear-scale" && (
          <Box>
            <Box display="flex" justifyContent="space-between">
              {Array.from({ length: question.scaleRange || 5 }).map(
                (_, idx) => (
                  <FormControlLabel
                    key={idx + 1}
                    control={
                      <Radio
                        checked={
                          responses[question.questionId] ===
                          (idx + 1).toString()
                        }
                        onChange={() =>
                          handleResponseChange(
                            question.questionId,
                            (idx + 1).toString()
                          )
                        }
                      />
                    }
                    label={idx + 1}
                    labelPlacement="top"
                  />
                )
              )}
            </Box>
            {question.scaleLabels && (
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="caption">
                  {question.scaleLabels.start}
                </Typography>
                <Typography variant="caption">
                  {question.scaleLabels.end}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {["text", "number", "integer"].includes(question.type) && (
          <TextField
            fullWidth
            variant="outlined"
            type={question.type === "text" ? "text" : "number"}
            inputProps={
              question.type === "integer" ? { step: 1 } : { step: 0.01 }
            }
            multiline={question.type === "text"}
            rows={question.type === "text" ? 4 : 1}
            value={responses[question.questionId] || ""}
            onChange={(e) =>
              handleResponseChange(question.questionId, e.target.value)
            }
          />
        )}

        {question.dependentOn?.map((dependency, index) => (
          <FormHelperText
            key={index}
            style={{ color: "#1976d2", marginTop: 8 }}
          >
            {`Shows when: ${dependency.questionText} = ${dependency.expectedAnswer}`}
          </FormHelperText>
        ))}
      </Box>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <LinearProgress
        variant="determinate"
        value={((currentSectionIndex + 1) / formData.sections.length) * 100}
        style={{ marginBottom: 32 }}
      />

      <Paper elevation={3} style={{ padding: 24 }}>
        {currentSectionIndex === 0 && (
          <Box mb={4}>
            <Typography variant="h3" gutterBottom>
              {formData.formTitle}
            </Typography>
            <Typography variant="body1">{formData.description}</Typography>
          </Box>
        )}

        <Typography variant="h5" gutterBottom>
          {currentSection.sectionTitle}
        </Typography>
        {currentSection.description && (
          <Typography variant="body1" paragraph>
            {currentSection.description}
          </Typography>
        )}

        {currentSection.questions.map(renderQuestion)}

        <Box mt={4} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            disabled={currentSectionIndex === 0}
            onClick={() => setCurrentSectionIndex((prev) => prev - 1)}
          >
            Previous
          </Button>

          <Button
            variant="contained"
            color="primary"
            disabled={currentSectionIndex === formData.sections.length - 1}
            onClick={() => setCurrentSectionIndex((prev) => prev + 1)}
          >
            {currentSectionIndex === formData.sections.length - 1
              ? "Submit"
              : "Next"}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};
