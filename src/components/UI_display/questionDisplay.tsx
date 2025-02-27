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
} from "@material-ui/core";
import { Question } from "../../interface/interface";
import TableDisplay from "./tableDisplay";

interface QuestionDisplayProps {
  question: Question;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
  index: number;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  responses,
  onResponseChange,
  index,
}) => {
  const renderSingleSelect = () => (
    <RadioGroup
      value={responses[question.questionId] || ""}
      onChange={(e) => onResponseChange(question.questionId, e.target.value)}
      style={{ margin: "8px 0", display: "flex", flexDirection: "column" }}
      required
    >
      {question.options.map((option) => (
        <FormControlLabel
          key={option.optionId}
          value={option.value}
          control={<Radio color="primary" />}
          label={option.value}
          style={{ margin: "4px 0" }}
        />
      ))}
    </RadioGroup>
  );

  const renderMultiSelect = () => (
    <Box style={{ margin: "8px 0" }}>
      {question.options.map((option) => (
        <FormControlLabel
          key={option.optionId}
          control={
            <Checkbox
              color="primary"
              checked={(responses[question.questionId] || []).includes(
                option.value
              )}
              onChange={(e) => {
                const current = responses[question.questionId] || [];
                if (e.target.checked) {
                  onResponseChange(question.questionId, [
                    ...current,
                    option.value,
                  ]);
                } else {
                  onResponseChange(
                    question.questionId,
                    current.filter((v: string) => v !== option.value)
                  );
                }
              }}
              required
            />
          }
          label={option.value}
          style={{ margin: "4px 0" }}
        />
      ))}
    </Box>
  );

  const renderLinearScale = () => {
    const scaleRange = question.scaleRange || 5;
    return (
      <Box style={{ margin: "8px 0" }}>
        <RadioGroup
          row
          value={responses[question.questionId] || ""}
          onChange={(e) =>
            onResponseChange(question.questionId, e.target.value)
          }
          style={{ justifyContent: "space-between" }}
          required
        >
          {Array.from({ length: scaleRange }).map((_, idx) => (
            <FormControlLabel
              key={idx}
              value={(idx + 1).toString()}
              control={<Radio color="primary" />}
              label={(idx + 1).toString()}
            />
          ))}
        </RadioGroup>
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
        style={{ margin: "8px 0" }}
        required
      />
    );
  };

  const renderTable = () => {
    if (
      question.options &&
      question.options.length > 0 &&
      question.options[0].tableData
    ) {
      return (
        <Box style={{ margin: "8px 0" }}>
          <TableDisplay
            tableData={question.options[0].tableData}
            inputValue={responses["<parentQuestionId>"]}
            onRadioChange={(value: any) =>
              onResponseChange(question.questionId, value)
            }
            selectedValue={responses[question.questionId]}
            required
          />
        </Box>
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
    <Box
      key={question.questionId}
      mt={4}
      style={{
        padding: "16px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" gutterBottom align="left">
        {`${index + 1}. ${question.questionText}`}
        {question.isRequired && <span style={{ color: "red" }}> *</span>}
      </Typography>
      {content}
      {question.dependentOn &&
        question.dependentOn.map((dep, idx) => (
          <FormHelperText
            key={idx}
            style={{ color: "#1976d2", marginTop: 8, textAlign: "right" }}
          >
            {`Shows when: ${dep.questionText} = ${dep.expectedAnswer}`}
          </FormHelperText>
        ))}
    </Box>
  );
};

export default QuestionDisplay;
