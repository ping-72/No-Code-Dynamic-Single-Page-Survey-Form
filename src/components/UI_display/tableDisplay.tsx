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
  Box,
  FormHelperText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TableCellRenderer from "./tableCellRenderer";

// Define the structure for table data
export interface TableData {
  headers: string[];
  rows: {
    name: string;
    value: any;
  }[];
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
  data: TableData;
  onChange: (columnIndex: number) => void;
  error?: boolean;
}

const TableDisplay: React.FC<TableDisplayProps> = ({
  data,
  onChange,
  error = false,
}) => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const columnIndex = parseInt(event.target.value, 10);
    onChange(columnIndex);
  };

  return (
    <FormControl error={error} fullWidth component="fieldset">
      <Box mt={1}>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="comparison table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.headerCell}></TableCell>
                {data.headers.map((header, index) => (
                  <TableCell key={index} className={classes.headerCell}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.rows.map((row, rowIndex) => (
                <TableRow
                  key={row.name || rowIndex}
                  className={
                    rowIndex % 2 === 1 ? classes.alternateRow : undefined
                  }
                >
                  <TableCell className={classes.attributeCell}>
                    {row.name}
                  </TableCell>
                  {data.headers.map((header, colIndex) => {
                    // Handle different value structures
                    let cellValue = row.value;
                    if (typeof row.value === "object" && row.value !== null) {
                      cellValue = row.value[header] || "";
                    }

                    return (
                      <TableCell
                        key={`${row.name}-${colIndex}`}
                        className={classes.dataCell}
                      >
                        <TableCellRenderer cellValue={cellValue} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}

              <TableRow className={classes.selectRow}>
                <TableCell className={classes.attributeCell}>
                  <Typography variant="body2" color="textSecondary">
                    Select option:
                  </Typography>
                </TableCell>
                {data.headers.map((_, index) => (
                  <TableCell key={index} className={classes.selectCell}>
                    <Radio
                      checked={data.selectedColumn === index}
                      onChange={handleChange}
                      value={index}
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
      {error && <FormHelperText error>Please select an option</FormHelperText>}
    </FormControl>
  );
};

export default TableDisplay;
