import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  Section,
  Question,
  Option,
  DependencyCondition,
} from "../../interface/interface";
import "./forbuilder.css";
import { FormController } from "./formController/formcontroller";
import {
  Button,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  TextField,
  Grid,
  IconButton,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Radio,
  Checkbox,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useStyles } from "./formbuilderStyle";
import { ArrowDownward } from "@material-ui/icons";

export const FormBuilder: React.FC = () => {
  const { id: formId } = useParams<{ id: string }>();
  const classes = useStyles();

  const shouldDisplay = (
    dependecies: DependencyCondition[] | undefined,
    responses: Record<string, string>
  ): boolean => {
    if (!dependecies || dependecies.length === 0) return true;
    return dependecies.every(
      (dep) => responses[dep.questionId] === dep.expectedAnswer
    );
  };

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
  // Save form state to localStorage on changes (optional)
  useEffect(() => {
    localStorage.setItem(form.formId, JSON.stringify(form));
  }, [form]);

  // Update handlers to use FormController
  const handleAddSection = () =>
    setForm((prev) => FormController.addSection(prev));
  const handleDeleteSection = (sectionId: string) =>
    setForm((prev) => FormController.deleteSection(prev, sectionId));
  const handleUpdateSectionTitle = (sectionId: string, title: string) =>
    setForm((prev) =>
      FormController.updateSectionTitle(prev, sectionId, title)
    );
  const handleAddQuestion = (sectionId: string) => {
    return FormController.addQuestion(form, sectionId);
  };
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

  const handleUpdateScaleRange = (
    sectionId: string,
    questionId: string,
    range: 5 | 10
  ) => {
    setForm((prevForm) =>
      FormController.updateScaleRange(prevForm, sectionId, questionId, range)
    );
  };

  const getAllQuestionsBeforeSection = (sectionId: string): Question[] => {
    const sectionIndex = form.sections.findIndex(
      (s) => s.SectionId === sectionId
    );
    return form.sections.slice(0, sectionIndex).flatMap((s) => s.question);
  };

  const handleAddDependency = (
    sectionId: string,
    questionId: string,
    dependency: DependencyCondition
  ) => {
    setForm((prev) =>
      FormController.addDependency(prev, sectionId, questionId, dependency)
    );
  };

  const handleRemoveDependency = (
    sectionId: string,
    questionId: string,
    dependencyIndex: number
  ) => {
    setForm((prev) =>
      FormController.removeDependency(
        prev,
        sectionId,
        questionId,
        dependencyIndex
      )
    );
  };

  const handleCreateDependentQuestion = (
    sectionId: string,
    dependency: DependencyCondition,
    questionType: string
  ) => {
    setForm((prev) =>
      FormController.createDependentQuestion(
        prev,
        sectionId,
        dependency,
        questionType
      )
    );
  };

  const setFormTitle = (title: string) => {
    setForm((prev) => ({
      ...prev,
      formTitle: title,
      updatedAt: new Date().toISOString(),
    }));
  };

  const setDescription = (description: string) => {
    setForm((prev) => ({
      ...prev,
      description,
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <div className={classes.root}>
      {/* HEADER (TOP BAR) */}
      <AppBar position="fixed" elevation={0} className={classes.headerBar}>
        <Toolbar className={classes.toolBar}>
          <Typography variant="h1" className={classes.headerTitle}>
            Form Builder
          </Typography>
          <div className={classes.headerButtons}>
            <Button variant="contained" className={classes.previewButton}>
              Preview
            </Button>
            <Button variant="contained" className={classes.saveButton}>
              Save
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {/* Add spacer for fixed AppBar */}
      {/* MAIN LAYOUT: SIDEBAR + CONTENT */}
      <div className={`${classes.contentContainer} `}>
        {/* SIDEBAR (LEFT PANEL) */}
        <div className={classes.sidebar}>
          <Typography variant="subtitle1" className={classes.sidebarTitle}>
            Form Sections
          </Typography>
          <List disablePadding>
            {form.sections.map((section, index) => (
              <ListItem
                key={section.SectionId}
                className={`${classes.listItem} ${
                  activeSection === index ? classes.activeListItem : ""
                }`}
                onClick={() => {
                  setActiveSection(index);
                  console.log("active section: ", index);
                }}
              >
                <ListItemText
                  primary={section.sectionTitle || "Untitled"}
                  style={{
                    color: activeSection === index ? "#fff" : "inherit",
                  }}
                />
                <div className="MoveIcons">
                  <IconButton
                    className={classes.moveIcon}
                    style={{
                      color: activeSection === index ? "#fff" : "inherit",
                    }}
                    title="Move Section"
                  >
                    <ArrowDownward fontSize="small" />
                    <ArrowDownward
                      fontSize="small"
                      style={{ transform: "rotate(180deg)", margin: "2px" }}
                    />
                  </IconButton>
                </div>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            className={classes.addSectionBtn}
            onClick={handleAddSection}
            // startIcon={<Add />}
          >
            Add Section
          </Button>
        </div>

        {/* MAIN CONTENT (RIGHT PANEL) */}
        <div className={classes.mainContent}>
          <div className={classes.mainContent}>
            {form.sections.length > 0 &&
              activeSection < form.sections.length &&
              (() => {
                const section = form.sections[activeSection];
                return (
                  <Paper
                    key={section.SectionId}
                    elevation={3}
                    className={classes.sectionPaper}
                  >
                    {/* Section Header */}
                    <div className={classes.sectionHeader}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <TextField
                          label="Section Title"
                          value={section.sectionTitle}
                          onChange={(e) =>
                            handleUpdateSectionTitle(
                              section.SectionId,
                              e.target.value
                            )
                          }
                          fullWidth
                          className={classes.sectionTitleInput}
                        />
                      </div>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteSection(section.SectionId)}
                      >
                        Section
                      </Button>
                    </div>

                    <br />
                    <br />
                    {/* Introduction Section Handling */}
                    {section.sectionTitle
                      .toLowerCase()
                      .includes("introduction") && (
                      <div>
                        <TextField
                          label="Form Title"
                          fullWidth
                          value={form.formTitle}
                          margin="normal"
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              formTitle: e.target.value,
                            }))
                          }
                        />
                        <TextField
                          label="Form Description"
                          fullWidth
                          value={form.description}
                          margin="normal"
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          multiline
                        />
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="upload-image"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                console.log(ev.target?.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label htmlFor="upload-image">
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                          >
                            Upload Image
                          </Button>
                        </label>
                      </div>
                    )}

                    {/* Questions */}
                    {section.question
                      .filter((ques) =>
                        shouldDisplay(ques.dependencies, responses)
                      )
                      .map((ques) => (
                        <Paper
                          key={ques.questionId}
                          elevation={2}
                          className={classes.questionPaper}
                        >
                          <Grid
                            container
                            spacing={2}
                            className={classes.questionRow}
                          >
                            <Grid item xs={12} sm={8}>
                              <TextField
                                label="Question Text"
                                value={ques.questionText}
                                onChange={(e) =>
                                  handleUpdateQuestion(
                                    section.SectionId,
                                    ques.questionId,
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                <InputLabel
                                  id={`type-label-${ques.questionId}`}
                                >
                                  Answer Type
                                </InputLabel>
                                <Select
                                  labelId={`type-label-${ques.questionId}`}
                                  value={ques.type}
                                  onChange={(e) =>
                                    handleUpdateQuestionType(
                                      section.SectionId,
                                      ques.questionId,
                                      e.target.value as string
                                    )
                                  }
                                >
                                  <MenuItem value="single-select">
                                    Single Select
                                  </MenuItem>
                                  <MenuItem value="multi-select">
                                    Multi Select
                                  </MenuItem>
                                  <MenuItem value="integer">
                                    Input Integer
                                  </MenuItem>
                                  <MenuItem value="number">
                                    Input Number
                                  </MenuItem>
                                  <MenuItem value="text">Input Text</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>

                          {/* Render options or input based on question type */}
                          <div>
                            {ques.type === "single-select" && (
                              <>
                                {ques.options
                                  .filter((opt) =>
                                    shouldDisplay(opt.dependentOn, responses)
                                  )
                                  .map((option) => (
                                    <div
                                      key={option.optionId}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      <Radio
                                        disabled
                                        style={{ marginRight: "8px" }}
                                      />
                                      <TextField
                                        label="Option"
                                        value={option.value}
                                        onChange={(e) =>
                                          handleUpdateOption(
                                            section.SectionId,
                                            ques.questionId,
                                            option.optionId,
                                            e.target.value
                                          )
                                        }
                                        fullWidth
                                        margin="dense"
                                      />
                                      <IconButton
                                        aria-label="delete-option"
                                        onClick={() =>
                                          handleDeleteOption(
                                            section.SectionId,
                                            ques.questionId,
                                            option.optionId
                                          )
                                        }
                                      >
                                        <Delete />
                                      </IconButton>
                                    </div>
                                  ))}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: 8,
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    // startIcon={<Add />}
                                    onClick={() =>
                                      handleAddOption(
                                        section.SectionId,
                                        ques.questionId
                                      )
                                    }
                                  >
                                    Add Options
                                  </Button>
                                </div>
                              </>
                            )}

                            {ques.type === "multi-select" && (
                              <>
                                {ques.options
                                  .filter((opt) =>
                                    shouldDisplay(opt.dependentOn, responses)
                                  )
                                  .map((option) => (
                                    <div
                                      key={option.optionId}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      <Checkbox
                                        disabled
                                        style={{ marginRight: "8px" }}
                                      />
                                      <TextField
                                        label="Option"
                                        value={option.value}
                                        onChange={(e) =>
                                          handleUpdateOption(
                                            section.SectionId,
                                            ques.questionId,
                                            option.optionId,
                                            e.target.value
                                          )
                                        }
                                        fullWidth
                                        margin="dense"
                                      />
                                      <IconButton
                                        aria-label="delete-option"
                                        onClick={() =>
                                          handleDeleteOption(
                                            section.SectionId,
                                            ques.questionId,
                                            option.optionId
                                          )
                                        }
                                      >
                                        <Delete />
                                      </IconButton>
                                    </div>
                                  ))}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: 8,
                                  }}
                                >
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={() =>
                                      handleAddOption(
                                        section.SectionId,
                                        ques.questionId
                                      )
                                    }
                                  >
                                    Add Options
                                  </Button>
                                </div>
                              </>
                            )}

                            {(ques.type === "integer" ||
                              ques.type === "number" ||
                              ques.type === "text") && (
                              <>
                                {ques.type === "integer" && (
                                  <TextField
                                    label="Answer"
                                    type="number"
                                    inputProps={{ step: 1 }}
                                    disabled
                                    fullWidth
                                    margin="dense"
                                  />
                                )}
                                {ques.type === "number" && (
                                  <TextField
                                    label="Answer"
                                    type="number"
                                    inputProps={{ step: 0.01 }}
                                    disabled
                                    fullWidth
                                    margin="dense"
                                  />
                                )}
                                {ques.type === "text" && (
                                  <TextField
                                    label="Answer"
                                    type="text"
                                    disabled
                                    fullWidth
                                    margin="dense"
                                    multiline
                                  />
                                )}
                              </>
                            )}
                          </div>

                          <div style={{ marginTop: 16 }}>
                            <Button
                              variant="outlined"
                              color="secondary"
                              startIcon={<Delete />}
                              onClick={() =>
                                handleDeleteQuestion(
                                  section.SectionId,
                                  ques.questionId
                                )
                              }
                            >
                              Question
                            </Button>
                          </div>
                        </Paper>
                      ))}

                    {/* Add Question Button */}
                    <Button
                      variant="outlined"
                      color="primary"
                      // startIcon={<Add />}
                      onClick={() => handleAddQuestion(section.SectionId)}
                      className={classes.addQuestionBtn}
                    >
                      Add Question
                    </Button>
                  </Paper>
                );
              })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
