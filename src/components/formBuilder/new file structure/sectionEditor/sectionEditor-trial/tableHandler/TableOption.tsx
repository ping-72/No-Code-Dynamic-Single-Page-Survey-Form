import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  // Typography,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Table,
} from "@material-ui/core";
import { Delete, Add } from "@material-ui/icons";
import {
  Attribute,
  Form,
  FunctionDependency,
  TableData,
} from "../../../../../../interface/interface";
import { v4 as uuidv4 } from "uuid";
// import { evaluate, sec } from "mathjs";
import { TableOptionController } from "../../../../formController/tablecontroller";

interface TableOptionProps {
  open: boolean;
  onClose: () => void;
  form: Form;
  sectionId: string;
  questionId: string;
  optionId?: string;
  initialData?: TableData;
  setForm: (updatedForm: Form) => void;
}

const TableOptionComponent: React.FC<TableOptionProps> = ({
  open,
  onClose,
  form,
  sectionId,
  questionId,
  optionId,
  setForm,
  initialData,
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

  useEffect(() => {
    if (!open) {
      setColumns(initialData?.columns || ["Column 1", "Column 2"]);
      setRows(
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
    }
  }, [open, initialData]);

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
    if (columns.length <= 1) return;
    const columnToDelete = columns[index];
    const updatedColumns = columns.filter((_, i) => i !== index);
    setColumns(updatedColumns);
    // Remove the corresponding column from each row's value object using destructuring
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

  // Use attributeId rather than row index
  const deleteRow = (attributeId: string) => {
    if (rows.length <= 1) return; // Ensure at least one row exists
    const updatedRows = rows.filter((row) => row.attributeId !== attributeId);
    setRows(updatedRows);
  };

  // Accept attributeId and columnName to update the specific cell
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

  // Accept attributeId instead of row index
  const updateAttributeName = (attributeId: string, attributeName: string) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.attributeId === attributeId ? { ...row, attributeName } : row
      )
    );
  };

  // Handler to update column names
  // const _updateColumnName = (columnIndex: number, columnName: string) => {
  //   const updatedColumns = [...columns];
  //   updatedColumns[columnIndex] = columnName;
  //   setColumns(updatedColumns);
  //   // Optionally, update all rows to reflect column name changes if needed
  // };

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
              // Instead of directly evaluating, we store the function dependency
              return [
                col,
                {
                  type: "function",
                  expression,
                } as FunctionDependency,
              ];
            } catch (error: any) {
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
    let updatedForm: Form;
    if (optionId) {
      updatedForm = TableOptionController.updateTableOption(
        form,
        sectionId,
        questionId,
        optionId,
        tableData
      );
    } else {
      updatedForm = TableOptionController.addTableOption(
        form,
        sectionId,
        questionId,
        tableData
      );
    }
    setForm(updatedForm);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Table Option Configuration</DialogTitle>
      <DialogContent dividers>
        {/* Header for table configuration */}
        <Box mb={2}>
          {/* <Button
            variant="outlined"
            color="secondary"
            startIcon={<Delete />}
            onClick={onDelete}
          >
            Delete Table Option
          </Button> */}
        </Box>

        {/* Table for columns and rows */}
        <Paper variant="outlined" style={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Attribute Name</TableCell>
                {columns.map((col, index) => (
                  <TableCell key={index}>
                    <TextField
                      label={`Column ${index + 1}`}
                      value={col}
                      onChange={(e) => {
                        const updatedColumns = [...columns];
                        updatedColumns[index] = e.target.value;
                        setColumns(updatedColumns);
                      }}
                    />
                    <IconButton
                      onClick={() => deleteColumn(index)}
                      color="secondary"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={addColumn} color="primary">
                    <Add />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.attributeId}>
                  <TableCell>
                    <TextField
                      label="Attribute Name"
                      value={row.attributeName}
                      onChange={(e) =>
                        updateAttributeName(row.attributeId, e.target.value)
                      }
                    />
                    <IconButton
                      onClick={() => deleteRow(row.attributeId)}
                      color="secondary"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                  {columns.map((col, index) => (
                    <TableCell key={index}>
                      <TextField
                        label={col}
                        value={
                          typeof row.value === "object"
                            ? row.value[col] || ""
                            : ""
                        }
                        onChange={(e) =>
                          updateCellValue(row.attributeId, col, e.target.value)
                        }
                        helperText='For functions, prefix with "fn:"'
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Button to add a new row */}
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Add />}
            onClick={addRow}
          >
            Add Attribute
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Table Option
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableOptionComponent;
