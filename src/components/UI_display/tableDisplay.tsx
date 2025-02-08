// TableDisplay.tsx
import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography,
  Radio,
} from "@material-ui/core";
import { TableData } from "../../interface/interface";
import TableCellRenderer from "./tableCellRenderer";

interface TableDisplayProps {
  tableData: TableData;
  inputValue?: number;
  onRadioChange: (value: any) => void;
  selectedValue: string;
}

const TableDisplay: React.FC<TableDisplayProps> = ({
  tableData,
  inputValue,
  onRadioChange,
  selectedValue,
}) => {
  return (
    <Paper
      variant="outlined"
      style={{ padding: "8px", marginBottom: "8px", overflowX: "auto" }}
    >
      <Typography variant="subtitle1" gutterBottom>
        Table Preview:
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {tableData.columns.map((col, idx) => (
              <TableCell key={idx} align="center">
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.rows.map((row) => (
            <TableRow key={row.attributeId}>
              <TableCell>{row.attributeName}</TableCell>
              {tableData.columns.map((col, idx) => (
                <TableCell key={idx} align="center">
                  <TableCellRenderer
                    cellValue={row.value[col]}
                    inputValue={inputValue}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
          {/* Additional row for radio buttons */}
          <TableRow>
            <TableCell>
              <Typography variant="body2" color="textSecondary">
                Select:
              </Typography>
            </TableCell>
            {tableData.columns.map((col, idx) => (
              <TableCell key={idx} align="center">
                <Radio
                  color="primary"
                  value={col}
                  checked={selectedValue === col}
                  onChange={(e) => onRadioChange(e.target.value)}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TableDisplay;
