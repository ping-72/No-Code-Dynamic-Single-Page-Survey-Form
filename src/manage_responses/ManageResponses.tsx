import React, { useState, useEffect } from "react";
import {
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
  Tabs,
  Tab,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useParams } from "react-router-dom";
import api from "../config/api";
import ResponseVisualization from "./components/ResponseVisualization";
import "./ManageResponses.css";

interface RouteParams extends Record<string, string | undefined> {
  userId: string;
  formId: string;
}

interface QuestionResponse {
  questionId: string;
  questionText: string;
  questionType: string;
  response: string | number | boolean | string[] | null;
  responseId?: string;
  options?: Array<{ optionId: string; value: string }>;
}

interface Submission {
  _id: string;
  userId: string;
  formId: string;
  data: {
    sections: Array<{
      sectionId: string;
      sectionTitle: string;
      questions: QuestionResponse[];
    }>;
  };
  status: string;
  submittedAt: string;
}

interface FormData {
  form: {
    formId: string;
    formTitle: string;
    sections: Array<{
      SectionId: string;
      sectionTitle: string;
      questions: Array<{
        questionId: string;
        questionText: string;
        type: string;
        options?: Array<{
          optionId: string;
          value: string;
        }>;
      }>;
    }>;
  };
  submissions: Submission[];
  count: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
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
  tabs: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: theme.spacing(3),
  },
  tab: {
    textTransform: "none",
    fontWeight: 500,
  },
  sectionChip: {
    margin: theme.spacing(0.5),
    "&.MuiChip-root": {
      cursor: "pointer",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
      },
    },
  },
}));

const ManageResponses: React.FC = () => {
  const { userId, formId } = useParams<RouteParams>();
  const classes = useStyles();
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedSection, setSelectedSection] = useState<string>("");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          `/data/public/form-with-submissions/${formId}?userId=${userId}`
        );

        if (response.data) {
          setFormData(response.data);
        } else {
          throw new Error("No form data received");
        }
      } catch (err: unknown) {
        console.error("Error fetching form data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch form data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId && formId) {
      fetchFormData();
    }
  }, [userId, formId]);

  const handleDelete = async (submissionId: string) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      await api.delete(`/data/${formId}/${submissionId}`);
      setFormData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          submissions: prev.submissions.filter(
            (submission) => submission._id !== submissionId
          ),
          count: prev.count - 1,
        };
      });
    } catch (err) {
      console.error("Error deleting submission:", err);
      alert("Failed to delete submission");
    }
  };

  const formatResponse = (response: QuestionResponse["response"]): string => {
    if (response === null || response === undefined) return "-";
    if (Array.isArray(response)) return response.join(", ");
    return String(response);
  };

  const handleTabChange = (
    event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  // Get all sections from form data
  const sections = formData?.form.sections || [];

  // Get questions for the selected section
  const getQuestionsForSection = (sectionId: string) => {
    if (!formData) return [];
    return (
      formData.form.sections.find((section) => section.SectionId === sectionId)
        ?.questions || []
    );
  };

  // Get responses for a specific section and question
  const getSectionQuestionResponses = (
    sectionId: string,
    questionId: string
  ) => {
    if (!formData) return [];
    return formData.submissions.flatMap((submission) =>
      submission.data.sections
        .filter((section) => section.sectionId === sectionId)
        .flatMap((section) =>
          section.questions
            .filter((q) => q.questionId === questionId)
            .map((question) => ({
              ...question,
              sectionTitle: section.sectionTitle,
            }))
        )
    );
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

  if (!formData || formData.submissions.length === 0) {
    return (
      <Box className={classes.noData}>
        <Typography variant="h6">No submissions found</Typography>
      </Box>
    );
  }

  return (
    <Box className="response-container">
      <Box className="response-header">
        <Typography className="response-title">
          {formData?.form.formTitle}
        </Typography>
        <Typography className="response-subtitle">
          Total Submissions: {formData?.count}
        </Typography>
      </Box>

      <Box className="tabs-container">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Table View" className="tab" />
          <Tab label="Visualizations" className="tab" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box className="section-selector">
          <Typography variant="subtitle1" gutterBottom>
            Select Section:
          </Typography>
          <Box className="section-chips">
            {sections.map((section) => (
              <Chip
                key={section.SectionId}
                label={section.sectionTitle}
                onClick={() => setSelectedSection(section.SectionId)}
                className={`section-chip ${
                  selectedSection === section.SectionId ? "selected" : ""
                }`}
              />
            ))}
          </Box>
        </Box>

        {selectedSection ? (
          <TableContainer>
            <Table className="response-table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Responses</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData?.submissions.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell>
                      {new Date(submission.submittedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={submission.status}
                        className={`status-chip ${
                          submission.status === "submitted"
                            ? "submitted"
                            : "draft"
                        }`}
                      />
                    </TableCell>
                    <TableCell>
                      {submission.data.sections
                        .filter(
                          (section) => section.sectionId === selectedSection
                        )
                        .map((section) => (
                          <Box key={section.sectionId}>
                            {section.questions.map((question) => (
                              <Box
                                key={question.questionId}
                                className="response-cell"
                              >
                                <span className="question-text">
                                  {question.questionText}:
                                </span>
                                <span className="response-value">
                                  {formatResponse(question.response)}
                                </span>
                              </Box>
                            ))}
                          </Box>
                        ))}
                    </TableCell>
                    <TableCell>
                      <Box className="action-buttons">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="primary"
                            className="action-button"
                            onClick={() => {
                              console.log("View submission:", submission._id);
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            className="action-button"
                            onClick={() => handleDelete(submission._id)}
                            style={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box className="no-data">
            <Typography className="no-data-text">
              Please select a section to view responses
            </Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {selectedSection ? (
          getQuestionsForSection(selectedSection).map((question) => (
            <ResponseVisualization
              key={question.questionId}
              questionId={question.questionId}
              questionText={question.questionText}
              questionType={question.type}
              responses={getSectionQuestionResponses(
                selectedSection,
                question.questionId
              ).map((response) => response.response)}
              options={question.options}
            />
          ))
        ) : (
          <Box className="no-data">
            <Typography className="no-data-text">
              Please select a section to view visualizations
            </Typography>
          </Box>
        )}
      </TabPanel>
    </Box>
  );
};

export default ManageResponses;
