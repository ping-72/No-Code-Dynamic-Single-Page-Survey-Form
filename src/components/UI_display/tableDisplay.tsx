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
  useTheme,
  useMediaQuery,
  Box,
} from "@material-ui/core";
import { TableData } from "../../interface/interface";
import TableCellRenderer from "./tableCellRenderer";

interface TableDisplayProps {
  tableData: TableData;
  inputValue?: number;
  onRadioChange: (value: string) => void;
  selectedValue: string;
}

const TableDisplay: React.FC<TableDisplayProps> = ({
  tableData,
  inputValue,
  onRadioChange,
  selectedValue,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      style={{
        width: "100%",
        overflowX: "auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <Paper
        variant="outlined"
        style={{
          padding: isMobile ? "4px" : isTablet ? "6px" : "8px",
          marginBottom: isMobile ? "4px" : "8px",
          boxShadow: "none",
          border: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Typography
          variant={isMobile ? "body1" : "subtitle1"}
          gutterBottom
          style={{
            fontSize: isMobile ? "0.875rem" : isTablet ? "1rem" : "1.1rem",
            fontWeight: 500,
            padding: isMobile ? "4px 8px" : "8px 16px",
          }}
        >
          Table Preview:
        </Typography>
        <Table
          size={isMobile ? "small" : "medium"}
          style={{
            minWidth: isMobile ? 300 : isTablet ? 400 : 500,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  padding: isMobile ? "8px 4px" : "12px 8px",
                  fontSize: isMobile
                    ? "0.75rem"
                    : isTablet
                    ? "0.875rem"
                    : "1rem",
                  fontWeight: 600,
                }}
              />
              {tableData.columns.map((col, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  style={{
                    padding: isMobile ? "8px 4px" : "12px 8px",
                    fontSize: isMobile
                      ? "0.75rem"
                      : isTablet
                      ? "0.875rem"
                      : "1rem",
                    fontWeight: 600,
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.rows.map((row) => (
              <TableRow
                key={row.attributeId}
                style={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell
                  style={{
                    padding: isMobile ? "8px 4px" : "12px 8px",
                    fontSize: isMobile
                      ? "0.75rem"
                      : isTablet
                      ? "0.875rem"
                      : "1rem",
                  }}
                >
                  {row.attributeName}
                </TableCell>
                {tableData.columns.map((col, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    style={{
                      padding: isMobile ? "8px 4px" : "12px 8px",
                      fontSize: isMobile
                        ? "0.75rem"
                        : isTablet
                        ? "0.875rem"
                        : "1rem",
                    }}
                  >
                    <TableCellRenderer
                      cellValue={row.value[col]}
                      inputValue={inputValue}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {/* Radio buttons row */}
            <TableRow>
              <TableCell
                style={{
                  padding: isMobile ? "8px 4px" : "12px 8px",
                  fontSize: isMobile
                    ? "0.75rem"
                    : isTablet
                    ? "0.875rem"
                    : "1rem",
                }}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{
                    fontSize: isMobile
                      ? "0.75rem"
                      : isTablet
                      ? "0.875rem"
                      : "1rem",
                  }}
                >
                  Select:
                </Typography>
              </TableCell>
              {tableData.columns.map((col, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  style={{
                    padding: isMobile ? "8px 4px" : "12px 8px",
                  }}
                >
                  <Radio
                    color="primary"
                    value={col}
                    checked={selectedValue === col}
                    onChange={(e) => onRadioChange(e.target.value)}
                    size={isMobile ? "small" : "medium"}
                    style={{
                      padding: isMobile ? 4 : 8,
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default TableDisplay;
