import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useParams } from "react-router-dom";
import api from "../config/api";

interface RouteParams extends Record<string, string | undefined> {
  userId: string;
  formId: string;
}

interface Submission {
  _id: string;
  userId: string;
  formId: string;
  data: {
    sections: Array<{
      sectionId: string;
      sectionTitle: string;
      questions: Array<{
        questionId: string;
        questionType: string;
        response: any;
        responseId?: string;
      }>;
    }>;
  };
  status: string;
  submittedAt: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: "#f8f9ff",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: theme.spacing(4),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: theme.palette.primary.light,
  },
  headerCell: {
    color: "white",
    fontWeight: 600,
  },
  statusChip: {
    margin: theme.spacing(0.5),
  },
  actionCell: {
    width: "120px",
    textAlign: "center",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
  noData: {
    textAlign: "center",
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  responseCell: {
    maxWidth: "300px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const ManageResponses: React.FC = () => {
  const { userId, formId } = useParams<RouteParams>();
  const classes = useStyles();
  const theme = useTheme();
  const _isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the public endpoint to get form submissions
        const response = await api.get(
          `/data/public/form-with-submissions/${formId}?userId=${userId}`
        );

        if (response.data && response.data.submissions) {
          setSubmissions(response.data.submissions);
        } else {
          throw new Error("No submissions data received");
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError(err.message || "Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    };

    if (userId && formId) {
      fetchSubmissions();
    }
  }, [userId, formId]);

  const handleDelete = async (submissionId: string) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      await api.delete(`/data/${formId}/${submissionId}`);
      setSubmissions((prev) =>
        prev.filter((submission) => submission._id !== submissionId)
      );
    } catch (err) {
      console.error("Error deleting submission:", err);
      alert("Failed to delete submission");
    }
  };

  const formatResponse = (response: any): string => {
    if (response === null || response === undefined) return "-";
    if (Array.isArray(response)) return response.join(", ");
    return String(response);
  };

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (submissions.length === 0) {
    return (
      <Box className={classes.noData}>
        <Typography variant="h6">No submissions found</Typography>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Box className={classes.header}>
          <Typography variant="h4" className={classes.title}>
            Form Submissions
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Total Submissions: {submissions.length}
          </Typography>
        </Box>

        <TableContainer className={classes.tableContainer}>
          <Table className={classes.table} size="medium">
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.headerCell}>Date</TableCell>
                <TableCell className={classes.headerCell}>Status</TableCell>
                <TableCell className={classes.headerCell}>Responses</TableCell>
                <TableCell className={classes.headerCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission._id}>
                  <TableCell>
                    {new Date(submission.submittedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={submission.status}
                      color={
                        submission.status === "submitted"
                          ? "primary"
                          : submission.status === "draft"
                          ? "default"
                          : "secondary"
                      }
                      className={classes.statusChip}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      {submission.data.sections.map((section) => (
                        <Box key={section.sectionId} mb={1}>
                          <Typography variant="subtitle2" color="primary">
                            {section.sectionTitle}
                          </Typography>
                          {section.questions.map((question) => (
                            <Box key={question.questionId} ml={2}>
                              <Typography variant="body2" color="textSecondary">
                                {question.questionId}:{" "}
                                <span className={classes.responseCell}>
                                  {formatResponse(question.response)}
                                </span>
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell className={classes.actionCell}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          // Implement view details functionality
                          console.log("View submission:", submission._id);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(submission._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ManageResponses;
