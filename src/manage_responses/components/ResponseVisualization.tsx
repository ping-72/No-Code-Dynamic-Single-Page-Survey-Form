import React, { useState, useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import Histogram from "./Histogram";
import VisualizationSelector, {
  VisualizationType,
} from "./VisualizationSelector";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  selectorContainer: {
    marginBottom: theme.spacing(2),
  },
}));

interface ResponseVisualizationProps {
  questionText: string;
  questionType: string;
  responses: Array<string | number | boolean | string[] | null>;
  options?: Array<{ optionId: string; value: string }>;
}

const ResponseVisualization: React.FC<ResponseVisualizationProps> = ({
  questionText,
  questionType,
  responses,
  options,
}) => {
  const classes = useStyles();
  const [visualizationType, setVisualizationType] =
    useState<VisualizationType>("bar");

  const processedData = useMemo(() => {
    switch (questionType) {
      case "linear-scale":
        return processLinearScaleData(responses);
      case "single-select":
        return processSingleSelectData(responses, options);
      case "multi-select":
        return processMultiSelectData(responses, options);
      default:
        return processDefaultData(responses);
    }
  }, [responses, questionType, options]);

  const renderVisualization = () => {
    switch (visualizationType) {
      case "bar":
        return (
          <BarChart
            data={processedData}
            title={questionText}
            xLabel="Response"
            yLabel="Count"
          />
        );
      case "pie":
        return <PieChart data={processedData} title={questionText} />;
      case "histogram":
        return (
          <Histogram
            data={responses.filter((r): r is number => typeof r === "number")}
            title={questionText}
            xLabel="Value"
            yLabel="Count"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box className={classes.container}>
      <Typography variant="h6" className={classes.title}>
        {questionText}
      </Typography>
      <Box className={classes.selectorContainer}>
        <VisualizationSelector
          questionType={questionType}
          value={visualizationType}
          onChange={setVisualizationType}
        />
      </Box>
      {renderVisualization()}
    </Box>
  );
};

// Helper functions to process data based on question type
const processLinearScaleData = (
  responses: Array<string | number | boolean | string[] | null>
) => {
  const counts: Record<string, number> = {};
  responses.forEach((response) => {
    if (typeof response === "number") {
      counts[response.toString()] = (counts[response.toString()] || 0) + 1;
    }
  });
  return Object.entries(counts).map(([label, value]) => ({
    label,
    value,
  }));
};

const processSingleSelectData = (
  responses: Array<string | number | boolean | string[] | null>,
  options?: Array<{ optionId: string; value: string }>
) => {
  const counts: Record<string, number> = {};
  responses.forEach((response) => {
    if (typeof response === "string") {
      counts[response] = (counts[response] || 0) + 1;
    }
  });
  return Object.entries(counts).map(([label, value]) => ({
    label: options?.find((opt) => opt.value === label)?.value || label,
    value,
  }));
};

const processMultiSelectData = (
  responses: Array<string | number | boolean | string[] | null>,
  options?: Array<{ optionId: string; value: string }>
) => {
  const counts: Record<string, number> = {};
  responses.forEach((response) => {
    if (Array.isArray(response)) {
      response.forEach((value) => {
        if (typeof value === "string") {
          counts[value] = (counts[value] || 0) + 1;
        }
      });
    }
  });
  return Object.entries(counts).map(([label, value]) => ({
    label: options?.find((opt) => opt.value === label)?.value || label,
    value,
  }));
};

const processDefaultData = (
  responses: Array<string | number | boolean | string[] | null>
) => {
  const counts: Record<string, number> = {};
  responses.forEach((response) => {
    const key = String(response);
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).map(([label, value]) => ({
    label,
    value,
  }));
};

export default ResponseVisualization;
