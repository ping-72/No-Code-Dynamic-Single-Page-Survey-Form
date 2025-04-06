import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  selector: {
    minWidth: 200,
    marginBottom: theme.spacing(2),
  },
}));

export type VisualizationType = "bar" | "pie" | "histogram";

interface VisualizationSelectorProps {
  questionType: string;
  value: VisualizationType;
  onChange: (type: VisualizationType) => void;
}

const VisualizationSelector: React.FC<VisualizationSelectorProps> = ({
  questionType,
  value,
  onChange,
}) => {
  const classes = useStyles();

  const getAvailableVisualizations = () => {
    switch (questionType) {
      case "linear-scale":
        return [
          { value: "bar", label: "Bar Chart" },
          { value: "histogram", label: "Histogram" },
          { value: "pie", label: "Pie Chart" },
        ];
      case "single-select":
        return [
          { value: "bar", label: "Bar Chart" },
          { value: "histogram", label: "Histogram" },
          { value: "pie", label: "Pie Chart" },
        ];
      case "multi-select":
        return [
          { value: "bar", label: "Bar Chart" },
          { value: "histogram", label: "Histogram" },
        ];
      default:
        return [
          { value: "bar", label: "Bar Chart" },
          { value: "histogram", label: "Histogram" },
        ];
    }
  };

  return (
    <FormControl className={classes.selector}>
      <InputLabel>Visualization Type</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as VisualizationType)}
        label="Visualization Type"
      >
        {getAvailableVisualizations().map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default VisualizationSelector;
