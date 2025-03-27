// TableDisplay.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  Typography,
  FormControl,
  FormHelperText,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TableCellRenderer from "./tableCellRenderer";

export interface Attribute {
  name: string;
  value: string | number | boolean | null;
}

// Define the structure for table data
export interface TableData {
  headers: string[];
  rows: Attribute[];
  selectedColumn?: number;
}

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: theme.spacing(2),
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
    },
  },
  table: {
    tableLayout: "fixed",
  },
  headerCell: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    padding: theme.spacing(1.5),
    fontSize: "0.9rem",
    textAlign: "center",
    borderRight: `1px solid rgba(224, 224, 224, 0.4)`,
    "&:last-child": {
      borderRight: "none",
    },
  },
  attributeCell: {
    backgroundColor: theme.palette.grey[50],
    fontWeight: 500,
    padding: theme.spacing(1.5),
    minWidth: 150,
  },
  dataCell: {
    position: "relative",
    padding: theme.spacing(1.5),
    textAlign: "center",
  },
  selectRow: {
    backgroundColor: theme.palette.background.default,
  },
  selectCell: {
    textAlign: "center",
    padding: theme.spacing(1),
  },
  radioCell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    marginTop: theme.spacing(1),
    textAlign: "center",
  },
  alternateRow: {
    backgroundColor: theme.palette.grey[50],
  },
}));

interface TableDisplayProps {
  tableData: TableData;
  selectedValue: string;
  onRadioChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string | null;
}

const TableDisplay: React.FC<TableDisplayProps> = ({
  tableData,
  selectedValue,
  onRadioChange,
  error = false,
  errorMessage = null,
}) => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRadioChange(event.target.value);
  };

  return (
    <FormControl error={error} fullWidth component="fieldset">
      <Box mt={1}>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="comparison table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerCell}></TableCell>
                {tableData.headers.map((column, index) => (
                  <TableCell key={index} className={classes.headerCell}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Attribute rows */}
              {tableData.rows.map((row, rowIndex) => (
                <TableRow
                  key={row.name || rowIndex}
                  className={
                    rowIndex % 2 === 1 ? classes.alternateRow : undefined
                  }
                >
                  <TableCell className={classes.attributeCell}>
                    {row.name}
                  </TableCell>
                  {tableData.headers.map((column, colIndex) => (
                    <TableCell
                      key={`${row.name}-${colIndex}`}
                      className={classes.dataCell}
                    >
                      <TableCellRenderer cellValue={row.value} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Selection row with radio buttons */}
              <TableRow className={classes.selectRow}>
                <TableCell className={classes.attributeCell}>
                  <Typography variant="body2" color="textSecondary">
                    Select option:
                  </Typography>
                </TableCell>
                {tableData.headers.map((column, index) => (
                  <TableCell key={index} className={classes.selectCell}>
                    <Radio
                      checked={selectedValue === column}
                      onChange={handleChange}
                      value={column}
                      name="column-selection"
                      color="primary"
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </FormControl>
  );
};

export default TableDisplay;
