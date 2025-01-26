import { makeStyles } from "@material-ui/core";

export const StylesforQuestions = () => ({
  independent: {
    backgroundColor: "#f5f7fa",
    border: "1px solid #e0e0e0",
    borderLeft: "4px solid #4caf50",
  },
  dependent: {
    backgroundColor: "#f3f7fa",
    borderLeft: "4px solid #2196f3",
  },
  questionBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 500,
    marginBottom: "8px",
    display: "inline-block",
  },
  independentBadge: {
    backgroundColor: "#4caf50",
    color: "white",
  },
  dependentBadge: {
    backgroundColor: "#2196f3",
    color: "white",
  },
});
