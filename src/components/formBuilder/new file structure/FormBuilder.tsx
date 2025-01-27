import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Toolbar } from "@material-ui/core";
// import Snackbar from "@material-ui/core";
import Snackbar from "@mui/material";
import { Alert } from "@mui/material";

import { SectionController } from "../formController/sectionController";
import { Form } from "../../../interface/interface";

// import { FormController } from "../formController/formcontroller";
import { useStyles } from "../formbuilderStyle";
import { HeaderBar } from "./HeaderBar";
import { Sidebar } from "./sidebar";
import { SectionEditor } from "./sectionEditor";

const FormBuilder: React.FC = () => {
  const { id: formId } = useParams<{ id: string }>();
  const classes = useStyles();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [responses, setResponses] = useState<Record<string, string>>({});
  // const handleAnswerChange = (questionId: string, answer: string) => {
  //   setResponses((prev) => ({ ...prev, [questionId]: answer }));
  // };

  const [form, setForm] = useState<Form>({
    formId: formId || uuidv4(),
    formTitle: "",
    description: "",
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        SectionId: uuidv4(),
        formId: formId || "",
        sectionTitle: "Introduction",
        description:
          "Provide the title, description and optionally an image for the form.",
        questions: [],
        order: 0,
        createdAt: new Date().toISOString(),
      },
      {
        SectionId: uuidv4(),
        formId: formId || "",
        sectionTitle: "Socio-Demographic Information",
        description:
          "Provide the title, description and optionally an image for the form.",
        questions: [
          {
            questionId: uuidv4(),
            sectionId: "",
            questionText: "What is your age?",
            type: "number",
            isRequired: true,
            dependencies: [],
            order: 0,
            createdAt: new Date().toISOString(),
            options: [],
          },
          {
            questionId: uuidv4(),
            sectionId: "",
            questionText: "What is your occupation?",
            type: "single-select",
            isRequired: true,
            dependencies: [],
            order: 1,
            createdAt: new Date().toISOString(),
            options: [
              {
                optionId: "student",
                questionId: "",
                type: "normal",
                value: "Student",
              },
              {
                optionId: "business",
                questionId: "",
                type: "normal",
                value: "Business",
              },
              {
                optionId: "govt_employee",
                questionId: "",
                value: "Government Employee",
                type: "normal",
              },
              {
                optionId: "service_sector",
                questionId: "",
                value: "Service Sector",
                type: "normal",
              },
            ],
          },
        ],
        order: 1,
        createdAt: new Date().toISOString(),
      },
    ],
  });

  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
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

  // Handler functions (same as original)
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
    // setForm((prev) => FormController.addSection(prev));
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
    // setForm((prev) => FormController.deleteSection(prev, sectionId));
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

  return (
    <div className={classes.root}>
      <HeaderBar />
      <Toolbar />
      <div className={classes.contentContainer}>
        <Sidebar
          sections={form.sections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          handleAddSection={handleAddSection}
        />
        <div className={classes.mainContent}>
          {form.sections.length > 0 && activeSection < form.sections.length && (
            <SectionEditor
              form={form}
              setForm={setForm}
              section={form.sections[activeSection]}
              responses={responses}
              handleDeleteSection={handleDeleteSection}
              handleUpdateSectionTitle={handleUpdateSectionTitle}
            />
          )}
        </div>
      </div>
      {/* Notification */}
      {/* <Snackbar
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
      </Snackbar> */}
    </div>
  );
};

export default FormBuilder;
