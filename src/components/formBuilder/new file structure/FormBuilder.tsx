import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
import { Toolbar } from "@material-ui/core";
import { Snackbar } from "@mui/material";
import { Alert, AlertProps } from "@mui/material";
import { SectionController } from "../formController/sectionController";
import { Form } from "../../../interface/interface";
import { useStyles } from "../formbuilderStyle";
import { HeaderBar } from "./HeaderBar";
import { Sidebar } from "./sidebar";
import { SectionEditor } from "./sectionEditor";
import FormPreview from "../../formPreview/formPreview";
import Button from "@mui/material/Button";
import api from "../../../config/api";
import { Paper, Box, TextField } from "@mui/material";
// import sampleTestData from "./sampleTestData.json";

interface RouteParams extends Record<string, string> {
  userId: string;
  id: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertProps["severity"];
}

// Extended Form interface to include _id for MongoDB
interface ExtendedForm extends Form {
  _id?: string;
}

// Define a more specific error type for API errors
type APIError = Error & {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const FormBuilder: React.FC = () => {
  const { userId, id: formId } = useParams<RouteParams>();
  const location = useLocation();
  console.log(`userId: ${userId} formId: ${formId}`);
  const classes = useStyles();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // Initialize with a blank form structure
  const [form, setForm] = useState<ExtendedForm>({
    formId: formId || "",
    formTitle: "Untitled Form",
    description: "",
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [],
  });
  const [activeSection, setActiveSection] = useState(0);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExistingForm, setIsExistingForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch form if it exists when component mounts
  useEffect(() => {
    const checkExistingForm = async () => {
      if (!userId || !formId) return;

      try {
        setIsLoading(true);
        const response = await api.get(`/forms/byFormId/${formId}`);
        if (response.data) {
          console.log("Existing form found:", response.data);
          setForm(response.data);
          setIsExistingForm(true);
        }
      } catch (error) {
        console.error("Error fetching form:", error);
        // If form doesn't exist, check if we have form data in location state
        const state = location.state as { form?: ExtendedForm } | null;
        if (state?.form) {
          console.log("Using form data from location state:", state.form);
          setForm(state.form);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingForm();
  }, [userId, formId, location.state]);

  useEffect(() => {
    // Ensure that each question gets the correct sectionId and questionId in its options.
    if (!isLoading) {
      setForm((prevForm) => {
        return {
          ...prevForm,
          sections: prevForm.sections.map((section) => {
            const updatedQuestions = section.questions.map((q) => ({
              ...q,
              sectionId: section.SectionId,
              options: q.options.map((opt) => ({
                ...opt,
                questionId: q.questionId,
              })),
            }));
            return { ...section, questions: updatedQuestions };
          }),
        };
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      console.log("Form is updated");
      localStorage.setItem(form.formId, JSON.stringify(form));
    }
  }, [form, isLoading]);

  const handleAddSection = () => {
    try {
      const updatedForm = SectionController.addSection(form);
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Section added successfully.",
        severity: "success",
      });
    } catch (err) {
      const error = err as APIError;
      setSnackbar({
        open: true,
        message: `Error adding section: ${error.message}`,
        severity: "error",
      });
    }
    setActiveSection(form.sections.length);
  };

  const handleDeleteSection = (sectionId: string) => {
    try {
      const updatedForm = SectionController.deleteSection(form, sectionId);
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Section deleted successfully.",
        severity: "success",
      });
    } catch (err) {
      const error = err as APIError;
      setSnackbar({
        open: true,
        message: `Error deleting section: ${error.message}`,
        severity: "error",
      });
    }
    setActiveSection(form.sections.length);
  };

  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    try {
      const updatedForm = SectionController.updateSectionTitle(
        form,
        sectionId,
        title
      );
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Section title updated successfully.",
        severity: "success",
      });
    } catch (err) {
      const error = err as APIError;
      setSnackbar({
        open: true,
        message: `Error updating section title: ${error.message}`,
        severity: "error",
      });
    }
  };

  // saving the form to the backend
  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Prepare form data for submission
      const formData = {
        formId: formId, // Use the formId from URL params
        userId: userId, // Include userId for validation
        formTitle: form.formTitle || "Untitled Form",
        description: form.description || "", // Ensure description is included
        order: form.order || 1,
        createdAt: form.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sections: form.sections.map((section) => ({
          SectionId: section.SectionId,
          formId: formId, // Include formId in each section
          sectionTitle: section.sectionTitle,
          description: section.description || "",
          order: section.order,
          type: section.type || "regular",
          questions: section.questions.map((question) => ({
            questionId: question.questionId,
            sectionId: section.SectionId,
            questionText: question.questionText,
            type: question.type,
            isRequired: question.isRequired,
            order: question.order,
            scaleRange: question.scaleRange,
            scaleLabels: question.scaleLabels,
            options: question.options,
            dependencies: question.dependencies || [],
          })),
        })),
      };

      console.log("Saving form data:", formData); // Add logging to debug

      let response;
      const successMessage = isExistingForm
        ? "Form updated successfully."
        : "Form saved successfully.";

      if (isExistingForm) {
        // Update existing form using formId instead of _id - use the correct route path
        response = await api.put(`/forms/byFormId/${formId}`, formData);
      } else {
        // Create new form
        response = await api.post("/forms", formData);
        // Mark as existing form after first save
        setIsExistingForm(true);
      }

      const savedForm = response.data;
      console.log("Saved form response:", savedForm); // Add logging to debug

      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      });

      // Navigate to form submission page
      setTimeout(() => {
        window.location.href = `/${userId}/${formId}/sub`;
      }, 1500);
    } catch (err) {
      const error = err as APIError;
      const errorMessage =
        error.response?.data?.message || error.message || "Error saving form";
      console.error("Error saving form:", error); // Add error logging
      setSnackbar({
        open: true,
        message: `Error saving form: ${errorMessage}`,
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSectionDescription = (sectionId: string, desc: string) => {
    try {
      const updatedForm = SectionController.updateSectionDescription(
        form,
        sectionId,
        desc
      );
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Section description updated successfully.",
        severity: "success",
      });
    } catch (err) {
      const error = err as APIError;
      setSnackbar({
        open: true,
        message: `Error updating section description: ${error.message}`,
        severity: "error",
      });
    }
  };

  if (isLoading) {
    return <div className={classes.root}>Loading form...</div>;
  }

  return (
    <div className={classes.root}>
      <HeaderBar
        onPreview={() => setIsPreview(true)}
        onSave={handleSave}
        onViewResponse={() => {}}
        isSaving={isSaving}
        isExistingForm={isExistingForm}
      />
      <Toolbar />
      <div className={classes.contentContainer}>
        <Sidebar
          sections={form.sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          handleAddSection={handleAddSection}
        />
        <div
          className={classes.mainContent}
          style={{ pointerEvents: isPreview ? "none" : "auto" }}
        >
          {/* Form Title and Description */}
          <Paper elevation={3} className={classes.formInfoPaper}>
            <Box p={3}>
              <TextField
                label="Form Title"
                fullWidth
                value={form.formTitle}
                margin="normal"
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    formTitle: e.target.value,
                    updatedAt: new Date().toISOString(),
                  }));
                }}
              />
              <TextField
                label="Form Description (Optional)"
                fullWidth
                value={form.description || ""}
                margin="normal"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                    updatedAt: new Date().toISOString(),
                  }))
                }
                multiline
                rows={2}
              />
            </Box>
          </Paper>

          {/* Form Sections */}
          {form.sections.length > 0 && activeSection < form.sections.length && (
            <SectionEditor
              form={form}
              handleUpdateSectionDescription={handleUpdateSectionDescription}
              setForm={setForm}
              section={form.sections[activeSection]}
              handleDeleteSection={handleDeleteSection}
              handleUpdateSectionTitle={handleUpdateSectionTitle}
            />
          )}
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Preview Overlay */}
      {isPreview && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "90vw",
              height: "90vh",
              backgroundColor: "white",
              overflowY: "auto",
              position: "relative",
              padding: "16px",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10000,
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setIsPreview(false)}
                style={{
                  position: "fixed",
                  top: "7vh",
                  right: "7vw",
                  borderRadius: "20px",
                  fontSize: "12px",
                  zIndex: 10000,
                }}
              >
                X
              </Button>
            </div>
            <FormPreview formData={form} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
