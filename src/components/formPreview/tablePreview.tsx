import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography,
} from "@material-ui/core";
import { TableData } from "../../interface/interface";
import TableCellRenderer from "./tableCellRender";

interface TablePreviewProps {
  tableData: TableData;
  inputValue?: number; // The value to substitute for function placeholders
  children?: React.ReactNode;
}

const TablePreview: React.FC<TablePreviewProps> = ({
  tableData,
  inputValue,
  children,
}) => {
  return (
    <Paper
      variant="outlined"
      style={{ padding: "8px", marginBottom: "8px", overflowX: "auto" }}
    >
      <Typography variant="subtitle1" gutterBottom></Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {tableData.columns.map((col, index) => (
              <TableCell key={index} align="center">
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.rows.map((row) => (
            <TableRow key={row.attributeId}>
              <TableCell>{row.attributeName}</TableCell>
              {tableData.columns.map((col, index) => (
                <TableCell key={index} align="center">
                  <TableCellRenderer
                    cellValue={row.value[col]}
                    inputValue={inputValue}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
          {/* Render any additional rows passed as children */}
          {children}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TablePreview;
