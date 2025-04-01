import React from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/Error";
import { Question as BaseQuestion } from "../../interface/interface";
import TableDisplay from "./tableDisplay";

// Extend the base Question interface to include the properties we need
interface Question extends BaseQuestion {
  description?: string;
  placeholder?: string;
  unit?: string;
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    labels?: {
      start: string;
      end: string;
    };
  };
  scaleRange?: 5 | 10;
  scaleLabels?: {
    start: string;
    end: string;
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
    marginLeft: 0,
    alignItems: "flex-start",
    width: "100%",
  },
  radioGroup: {
    marginLeft: 0,
    alignItems: "flex-start",
    width: "100%",
  },
  formControlLabel: {
    marginLeft: 0,
    marginRight: 0,
    width: "100%",
    paddingLeft: 0,
    "& .MuiFormControlLabel-label": {
      textAlign: "left",
      marginLeft: theme.spacing(1),
    },
    "& .MuiCheckbox-root, & .MuiRadio-root": {
      padding: 0,
    },
  },
  formControl: {
    width: "100%",
    "& .MuiFormGroup-root": {
      marginLeft: 0,
      width: "100%",
    },
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
  likertContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(2),
    width: "100%",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  likertDots: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 2),
  },
  likertDotContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  likertDot: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: theme.palette.grey[300],
    transition: "all 0.2s ease",
    position: "relative",
    marginBottom: theme.spacing(0.5),
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      transform: "scale(1.1)",
    },
    "&.selected": {
      backgroundColor: theme.palette.primary.main,
      transform: "scale(1.1)",
    },
    "&.selected::after": {
      content: '""',
      position: "absolute",
      top: "-8px",
      left: "-8px",
      right: "-8px",
      bottom: "-8px",
      borderRadius: "50%",
      backgroundColor: theme.palette.primary.light,
      opacity: 0.3,
      zIndex: -1,
    },
  },
  dotNumber: {
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
    fontWeight: 500,
    transition: "all 0.2s ease",
  },
  dotNumberSelected: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  likertLabels: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "600px",
    marginTop: theme.spacing(2),
    padding: theme.spacing(0, 2),
  },
  likertLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  likertLabelText: {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
    fontWeight: 500,
    marginBottom: theme.spacing(0.5),
  },
  likertLabelValue: {
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
  },
  selectedValue: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const LikertScale: React.FC<{
  value: number | null;
  onChange: (value: number) => void;
  scaleRange: 5 | 10;
}> = ({ value, onChange, scaleRange }) => {
  const classes = useStyles();

  const getLabelText = (value: number) => {
    if (value === 1) return "Strongly Disagree";
    if (value === scaleRange) return "Strongly Agree";
    if (value === Math.ceil(scaleRange / 2)) return "Neutral";
    return "";
  };

  return (
    <Box className={classes.likertContainer}>
      <Box className={classes.likertDots}>
        {Array.from({ length: scaleRange }, (_, i) => i + 1).map((num) => (
          <Box
            key={num}
            className={classes.likertDotContainer}
            onClick={() => onChange(num)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onChange(num);
              }
            }}
            aria-label={`Select ${num} - ${getLabelText(num)}`}
            aria-selected={value === num}
          >
            <Box
              className={`${classes.likertDot} ${
                value === num ? "selected" : ""
              }`}
            />
            <Typography
              className={`${classes.dotNumber} ${
                value === num ? classes.dotNumberSelected : ""
              }`}
            >
              {num}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const classes = useStyles();
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));

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

  const handleTableColumnSelect = (columnIndex: number) => {
    if (
      question.options &&
      question.options.length > 0 &&
      question.options[0].tableData &&
      question.options[0].tableData.columns
    ) {
      const selectedColumn = question.options[0].tableData.columns[columnIndex];
      onChange(question.questionId, selectedColumn);
    }
  };

  const isCheckboxSelected = (optionValue: string) => {
    return Array.isArray(value) && value.includes(optionValue);
  };

  const formatTableData = () => {
    if (
      question.options &&
      question.options.length > 0 &&
      question.options[0].tableData
    ) {
      const tableData = question.options[0].tableData;
      const headers = tableData.columns || [];

      const rows = tableData.rows.map((row) => ({
        name: row.attributeName,
        value: row.value,
      }));

      const selectedColumnIndex = headers.findIndex(
        (header) => header === value
      );

      return {
        headers,
        rows,
        selectedColumn:
          selectedColumnIndex >= 0 ? selectedColumnIndex : undefined,
      };
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "text":
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
            type={question.type}
          />
        );
      case "number":
      case "integer":
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
                <InputAdornment position="end">{question.unit}</InputAdornment>
              ) : undefined,
            }}
          />
        );
      case "multi-select":
        return (
          <FormControl
            component="fieldset"
            error={!!error}
            className={classes.formControl}
          >
            <FormGroup className={classes.checkboxGroup}>
              {question.options.map((option) => (
                <FormControlLabel
                  key={option.optionId}
                  control={
                    <Checkbox
                      checked={isCheckboxSelected(option.value || "")}
                      onChange={handleCheckboxChange}
                      value={option.value || ""}
                      color="primary"
                    />
                  }
                  label={option.value || ""}
                  className={classes.formControlLabel}
                />
              ))}
            </FormGroup>
          </FormControl>
        );
      case "single-select":
        return (
          <FormControl
            component="fieldset"
            error={!!error}
            className={classes.formControl}
          >
            <RadioGroup
              value={value || ""}
              onChange={handleRadioChange}
              className={classes.radioGroup}
            >
              {question.options.map((option) => (
                <FormControlLabel
                  key={option.optionId}
                  value={option.value || ""}
                  control={<Radio color="primary" />}
                  label={option.value || ""}
                  className={classes.formControlLabel}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case "linear-scale":
        return (
          <LikertScale
            value={value as number}
            onChange={(newValue) => onChange(question.questionId, newValue)}
            scaleRange={question.scaleRange || 5}
          />
        );
      case "table": {
        const tableData = formatTableData();
        return (
          <div className={classes.tableContainer}>
            {tableData && (
              <TableDisplay
                data={tableData}
                onChange={handleTableColumnSelect}
                error={!!error}
              />
            )}
          </div>
        );
      }
      default:
        return null;
    }
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

      {renderQuestion()}

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
