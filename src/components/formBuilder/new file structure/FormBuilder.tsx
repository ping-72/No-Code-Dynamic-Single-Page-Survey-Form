import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Toolbar } from "@material-ui/core";

import { Form } from "../../../interface/interface";
import { FormController } from "../formController/formcontroller";
import { useStyles } from "../formbuilderStyle";
import { HeaderBar } from "./HeaderBar";
import { Sidebar } from "./sidebar";
import { SectionEditor } from "./sectionEditor";

const FormBuilder: React.FC = () => {
  const { id: formId } = useParams<{ id: string }>();
  const classes = useStyles();

  const [responses, setResponses] = useState<Record<string, string>>({});
  const handleAnswerChange = (questionId: string, answer: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: answer }));
  };

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
        question: [],
        order: 0,
        createdAt: new Date().toISOString(),
      },
      {
        SectionId: uuidv4(),
        formId: formId || "",
        sectionTitle: "Socio-Demographic Information",
        description:
          "Provide the title, description and optionally an image for the form.",
        question: [
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
              { optionId: "student", questionId: "", value: "Student" },
              { optionId: "business", questionId: "", value: "Business" },
              {
                optionId: "govt_employee",
                questionId: "",
                value: "Government Employee",
              },
              {
                optionId: "service_sector",
                questionId: "",
                value: "Service Sector",
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
          const updatedQuestions = section.question.map((q) => ({
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
  const handleAddSection = () =>
    setForm((prev) => FormController.addSection(prev));
  const handleDeleteSection = (sectionId: string) =>
    setForm((prev) => FormController.deleteSection(prev, sectionId));
  const handleUpdateSectionTitle = (sectionId: string, title: string) =>
    setForm((prev) =>
      FormController.updateSectionTitle(prev, sectionId, title)
    );
  const handleAddQuestion = (sectionId: string) =>
    setForm((prev) => FormController.addQuestion(prev, sectionId));
  const handleUpdateQuestion = (
    sectionId: string,
    questionId: string,
    text: string
  ) =>
    setForm((prev) =>
      FormController.updateQuestion(prev, sectionId, questionId, text)
    );
  const handleDeleteQuestion = (sectionId: string, questionId: string) =>
    setForm((prev) =>
      FormController.deleteQuestion(prev, sectionId, questionId)
    );
  const handleAddOption = (sectionId: string, questionId: string) =>
    setForm((prev) => FormController.addOption(prev, sectionId, questionId));
  const handleUpdateOption = (
    sectionId: string,
    questionId: string,
    optionId: string,
    value: string
  ) =>
    setForm((prev) =>
      FormController.updateOptionValue(
        prev,
        sectionId,
        questionId,
        optionId,
        value
      )
    );
  const handleDeleteOption = (
    sectionId: string,
    questionId: string,
    optionId: string
  ) =>
    setForm((prev) =>
      FormController.deleteOption(prev, sectionId, questionId, optionId)
    );

  const handleUpdateQuestionType = (
    sectionId: string,
    questionId: string,
    type: string
  ) =>
    setForm((prev) =>
      FormController.updateQuestionType(prev, sectionId, questionId, type)
    );

  const handleAddQuestionWithDependency = (
    targetSectionId: string,
    parentSectionId: string,
    parentQuestionId: string,
    expectedAnswer: string,
    parentOptionId: string | undefined,
    dependencyType: "visibility" | "options",
    questionType:
      | "single-select"
      | "multi-select"
      | "integer"
      | "number"
      | "text"
      | "linear-scale",
    triggerOptionId?: string
  ) => {
    setForm((prevForm) =>
      FormController.createDependentQuestion(
        prevForm,
        targetSectionId,
        parentSectionId,
        parentQuestionId,
        expectedAnswer,
        parentOptionId,
        dependencyType,
        questionType,
        triggerOptionId
      )
    );
  };

  const setFormTitle = (title: string) =>
    setForm((prev) => ({ ...prev, formTitle: title }));
  const setDescription = (description: string) =>
    setForm((prev) => ({ ...prev, description }));

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
              section={form.sections[activeSection]}
              responses={responses}
              handleUpdateSectionTitle={handleUpdateSectionTitle}
              handleDeleteSection={handleDeleteSection}
              handleAddQuestion={handleAddQuestion}
              handleUpdateQuestion={handleUpdateQuestion}
              handleDeleteQuestion={handleDeleteQuestion}
              handleUpdateQuestionType={handleUpdateQuestionType}
              handleAddOption={handleAddOption}
              handleUpdateOption={handleUpdateOption}
              handleDeleteOption={handleDeleteOption}
              setFormTitle={setFormTitle}
              setDescription={setDescription}
              handleCreateDependentQuestion={handleAddQuestionWithDependency}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
