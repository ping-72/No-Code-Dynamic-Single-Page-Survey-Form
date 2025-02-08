import React from "react";
import { Typography } from "@material-ui/core";
import { FunctionDependency } from "../../interface/interface";
import { evaluate } from "mathjs";

interface TableCellRendererProps {
  cellValue: string | number | FunctionDependency;
  inputValue?: number;
}

const TableCellRenderer: React.FC<TableCellRendererProps> = ({
  cellValue,
  inputValue,
}) => {
  if (typeof cellValue === "object" && cellValue.type === "function") {
    let expr = cellValue.expression; // e.g., "{input} * 2 + 6"
    if (expr.includes("{input}")) {
      if (inputValue === undefined) {
        return <Typography color="error">Missing input</Typography>;
      }
      expr = expr.replace(/{input}/g, inputValue.toString());
    }
    try {
      const result = evaluate(expr);
      return <Typography>{result}</Typography>;
    } catch (error: any) {
      return <Typography color="error">Error: {error.message}</Typography>;
    }
  }
  return <Typography>{cellValue}</Typography>;
};

export default TableCellRenderer;
