import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Toolbar } from "@material-ui/core";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { SectionController } from "../formController/sectionController";
import { Form } from "../../../interface/interface";
import { useStyles } from "../formbuilderStyle";
import { HeaderBar } from "./HeaderBar";
import { Sidebar } from "./sidebar";
import { SectionEditor } from "./sectionEditor";
import FormPreview from "../../formPreview/formPreview";
import Button from "@mui/material/Button";
import testData from "./testData.json";
// import sampleTestData from "./sampleTestData.json";

interface RouteParams {
  userId: string;
  id: string;
}

const FormBuilder: React.FC = () => {
  const { userId, id: formId } = useParams<RouteParams>();
  const classes = useStyles();

  // const userId = localStorage.getItem("userId");
  // const userId = "user123";

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState<Form>(testData as Form);
  // const [form, setForm] = useState<Form>(sampleTestData as Form);
  const [activeSection, setActiveSection] = useState(0);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  useEffect(() => {
    // Ensure that each question gets the correct sectionId and questionId in its options.
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
  }, []);

  useEffect(() => {
    console.log("Form is updated");
    localStorage.setItem(form.formId, JSON.stringify(form));
  }, [form]);

  const handleAddSection = () => {
    try {
      const updatedForm = SectionController.addSection(form);
      setForm(updatedForm);
      setSnackbar({
        open: true,
        message: "Section added successfully.",
        severity: "success",
      });
    } catch (err: Error | any) {
      setSnackbar({
        open: true,
        message: `Error adding section: ${err.message}`,
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
    } catch (err: Error | any) {
      setSnackbar({
        open: true,
        message: `Error deleting section: ${err.message}`,
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
    } catch (err: Error | any) {
      setSnackbar({
        open: true,
        message: `Error updating section title: ${err.message}`,
        severity: "error",
      });
    }
  };

  // saving the form to the backend Route , later to be changed to env backend url
  const handleSave = async () => {
    try {
      // const response = await fetch("/api/saveForm", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(form),
      // });
      // if (!response.ok) {
      //   throw new Error("Failed to save form");
      // }
      // const savedForm = await response.json();
      // console.log("Saved form:", savedForm);
      setSnackbar({
        open: true,
        message: "Form saved successfully.",
        severity: "success",
      });
      window.location.href = `/${userId}/${formId}/sub`;
    } catch (err: Error | any) {
      setSnackbar({
        open: true,
        message: `Error saving form: ${err.message}`,
        severity: "error",
      });
    }
  };

  const handleViewResponse = () => {
    window.location.href = `/${userId}/${formId}/resp`;
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
    } catch (err: Error | any) {
      setSnackbar({
        open: true,
        message: `Error updating section description: ${err.message}`,
        severity: "error",
      });
    }
  };
  return (
    <div className={classes.root}>
      <HeaderBar
        onPreview={() => setIsPreview(true)}
        onSave={() => handleSave()}
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
          // severity={snackbar.severity}
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
