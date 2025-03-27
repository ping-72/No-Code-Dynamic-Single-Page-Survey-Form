import React, { useState, useEffect } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Paper,
  Typography,
  LinearProgress,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Button,
  CircularProgress,
  Fade,
  Zoom,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { useParams } from "react-router-dom";
import { Form, Question } from "../../interface/interface";
import testData from "../formBuilder/new file structure/testData.json";
import SectionDisplay from "./sectionDisplay";
import api from "../../config/api";

let currentFormId = "";
// Create custom styles
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f8f9ff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 12px 28px rgba(0, 0, 0, 0.15)",
    },
  },
  formHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    padding: theme.spacing(3, 4),
    borderRadius: "12px 12px 0 0",
    position: "relative",
    overflow: "hidden",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage:
        "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
    },
  },
  formTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  formDescription: {
    opacity: 0.9,
  },
  progress: {
    height: 8,
    borderRadius: 4,
    margin: theme.spacing(0, 0, 2, 0),
  },
  progressBar: {
    borderRadius: 4,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    marginBottom: theme.spacing(3),
    border: "1px solid rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    },
  },
  accordion: {
    boxShadow: "none",
    borderRadius: "12px !important",
    "&:before": {
      display: "none",
    },
    "&.Mui-expanded": {
      margin: 0,
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    },
  },
  accordionSummary: {
    borderRadius: "12px 12px 0 0",
    backgroundColor: theme.palette.grey[50],
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
    },
    "&.Mui-expanded": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
  },
  accordionDetails: {
    padding: theme.spacing(3),
    display: "block",
  },
  submitButton: {
    padding: theme.spacing(1.5, 4),
    borderRadius: "10px",
    fontWeight: 600,
    textTransform: "none",
    fontSize: "1rem",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 6px 14px rgba(0, 0, 0, 0.2)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
      transform: "translateY(1px)",
    },
  },
  errorBox: {
    backgroundColor: "#fff0f0",
    borderRadius: "12px",
    border: `1px solid ${theme.palette.error.light}`,
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(3),
    display: "flex",
    alignItems: "flex-start",
  },
  errorIcon: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(0.5),
  },
  successBox: {
    backgroundColor: "#f0fff5",
    borderRadius: "12px",
    padding: theme.spacing(4),
    textAlign: "center",
    maxWidth: 600,
    margin: "0 auto",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  },
  successIcon: {
    fontSize: 64,
    color: theme.palette.success.main,
    margin: theme.spacing(2, 0),
  },
  loadingContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

interface RouteParams extends Record<string, string | undefined> {
  userId: string;
  id: string;
}

// Define a type for form responses
type FormResponse = string | number | boolean | string[] | null;

// Define validation error type
interface ValidationError {
  questionId: string;
  message: string;
}

const FrontendDisplay: React.FC = () => {
  const { userId, id: formId } = useParams<RouteParams>();
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [formData, setFormData] = useState<Form | null>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [responses, setResponses] = useState<Record<string, FormResponse>>({});
  const [expandedSection, setExpandedSection] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // Calculate progress when responses change
  useEffect(() => {
    if (formData) {
      const totalRequiredQuestions = formData.sections.reduce(
        (count, section) => {
          return count + section.questions.filter((q) => q.isRequired).length;
        },
        0
      );

      const answeredRequiredQuestions = formData.sections.reduce(
        (count, section) => {
          return (
            count +
            section.questions.filter(
              (q) =>
                q.isRequired &&
                responses[q.questionId] !== undefined &&
                responses[q.questionId] !== null &&
                responses[q.questionId] !== ""
            ).length
          );
        },
        0
      );

      const progress =
        totalRequiredQuestions > 0
          ? (answeredRequiredQuestions / totalRequiredQuestions) * 100
          : 0;

      setProgressValue(progress);
    }
  }, [responses, formData]);

  // Fetch form data from the backend using the public endpoint
  useEffect(() => {
    const fetchForm = async () => {
      if (!formId || !userId) return;

      try {
        setLoading(true);
        setError(null);

        // Use the public endpoint to get the form
        const response = await api.get(
          `/forms/public/${formId}?userId=${userId}`
        );

        if (response.data) {
          setFormData(response.data);
          console.log("Form fetched successfully:", response.data);
          currentFormId = response.data.formId;

          // Automatically expand the first section
          if (response.data.sections && response.data.sections.length > 0) {
            setExpandedSection(response.data.sections[0].SectionId);
          }
        } else {
          throw new Error("Form not found");
        }
      } catch (err) {
        console.error("Error fetching form:", err);

        // Fallback to localStorage for development purposes
        const storedData = localStorage.getItem(formId)
          ? JSON.parse(localStorage.getItem(formId) as string)
          : null;

        if (storedData) {
          setFormData(storedData as Form);
          console.log("Using stored form data:", storedData);

          // Automatically expand the first section
          if (storedData.sections && storedData.sections.length > 0) {
            setExpandedSection(storedData.sections[0].SectionId);
          }
        } else {
          // Last resort: use test data
          setFormData(testData as Form);
          setError("Could not fetch form data. Using test data instead.");

          // Automatically expand the first section
          if (testData.sections && testData.sections.length > 0) {
            setExpandedSection(testData.sections[0].SectionId);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [userId, formId]);

  // Validate form responses
  const validateForm = (): ValidationError[] => {
    if (!formData) return [];

    const errors: ValidationError[] = [];

    // Check all questions in all sections
    formData.sections.forEach((section) => {
      section.questions.forEach((question) => {
        // Skip validation if question is not required
        if (!question.isRequired) return;

        const response = responses[question.questionId];

        // Check if required question is answered
        if (response === undefined || response === null || response === "") {
          errors.push({
            questionId: question.questionId,
            message: "This question requires an answer",
          });
        }

        // Type-specific validation
        if (response !== undefined && response !== null) {
          validateQuestionType(question, response, errors);
        }
      });
    });

    return errors;
  };

  // Validate specific question types
  const validateQuestionType = (
    question: Question,
    response: FormResponse,
    errors: ValidationError[]
  ) => {
    switch (question.type) {
      case "integer":
        if (typeof response === "string" && !/^\d+$/.test(response)) {
          errors.push({
            questionId: question.questionId,
            message: "Please enter a valid integer",
          });
        }
        break;
      case "number":
        if (typeof response === "string" && !/^\d+(\.\d+)?$/.test(response)) {
          errors.push({
            questionId: question.questionId,
            message: "Please enter a valid number",
          });
        }
        break;
      case "multi-select":
        if (!Array.isArray(response) || response.length === 0) {
          errors.push({
            questionId: question.questionId,
            message: "Please select at least one option",
          });
        }
        break;
    }
  };

  const handleResponseChange = (questionId: string, value: FormResponse) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));

    // Clear validation errors for this question when user modifies the answer
    setValidationErrors((prev) =>
      prev.filter((error) => error.questionId !== questionId)
    );
  };

  const handleSectionChange = (sectionId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_event: any, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? sectionId : false);
    };
  };

  const handleSubmit = async () => {
    // Validate form before submission
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);

      // Find the first section with errors and expand it
      if (formData) {
        const firstErrorQuestionId = errors[0].questionId;
        const sectionWithError = formData.sections.find((section) =>
          section.questions.some((q) => q.questionId === firstErrorQuestionId)
        );

        if (sectionWithError) {
          setExpandedSection(sectionWithError.SectionId);
        }
      }

      // Scroll to the top where errors are displayed
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setDisableSubmit(true);

      // Format the data according to the required structure
      const formattedSections =
        formData?.sections.map((section) => {
          // Get all questions for this section with their responses
          const sectionQuestions = section.questions.map((question) => ({
            questionId: question.questionId,
            questionType: question.type,
            response: responses[question.questionId] || null,
            // Include responseId if available (usually for updates)
            responseId: undefined,
          }));

          return {
            sectionId: section.SectionId,
            sectionTitle: section.sectionTitle,
            questions: sectionQuestions,
          };
        }) || [];

      // Prepare submission data for the public endpoint
      const submissionData = {
        userId: userId,
        formId: currentFormId,
        sections: formattedSections,
        status: "submitted",
      };

      // Log the submission data for debugging
      console.log("Submitting form data:", JSON.stringify(submissionData));

      // Submit to the public endpoint
      const response = await api.post("/data/public/submit", submissionData);

      console.log("Form submission response:", response.data);
      setSubmitSuccess(true);

      // Clear responses after successful submission
      setResponses({});
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit form. Please try again.");
    } finally {
      setDisableSubmit(false);
    }
  };

  if (loading) {
    return (
      <Fade in={loading} timeout={800}>
        <Box className={classes.loadingContainer}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" className={classes.loadingText}>
            Loading form...
          </Typography>
        </Box>
      </Fade>
    );
  }

  if (!formData) {
    return (
      <Zoom in={!formData} timeout={500}>
        <Box p={3} textAlign="center" className={classes.errorBox}>
          <ErrorIcon fontSize="large" />
          <Box>
            <Typography variant="h5" color="error" gutterBottom>
              Error: Could not load form
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        </Box>
      </Zoom>
    );
  }

  if (submitSuccess) {
    return (
      <Zoom in={submitSuccess} timeout={800}>
        <Box className={classes.successBox}>
          <CheckCircleIcon className={classes.successIcon} />
          <Typography variant="h4" color="primary" gutterBottom>
            Thank you!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Your response has been recorded successfully.
          </Typography>
          <Typography variant="body1" paragraph>
            We appreciate your time and valuable feedback.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            className={classes.submitButton}
            style={{ marginTop: theme.spacing(2) }}
          >
            Submit Another Response
          </Button>
        </Box>
      </Zoom>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Paper
        className={classes.root}
        style={{
          maxWidth: isMobile ? "100%" : isTablet ? "90%" : "80%",
          margin: isMobile ? "0.5rem auto" : "2rem auto",
          padding: 0,
        }}
      >
        {/* Form Header */}
        <Box className={classes.formHeader}>
          <Typography variant="h4" className={classes.formTitle}>
            {formData.formTitle}
          </Typography>
          {formData.description && (
            <Typography variant="body1" className={classes.formDescription}>
              {formData.description}
            </Typography>
          )}
        </Box>

        <Box p={isMobile ? 2 : 4}>
          {/* Progress bar */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="textSecondary">
                Progress
              </Typography>
              <Typography variant="body2" color="primary">
                {Math.round(progressValue)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              className={classes.progress}
              classes={{
                bar: classes.progressBar,
              }}
            />
          </Box>

          {/* Display validation errors at the top */}
          {validationErrors.length > 0 && (
            <Zoom in={validationErrors.length > 0} timeout={400}>
              <Box className={classes.errorBox} mb={3}>
                <ErrorIcon className={classes.errorIcon} />
                <Box>
                  <Typography variant="subtitle1" color="error" gutterBottom>
                    Please fix the following errors:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                    {validationErrors.map((error, index) => (
                      <li key={index}>
                        <Typography variant="body2" color="error">
                          {error.message} (Question ID: {error.questionId})
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>
            </Zoom>
          )}

          {/* Display general error */}
          {error && (
            <Zoom in={!!error} timeout={400}>
              <Box className={classes.errorBox} mb={3}>
                <ErrorIcon className={classes.errorIcon} />
                <Typography color="error">{error}</Typography>
              </Box>
            </Zoom>
          )}

          {/* Render each section */}
          {formData.sections.map((section, index) => {
            // The Introduction section is always visible.
            if (section.sectionTitle.toLowerCase() === "introduction") {
              return (
                <Zoom
                  in={true}
                  timeout={400}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  key={section.SectionId}
                >
                  <Box className={classes.section} mb={3}>
                    <Box p={isMobile ? 2 : 3}>
                      <Typography
                        variant="h5"
                        style={{
                          fontWeight: 600,
                          marginBottom: theme.spacing(2),
                          color: theme.palette.primary.main,
                        }}
                      >
                        {section.sectionTitle}
                      </Typography>

                      {section.description && (
                        <Box mb={2}>
                          <Typography variant="body1" color="textSecondary">
                            {section.description}
                          </Typography>
                          <Divider style={{ margin: theme.spacing(2, 0) }} />
                        </Box>
                      )}

                      <SectionDisplay
                        section={section}
                        responses={responses}
                        onResponseChange={handleResponseChange}
                        validationErrors={validationErrors}
                      />
                    </Box>
                  </Box>
                </Zoom>
              );
            } else {
              // Other sections are rendered as Accordions (collapsible panels)
              return (
                <Zoom
                  in={true}
                  timeout={400}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  key={section.SectionId}
                >
                  <Accordion
                    expanded={expandedSection === section.SectionId}
                    onChange={handleSectionChange(section.SectionId)}
                    className={classes.accordion}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      className={classes.accordionSummary}
                    >
                      <Typography
                        variant="h6"
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {section.sectionTitle}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails}>
                      {section.description && (
                        <Box mb={2}>
                          <Typography variant="body1" color="textSecondary">
                            {section.description}
                          </Typography>
                          <Divider style={{ margin: theme.spacing(2, 0) }} />
                        </Box>
                      )}

                      <SectionDisplay
                        section={section}
                        responses={responses}
                        onResponseChange={handleResponseChange}
                        validationErrors={validationErrors}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Zoom>
              );
            }
          })}

          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={disableSubmit}
              className={classes.submitButton}
              size={isMobile ? "medium" : "large"}
              disableElevation={false}
            >
              {disableSubmit ? (
                <>
                  <CircularProgress
                    size={24}
                    color="inherit"
                    style={{ marginRight: 10 }}
                  />
                  Submitting...
                </>
              ) : (
                "Submit Response"
              )}
            </Button>
          </Box>
        </Box>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </Paper>
    </Fade>
  );
};

export default FrontendDisplay;
