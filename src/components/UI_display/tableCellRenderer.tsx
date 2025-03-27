// TableCellRenderer.tsx
import React from "react";
import { Typography } from "@material-ui/core";
import { evaluate } from "mathjs";

interface FunctionValue {
  type: "function";
  expression: string;
}

type CellValue = string | number | boolean | null | FunctionValue;

interface TableCellRendererProps {
  cellValue: CellValue;
  inputValue?: number;
}

const TableCellRenderer: React.FC<TableCellRendererProps> = ({
  cellValue,
  inputValue,
}) => {
  if (cellValue === null || cellValue === undefined) {
    return <Typography color="textSecondary">-</Typography>;
  }

  if (typeof cellValue === "boolean") {
    return <Typography>{cellValue ? "Yes" : "No"}</Typography>;
  }

  if (
    typeof cellValue === "object" &&
    "type" in cellValue &&
    cellValue.type === "function"
  ) {
    let expr = cellValue.expression;
    if (expr.includes("{input}")) {
      if (inputValue === undefined) {
        return <Typography color="error">Missing input</Typography>;
      }
      expr = expr.replace(/{input}/g, inputValue.toString());
    }
    try {
      const result = evaluate(expr);
      return <Typography>{result}</Typography>;
    } catch (error) {
      return (
        <Typography color="error">Error: {(error as Error).message}</Typography>
      );
    }
  }

  return <Typography>{cellValue}</Typography>;
};

export default TableCellRenderer;
