// src/components/TableOptionComponent.tsx

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Paper,
} from "@material-ui/core";
import { Delete, Add } from "@material-ui/icons";
import {
  Attribute,
  FunctionDependency,
  TableData,
} from "../../../../../../interface/interface";
import { v4 as uuidv4 } from "uuid";
import { evaluate } from "mathjs";

interface TableOptionProps {
  initialData?: TableData;
  onSave: (data: TableData) => void;
  onDelete: () => void;
}

const TableOptionComponent: React.FC<TableOptionProps> = ({
  initialData,
  onSave,
  onDelete,
}) => {
  // Use a single useState import (duplicate removed)
  const [columns, setColumns] = useState<string[]>(
    initialData?.columns || ["Column 1", "Column 2"]
  );
  const [rows, setRows] = useState<Attribute[]>(
    initialData?.rows || [
      {
        attributeId: uuidv4(),
        attributeName: "Attribute 1",
        value: {
          "Column 1": "",
          "Column 2": "",
        },
      },
    ]
  );

  // Handler to add a new column
  const addColumn = () => {
    const newColumnName = `Column ${columns.length + 1}`;
    setColumns([...columns, newColumnName]);
    // Corrected: Initialize the new column with empty string values for each row
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        value: { ...(row.value as Record<string, any>), [newColumnName]: "" },
      }))
    );
  };

  // Handler to delete a column
  const deleteColumn = (index: number) => {
    if (columns.length <= 1) return; // Ensure at least one column exists
    const columnToDelete = columns[index];
    const updatedColumns = columns.filter((_, i) => i !== index);
    setColumns(updatedColumns);
    // Corrected: Remove the corresponding column from each row's value object using destructuring
    setRows((prevRows) =>
      prevRows.map((row) => {
        const { [columnToDelete]: _, ...updatedValue } = row.value as Record<
          string,
          any
        >;
        return { ...row, value: updatedValue };
      })
    );
  };

  // Handler to add a new row
  const addRow = () => {
    // Corrected: Initialize new row's value as an object with keys for all existing columns
    const newRow: Attribute = {
      attributeId: uuidv4(),
      attributeName: `Attribute ${rows.length + 1}`,
      value: columns.reduce<
        Record<string, string | number | FunctionDependency>
      >((acc, col) => {
        acc[col] = "";
        return acc;
      }, {}),
    };
    setRows([...rows, newRow]);
  };

  // Handler to delete a row
  // Corrected: Use attributeId rather than row index
  const deleteRow = (attributeId: string) => {
    if (rows.length <= 1) return; // Ensure at least one row exists
    const updatedRows = rows.filter((row) => row.attributeId !== attributeId);
    setRows(updatedRows);
  };

  // Handler to update cell values
  // Corrected: Accept attributeId and columnName to update the specific cell
  const updateCellValue = (
    attributeId: string,
    columnName: string,
    value: any
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.attributeId === attributeId) {
          const updatedValue = { ...(row.value as Record<string, any>) };
          updatedValue[columnName] = value;
          return { ...row, value: updatedValue };
        }
        return row;
      })
    );
  };

  // Handler to update attribute names
  // Corrected: Accept attributeId instead of row index
  const updateAttributeName = (attributeId: string, attributeName: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.attributeId === attributeId ? { ...row, attributeName } : row
      )
    );
  };

  // Handler to update column names
  const updateColumnName = (columnIndex: number, columnName: string) => {
    const updatedColumns = [...columns];
    updatedColumns[columnIndex] = columnName;
    setColumns(updatedColumns);
    // Optionally, update all rows to reflect column name changes if needed
  };

  // Handler to save the table data
  const handleSave = () => {
    // Corrected: Parse each cell; if it starts with "fn:" then convert it into a FunctionDependency object.
    const preparedRows: Attribute[] = rows.map((row) => ({
      attributeId: row.attributeId,
      attributeName: row.attributeName,
      value: Object.fromEntries(
        columns.map((col) => {
          const cellValue = row.value[col];
          if (typeof cellValue === "string" && cellValue.startsWith("fn:")) {
            const expression = cellValue.slice(3).trim();
            try {
              // Evaluate the function if needed; here we store the function dependency object.
              // Optionally, you might want to store the evaluated result as well.
              return [
                col,
                {
                  type: "function",
                  expression,
                } as FunctionDependency,
              ];
            } catch (error) {
              return [col, "Error"];
            }
          }
          return [col, cellValue];
        })
      ),
    }));

    const tableData: TableData = {
      rows: preparedRows,
      columns,
    };
    onSave(tableData);
  };

  return (
    <Paper
      style={{
        padding: "16px",
        marginTop: "16px",
        margin: "4px",
        overflowX: "auto",
        boxShadow: "1px 1px 1px 4px rgba(0, 0, 0, 0.1) !important",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Table Option Configuration
      </Typography>

      {/* Delete Table Option Button */}
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<Delete />}
          onClick={onDelete}
        >
          Delete Table Option
        </Button>
      </Box>

      {/* Table Header */}
      <Box display="flex" alignItems="center" mb={2}>
        {columns.map((col, index) => (
          <Box key={index} flex={1} mr={1}>
            <TextField
              label={`Column ${index + 1}`}
              value={col}
              onChange={(e) => {
                const updatedColumns = [...columns];
                updatedColumns[index] = e.target.value;
                setColumns(updatedColumns);
                // Optionally, update all rows to reflect column name changes
              }}
              fullWidth
            />
          </Box>
        ))}
        <IconButton onClick={addColumn} color="primary">
          <Add />
        </IconButton>
        {columns.length > 1 && (
          <IconButton
            onClick={() => deleteColumn(columns.length - 1)}
            color="secondary"
          >
            <Delete />
          </IconButton>
        )}
      </Box>

      {/* Table Rows */}
      {rows.map((row) => (
        <Box key={row.attributeId} display="flex" alignItems="center" mb={2}>
          {/* Attribute Name */}
          <Box flex={1} mr={1}>
            <TextField
              label="Attribute Name"
              value={row.attributeName}
              onChange={(e) =>
                updateAttributeName(row.attributeId, e.target.value)
              }
              fullWidth
            />
          </Box>

          {/* Cell Values */}
          {columns.map((col) => (
            <Box key={col} flex={1} mr={1}>
              <TextField
                label={col}
                value={
                  typeof row.value === "object" ? row.value[col] || "" : ""
                }
                onChange={(e) =>
                  updateCellValue(row.attributeId, col, e.target.value)
                }
                fullWidth
                helperText={
                  'For functions, prefix with "fn:". E.g., fn: previousQuestionId + 5'
                }
              />
            </Box>
          ))}

          {/* Delete Row Button */}
          {rows.length > 1 && (
            <Box>
              <IconButton
                onClick={() => deleteRow(row.attributeId)}
                color="secondary"
              >
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>
      ))}

      <br />
      {/* Add Row Button */}
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          onClick={addRow}
        >
          Add Attribute
        </Button>
      </Box>
      <br />

      {/* Save Button */}
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Table Option
        </Button>
      </Box>
    </Paper>
  );
};

export default TableOptionComponent;
