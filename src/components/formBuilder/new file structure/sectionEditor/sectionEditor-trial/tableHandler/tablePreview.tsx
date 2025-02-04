// src/components/TablePreview.tsx

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
import { TableData } from "../../../../../../interface/interface";

interface TablePreviewProps {
  tableData: TableData;
}

const TablePreview: React.FC<TablePreviewProps> = ({ tableData }) => {
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
            <TableCell>Attribute Name</TableCell>
            {tableData.columns.map((col, index) => (
              <TableCell key={index}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.rows.map((row) => (
            <TableRow key={row.attributeId}>
              <TableCell>{row.attributeName}</TableCell>
              {tableData.columns.map((col, index) => (
                <TableCell key={index}>
                  {row.value[col] || ""}
                  {/* {typeof row.value === "object" ? row.value[col] || "" : ""} */}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TablePreview;
