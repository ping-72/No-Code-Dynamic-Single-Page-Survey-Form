import React, { useEffect, useState } from "react";
import "./template.css";
import { v1 as uuidv1 } from "uuid";
import { Add, Edit, Visibility, MoreVert } from "@material-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconButton,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Box,
  Divider,
} from "@material-ui/core";
import DashboardHeader from "./DashboardHeader";
import api from "../../config/api";
import testData from "../formBuilder/new file structure/testData.json";

const Template: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await api.get("/forms");
        setForms(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError("Failed to load forms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchForms();
    }
  }, [userId]);

  const createFormHandle = () => {
    const id = uuidv1();
    // Create a blank form with default structure
    const blankForm = {
      _id: id,
      formId: id,
      formTitle: "Untitled Form",
      description: "",
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [], // Empty sections array
    };
    console.log("Creating blank form:", blankForm);
    navigate(`/${userId}/${id}/edit`, {
      state: {
        form: blankForm,
        isNewForm: true,
      },
    });
  };

  const handleSampleForm = () => {
    const id = uuidv1();
    // Create a form using testData.json structure
    const sampleForm = {
      ...testData,
      formId: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    navigate(`/${userId}/${id}/edit`, { state: { form: sampleForm } });
  };

  const handleEditForm = (formId: string) => {
    navigate(`/${userId}/${formId}/edit`);
  };

  const handleViewResponses = (formId: string) => {
    navigate(`/${userId}/${formId}/responses`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box className="template-container">
      <DashboardHeader />
      <Box className="template-content">
        <Box className="template-header">
          <Typography variant="h4" component="h1" className="template-title">
            Forms Dashboard
          </Typography>
          <Box className="template-actions">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={createFormHandle}
              className="create-form-button"
            >
              Create New Form
            </Button>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Box className="template-main">
          {loading ? (
            <Box className="loading-container">
              <CircularProgress />
              <Typography variant="body1" className="loading-text">
                Loading your forms...
              </Typography>
            </Box>
          ) : error ? (
            <Card className="error-card">
              <CardContent>
                <Typography color="error" variant="h6">
                  {error}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Test Form Section */}
              <hr />
              <br />
              <Box className="section-container">
                <Typography variant="h5" gutterBottom>
                  Template Forms
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card className="form-card">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Sample Survey Form
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          A sample form to demonstrate the form builder
                          capabilities
                        </Typography>
                        <Box className="form-actions">
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Visibility />}
                            onClick={handleSampleForm}
                            className="action-button"
                          >
                            Use Template
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <Divider style={{ margin: "2rem 0" }} />

              {/* Previous Forms Section */}
              <Box className="section-container">
                <Typography variant="h5" gutterBottom>
                  Your Forms
                </Typography>
                {forms.length === 0 ? (
                  <Card className="empty-state-card">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        No Forms Found
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        Get started by creating your first form!
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={createFormHandle}
                        className="create-first-form-button"
                      >
                        Create Your First Form
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Grid container spacing={3}>
                    {forms.map((form) => (
                      <Grid item xs={12} sm={6} md={4} key={form._id}>
                        <Card className="form-card">
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {form.formTitle}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              gutterBottom
                            >
                              Created: {formatDate(form.createdAt)}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              gutterBottom
                            >
                              Last updated: {formatDate(form.updatedAt)}
                            </Typography>
                            <Box className="form-actions">
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() => handleEditForm(form.formId)}
                                className="action-button"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<Visibility />}
                                onClick={() => handleViewResponses(form._id)}
                                className="action-button"
                              >
                                View Responses
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Template;
interface Form {
  _id: string;
  formId: string;
  formTitle: string;
  createdAt: string;
  updatedAt: string;
}
