import React from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  Checkbox,
  FormControlLabel,
  FormControl,
  // FormLabel,
  FormGroup,
  Slider,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  InputAdornment,
  // FormHelperText,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Error";
import { Question as BaseQuestion } from "../../interface/interface";
import TableDisplay from "./tableDisplay";
import { TableData } from "./tableDisplay";

// Extend the base Question interface to include the properties we need
interface Question extends BaseQuestion {
  description?: string;
  placeholder?: string;
  unit?: string;
  tableData?: {
    columns: string[];
    rows: Array<{
      attributeName: string;
      attributeId: string;
      value: string | number | boolean | null;
    }>;
  };
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    labels?: {
      start: string;
      end: string;
    };
  };
}

type FormResponse = string | number | boolean | string[] | null;

interface QuestionDisplayProps {
  question: Question;
  value: FormResponse;
  onChange: (questionId: string, value: FormResponse) => void;
  error?: string;
}

const useStyles = makeStyles((theme) => ({
  questionContainer: {
    marginBottom: theme.spacing(3),
    position: "relative",
    padding: theme.spacing(2),
    borderRadius: "10px",
    backgroundColor: "white",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)",
    },
  },
  questionContainerError: {
    borderLeft: `3px solid ${theme.palette.error.main}`,
    paddingLeft: theme.spacing(2),
    backgroundColor: "rgba(255,0,0,0.03)",
  },
  questionText: {
    marginBottom: theme.spacing(1.5),
    fontWeight: 500,
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "flex-start",
  },
  description: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
  },
  requiredStar: {
    color: theme.palette.error.main,
    marginLeft: theme.spacing(0.5),
    fontWeight: "bold",
  },
  sliderContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  input: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    marginLeft: theme.spacing(1),
  },
  radioGroup: {
    marginLeft: theme.spacing(1),
  },
  sliderValue: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
  },
  sliderLabel: {
    color: theme.palette.text.secondary,
    fontSize: "0.85rem",
  },
  sliderValueContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: "50%",
    width: 36,
    height: 36,
    fontWeight: "bold",
  },
  errorText: {
    color: theme.palette.error.main,
    fontSize: "0.85rem",
    marginTop: theme.spacing(0.5),
    display: "flex",
    alignItems: "center",
  },
  errorIcon: {
    marginRight: theme.spacing(0.5),
    fontSize: "1rem",
  },
  tableContainer: {
    marginTop: theme.spacing(2),
  },
}));

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(question.questionId, e.target.value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === "" ? "" : e.target.value;
    onChange(question.questionId, newValue);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValues = Array.isArray(value) ? [...value] : [];
    if (e.target.checked) {
      onChange(question.questionId, [...currentValues, e.target.value]);
    } else {
      onChange(
        question.questionId,
        currentValues.filter((item) => item !== e.target.value)
      );
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(question.questionId, e.target.value);
  };

  const handleSliderChange = (_: any, newValue: number | number[]) => {
    onChange(question.questionId, newValue as number);
  };

  const handleTableColumnSelect = (columnIndex: number) => {
    // Get the column name that was selected
    if (question.tableData && question.tableData.columns) {
      const selectedColumn = question.tableData.columns[columnIndex];
      onChange(question.questionId, selectedColumn);
    }
  };

  const isCheckboxSelected = (optionValue: string) => {
    return Array.isArray(value) && value.includes(optionValue);
  };

  const formatTableData = (): TableData | null => {
    if (!question.tableData) return null;

    // Convert the question's tableData to the format expected by TableDisplay
    const headers = question.tableData.columns || [];

    const rows = question.tableData.rows.map((row) => ({
      name: row.attributeName,
      value: row.value,
    }));

    // Find the index of the selected column
    const selectedColumnIndex = headers.findIndex(
      (header: string) => header === value
    );

    return {
      headers,
      rows,
      selectedColumn:
        selectedColumnIndex >= 0 ? selectedColumnIndex : undefined,
    };
  };

  return (
    <Paper
      elevation={0}
      className={`${classes.questionContainer} ${
        error ? classes.questionContainerError : ""
      }`}
    >
      <Typography variant="body1" className={classes.questionText}>
        {question.questionText}
        {question.isRequired && <span className={classes.requiredStar}>*</span>}
      </Typography>

      {question.description && (
        <Typography
          variant="body2"
          className={classes.description}
          component="div"
        >
          {question.description}
        </Typography>
      )}

      {(() => {
        if (question.type === "text" || question.type === "email") {
          return (
            <TextField
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              value={value || ""}
              onChange={handleInputChange}
              fullWidth
              error={!!error}
              className={classes.input}
              placeholder={question.placeholder || "Your answer"}
              type={question.type === "email" ? "email" : "text"}
            />
          );
        }

        if (question.type === "number" || question.type === "integer") {
          return (
            <TextField
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              value={value || ""}
              onChange={handleNumberChange}
              fullWidth
              error={!!error}
              className={classes.input}
              placeholder={question.placeholder || "Your answer"}
              type="number"
              InputProps={{
                endAdornment: question.unit ? (
                  <InputAdornment position="end">
                    {question.unit}
                  </InputAdornment>
                ) : undefined,
              }}
            />
          );
        }

        if (question.type === "multi-select" && question.options) {
          return (
            <FormControl component="fieldset" error={!!error}>
              <FormGroup className={classes.checkboxGroup}>
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={isCheckboxSelected(option.value)}
                        onChange={handleCheckboxChange}
                        value={option.value}
                        color="primary"
                      />
                    }
                    label={option.label}
                  />
                ))}
              </FormGroup>
            </FormControl>
          );
        }

        if (question.type === "select" && question.options) {
          return (
            <FormControl component="fieldset" error={!!error}>
              <RadioGroup
                value={value || ""}
                onChange={handleRadioChange}
                className={classes.radioGroup}
              >
                {question.options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio color="primary" />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          );
        }

        if (question.type === "slider" && question.sliderConfig) {
          const { min, max, step, labels } = question.sliderConfig;
          return (
            <div className={classes.sliderContainer}>
              <Slider
                value={typeof value === "number" ? value : min}
                onChange={handleSliderChange}
                aria-labelledby="slider-value"
                valueLabelDisplay="auto"
                step={step}
                marks
                min={min}
                max={max}
                color="primary"
              />
              <Box className={classes.sliderValue}>
                {labels && (
                  <>
                    <Typography className={classes.sliderLabel}>
                      {labels.start}
                    </Typography>
                    <div className={classes.sliderValueContainer}>
                      {typeof value === "number" ? value : min}
                    </div>
                    <Typography className={classes.sliderLabel}>
                      {labels.end}
                    </Typography>
                  </>
                )}
              </Box>
            </div>
          );
        }

        if (question.type === "table") {
          const tableData = formatTableData();
          return (
            <div className={classes.tableContainer}>
              {tableData && (
                <TableDisplay
                  data={tableData}
                  onChange={handleTableColumnSelect}
                  error={error}
                />
              )}
            </div>
          );
        }

        return null;
      })()}

      {error && (
        <Typography className={classes.errorText}>
          <ErrorIcon className={classes.errorIcon} />
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default QuestionDisplay;
