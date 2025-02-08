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
  TableRow,
  TableCell,
  FormHelperText,
} from "@material-ui/core";
import { Question } from "../../interface/interface";
import TablePreview from "./tablePreview";

interface QuestionPreviewProps {
  question: Question;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
  index_no: number;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  responses,
  onResponseChange,
  index_no,
}) => {
  const renderSingleSelect = () => (
    <RadioGroup
      value={responses[question.questionId] || ""}
      onChange={(e) => onResponseChange(question.questionId, e.target.value)}
      style={{ margin: "8px 0", display: "flex", flexDirection: "column" }}
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
          <TablePreview
            tableData={question.options[0].tableData}
            inputValue={responses["<parentQuestionId>"]}
          >
            {/* Radio-button row appended as the last row of the table */}
            <TableRow>
              <TableCell>
                <Typography variant="body2" color="textSecondary">
                  Select:
                </Typography>
              </TableCell>
              {question.options[0].tableData.columns.map((col, idx) => (
                <TableCell key={idx} align="center">
                  <Radio
                    color="primary"
                    value={col}
                    checked={responses[question.questionId] === col}
                    onChange={(e) =>
                      onResponseChange(question.questionId, e.target.value)
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
          </TablePreview>
        </Box>
      );
    }
    return null;
  };

  let content = null;
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
    <>
      <hr />
      <hr />
      <hr />
      <Box
        mt={4}
        key={question.questionId}
        style={{
          padding: "16px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "10px 4px 8px rgba(0, 0, 0, 0.1)",
          animation: "fadeIn 0.3s ease-in-out",
          textAlign: "left",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {`${index_no + 1}. ${question.questionText}`}
          {question.isRequired && <span style={{ color: "red" }}> *</span>}
        </Typography>
        {content}
        {question.dependentOn &&
          question.dependentOn.map((dep, index) => (
            <FormHelperText
              key={index}
              style={{ color: "#1976d2", marginTop: 8, textAlign: "right" }}
            >
              {`Shows when: ${dep.questionText} = ${dep.expectedAnswer}`}
            </FormHelperText>
          ))}
      </Box>
      <hr />
      <hr />
      <hr />
    </>
  );
};

export default QuestionPreview;
