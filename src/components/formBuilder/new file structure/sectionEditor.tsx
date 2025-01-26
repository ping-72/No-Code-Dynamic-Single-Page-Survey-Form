import React, { useEffect, useState } from "react";
import { FormController } from "../formController/formcontroller";
import { Delete } from "@material-ui/icons";
import { useStyles } from "../formbuilderStyle";
import { SectionController } from "../formController/sectionController";
import { QuestionController } from "../formController/questionController";
import { OptionController } from "../formController/optioncontroller";
import { QuestionEditor } from "./sectionEditor/sectionEditor-trial/QuestionEditor/questionEditor";
import Snackbar from "@material-ui/core";
import { Alert } from "@material-ui/core";
import { DependencyDialog } from "./sectionEditor/dependencyDialog";
import {
  DependencyCondition,
  Form,
  Section,
  Question,
  Option,
  QuestionType,
} from "../../../interface/interface";
import {
  Paper,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Radio,
  Checkbox,
  Typography,
} from "@material-ui/core";

interface SectionEditorProps {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  section: Section;
  responses: Record<string, string>;
  handleDeleteSection: (sectionId: string) => void;
  handleUpdateSectionTitle: (sectionId: string, title: string) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  form,
  setForm,
  section,
  handleDeleteSection,
  handleUpdateSectionTitle,
  responses,
}) => {
  const classes = useStyles();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    console.log("Active section is ", section);
  }, []);

  const [title, setTitle] = useState(section.sectionTitle);
  const [dependencyDialogOpen, setDependencyDialogOpen] = useState(false);

  return (
    <Paper elevation={3} className={classes.sectionPaper}>
      <div className={classes.sectionHeader}>
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <TextField
            label="Section Title"
            value={section.sectionTitle}
            onChange={(e) =>
              handleUpdateSectionTitle(section.SectionId, e.target.value)
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
          Delete Section
        </Button>
      </div>
      <br />
      <br />

      {section.sectionTitle.toLowerCase().includes("introduction") ? (
        // Introduction Section UI
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
                updatedAt: new Date().toISOString(),
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
                updatedAt: new Date().toISOString(),
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
                  // Handle image upload as needed
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <label htmlFor="upload-image">
            <Button variant="contained" color="primary" component="span">
              Upload Image
            </Button>
          </label>
        </div>
      ) : (
        // Non-Introduction Section UI: Use QuestionEditor
        <QuestionEditor
          form={form}
          setForm={setForm}
          section={section}
          responses={responses}
        />
      )}

      {/* Snackbar for notifications */}
      {/* <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar> */}
    </Paper>
  );
  // const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  // const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  // const [expectedAnswer, setExpectedAnswer] = useState<string>("");
  // const [dependencyType, setDependencyType] = useState<
  //   "visibility" | "options"
  // >("visibility");
  // const [targetOptions, setTargetOptions] = useState<string[]>([]);
  // const [newQuestionType, setNewQuestionType] = useState<
  //   | "single-select"
  //   | "multi-select"
  //   | "integer"
  //   | "number"
  //   | "text"
  //   | "linear-scale"
  // >("single-select");

  // const handleCreateDependentQuestion = (
  //   targetSectionId: string,
  //   parentSectionId: string,
  //   parentQuestionId: string,
  //   expectedAnswer: string,
  //   parentOptionId: string | undefined,
  //   dependencyType: "visibility" | "options",
  //   questionType: QuestionType,
  //   triggerOptionId?: string
  // ) => {
  //   // Construct the DependencyCondition object
  //   const dependency: DependencyCondition = {
  //     targetSectionId,
  //     parentSectionId,
  //     parentQuestionId,
  //     expectedAnswer,
  //     parentOptionId,
  //     dependencyType,
  //     triggerOptionId,
  //   };

  //   try {
  //     // Add the dependent question using the controller
  //     const updatedForm = QuestionController.addDependentQuestion(
  //       form,
  //       section.SectionId,
  //       [dependency]
  //     );
  //     setForm(updatedForm);
  //     setSnackbar({
  //       open: true,
  //       message: "Dependent question created successfully",
  //       severity: "success",
  //     });
  //     setDependencyDialogOpen(false); // Close the dialog upon success
  //   } catch (err: any) {
  //     setSnackbar({
  //       open: true,
  //       message: `Error creating question: ${err.message}`,
  //       severity: "error",
  //     });
  //   }
  // };

  // const handleUpdateQuestionTitle = (
  //   questionId: string,
  //   questionText: string
  // ) => {
  //   try {
  //     const updatedForm = QuestionController.updateQuestionTitle(
  //       form,
  //       section.SectionId,
  //       questionId,
  //       questionText
  //     );

  //     setForm(updatedForm);
  //     setSnackbar({
  //       open: true,
  //       message: "Question title updated successfully",
  //       severity: "success",
  //     });
  //   } catch (err: any) {
  //     setSnackbar({
  //       open: true,
  //       message: `Error updating question title: ${err.message}`,
  //       severity: "error",
  //     });
  //   }
  // };

  // const handleAddQuestion = (sectionId: string) => {
  //   try {
  //     const updatedForm = QuestionController.addQuestion(form, sectionId);
  //     setForm(updatedForm);
  //     setSnackbar({
  //       open: true,
  //       message: "Question added successfully",
  //       severity: "success",
  //     });
  //   } catch (err: any) {
  //     setSnackbar({
  //       open: true,
  //       message: `Error adding question: ${err.message}`,
  //       severity: "error",
  //     });
  //   }
  // };
  // const handleUpdateQuestionType = (
  //   questionId: string,
  //   newType: QuestionType
  // ) => {
  //   try {
  //     const updatedForm = QuestionController.updateAnswerType(
  //       form,
  //       section.SectionId,
  //       questionId,
  //       newType
  //     );
  //     setForm(updatedForm);
  //     setSnackbar({
  //       open: true,
  //       message: "Question type updated successfully.",
  //       severity: "success",
  //     });
  //   } catch (error: any) {
  //     setSnackbar({
  //       open: true,
  //       message: `Error updating question type: ${error.message}`,
  //       severity: "error",
  //     });
  //   }
  // };

  // const handleDeleteQuestion = (questionId: string) => {
  //   try {
  //     const question = section.questions.find(
  //       (q) => q.questionId === questionId
  //     );
  //     if (!question) {
  //       throw new Error("Question not found.");
  //     }

  //     let updatedForm: Form;

  //     if (!question.dependentOn || question.dependentOn.length === 0) {
  //       // Independent Question
  //       updatedForm = QuestionController.deleteIndependentQuestion(
  //         form,
  //         section.SectionId,
  //         questionId
  //       );
  //     } else {
  //       // Dependent Question
  //       updatedForm = QuestionController.deleteDependentQuestion(
  //         form,
  //         section.SectionId,
  //         questionId
  //       );
  //     }

  //     setForm(updatedForm);
  //     setSnackbar({
  //       open: true,
  //       message: `Question "${question.questionText}" deleted successfully.`,
  //       severity: "success",
  //     });
  //   } catch (error: any) {
  //     setSnackbar({
  //       open: true,
  //       message: `Error deleting question: ${error.message}`,
  //       severity: "error",
  //     });
  //   }
  // };

  // const handleAddOption = (questionId: string) => {
  //   try {
  //     const updatedForm = OptionController.addOption(
  //       form,
  //       section.SectionId,
  //       questionId,
  //       "normal"
  //     );
  //     console.log("reached here 1");
  //     setForm(updatedForm);
  //     setSnackbar({
  //       open: true,
  //       message: "Option added successfully.",
  //       severity: "success",
  //     });
  //   } catch (error: any) {
  //     setSnackbar({
  //       open: true,
  //       message: `Error adding option: ${error.message}`,
  //       severity: "error",
  //     });
  //   }
  // };

  // const handleUpdateOptionValue = (
  //   questionId: string,
  //   optionId: string,
  //   newValue: string
  // ) => {
  //   try {
  //     const updatedForm = OptionController.updateOptionValue(
  //       form,
  //       section.SectionId,
  //       questionId,
  //       optionId,
  //       newValue
  //     );
  //     setForm(updatedForm);
  //     setSnackbar({
  //       open: true,
  //       message: "Option value updated successfully.",
  //       severity: "success",
  //     });
  //   } catch (error: any) {
  //     setSnackbar({
  //       open: true,
  //       message: `Error updating option: ${error.message}`,
  //       severity: "error",
  //     });
  //   }
  // };

  // const handleDeleteOption = (questionId: string, optionId: string) => {
  //   try {
  //     const updatedForm = OptionController.deleteOption(
  //       form,
  //       section.SectionId,
  //       questionId,
  //       optionId
  //     );
  //     setForm(updatedForm);
  //     setSnackbar({
  //       open: true,
  //       message: "Option deleted successfully.",
  //       severity: "success",
  //     });
  //   } catch (error: any) {
  //     setSnackbar({
  //       open: true,
  //       message: `Error deleting option: ${error.message}`,
  //       severity: "error",
  //     });
  //   }
  // };

  // const handleUpdateScaleRange = (questionId: string, range: 5 | 10) => {
  //   try {
  //     const updatedForm = QuestionController.updateAnswerType(
  //       form,
  //       section.SectionId,
  //       questionId,
  //       "linear-scale"
  //     );
  //     // Assuming you have a method to set scale range
  //     // If not, you can extend the controller accordingly
  //     const updatedFormWithScale = {
  //       ...updatedForm,
  //       sections: updatedForm.sections.map((sec) => {
  //         if (sec.SectionId !== section.SectionId) return sec;
  //         return {
  //           ...sec,
  //           questions: sec.questions.map((q) => {
  //             if (q.questionId !== questionId) return q;
  //             return {
  //               ...q,
  //               scaleRange: range,
  //             };
  //           }),
  //         };
  //       }),
  //     };
  //     setForm(updatedFormWithScale);
  //     setSnackbar({
  //       open: true,
  //       message: "Scale range updated successfully.",
  //       severity: "success",
  //     });
  //   } catch (error: any) {
  //     setSnackbar({
  //       open: true,
  //       message: `Error updating scale range: ${error.message}`,
  //       severity: "error",
  //     });
  //   }
  // };

  // const eligibleDependencies = form.sections
  //   .filter((sec) => sec.order <= section.order)
  //   .flatMap((sec) => sec.questions)
  //   .filter((q) =>
  //     ["number", "linear-scale", "integer", "single-select"].includes(q.type)
  //   );

  // const getDependencyInfo = (
  //   dependentOn?: DependencyCondition[]
  // ): {
  //   sectionName: string;
  //   questionText: string;
  //   expectedAnswer: string;
  //   type: "visibility" | "options";
  // } | null => {
  //   if (!dependentOn || dependentOn.length === 0) return null;

  //   console.log("Dependent on ", dependentOn);

  //   const dep = dependentOn[0];
  //   console.log("Dep on ", dep);

  //   if (!form.sections || !Array.isArray(form.sections)) {
  //     console.error("Form sections are undefined or not an array.");
  //     return null;
  //   }

  //   const dependentSection = form.sections.find(
  //     (s) => s.SectionId === dep.sectionId
  //   );

  //   if (!dependentSection) {
  //     console.warn(`Section with ID ${dep.sectionId} not found.`);
  //     return null;
  //   }

  //   console.log("Dep section ", dependentSection);

  //   if (
  //     !dependentSection.questions ||
  //     !Array.isArray(dependentSection.questions)
  //   ) {
  //     console.error(
  //       "Dependent section questions are undefined or not an array."
  //     );
  //     return null;
  //   }

  //   const dependentQuestion = dependentSection.questions.find(
  //     (q) => q.questionId === dep.questionId
  //   );

  //   if (!dependentQuestion) {
  //     console.warn(
  //       `Question with ID ${dep.questionId} not found in section ${dep.sectionId}.`
  //     );
  //     return null;
  //   }

  //   console.log(
  //     "Question is ",
  //     dependentQuestion,
  //     " section is ",
  //     dependentSection
  //   );

  //   console.log("sectionName ", dependentSection.sectionTitle);
  //   console.log("questionText ", dependentQuestion.questionText);
  //   console.log("expectedAnswer ", dep.expectedAnswer);
  //   console.log("type ", dep.dependencyType);

  //   return {
  //     sectionName: dependentSection.sectionTitle,
  //     questionText: dependentQuestion.questionText,
  //     expectedAnswer: dep.expectedAnswer,
  //     type: dep.dependencyType,
  //   };
  // };

  // const questionStyles = {
  //   independent: {
  //     backgroundColor: "#f5f7fa",
  //     border: "1px solid #e0e0e0",
  //     borderLeft: "4px solid #4caf50", // green border for independent questions
  //   },
  //   dependent: {
  //     backgroundColor: "#f3f7fa",
  //     borderLeft: "4px solid #2196f3", // blue border for dependent questions
  //   },
  //   questionBadge: {
  //     padding: "4px 8px",
  //     borderRadius: "4px",
  //     fontSize: "0.75rem",
  //     fontWeight: 500,
  //     marginBottom: "8px",
  //     display: "inline-block",
  //   },
  //   independentBadge: {
  //     backgroundColor: "#4caf50",
  //     color: "white",
  //   },
  //   dependentBadge: {
  //     backgroundColor: "#2196f3",
  //     color: "white",
  //   },
  // };

  // // Open dependency dialog for creating a dependent question
  // const openDependencyDialog = () => {
  //   setDependencyDialogOpen(true);
  // };

  // const getLikertLabels = (range: 5): { value: number; label: string }[] => {
  //   return [
  //     { value: 1, label: "Strongly Disagree" },
  //     { value: 2, label: "Disagree" },
  //     { value: 3, label: "Neutral" },
  //     { value: 4, label: "Agree" },
  //     { value: 5, label: "Strongly Agree" },
  //   ];
  // };

  // // Get options for the selected question (if single-select)
  // const getSelectedQuestionOptions = () => {
  //   const selectedQuestion = form.sections
  //     .find((sec) => sec.SectionId === selectedSectionId)
  //     ?.questions.find((q) => q.questionId === selectedQuestionId);

  //   return selectedQuestion?.type === "single-select"
  //     ? selectedQuestion.options
  //     : [];
  // };

  // return (
  //   <Paper elevation={3} className={classes.sectionPaper}>
  //     <div className={classes.sectionHeader}>
  //       <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
  //         <TextField
  //           label="Section Title"
  //           value={section.sectionTitle}
  //           onChange={(e) =>
  //             handleUpdateSectionTitle(section.SectionId, e.target.value)
  //           }
  //           fullWidth
  //           className={classes.sectionTitleInput}
  //         />
  //       </div>
  //       <Button
  //         variant="contained"
  //         color="secondary"
  //         startIcon={<Delete />}
  //         onClick={() => handleDeleteSection(section.SectionId)}
  //       >
  //         Section
  //       </Button>
  //     </div>
  //     <br />
  //     <br />

  //     {section.sectionTitle.toLowerCase().includes("introduction") && (
  //       <div>
  //         <TextField
  //           label="Form Title"
  //           fullWidth
  //           value={form.formTitle}
  //           margin="normal"
  //           onChange={(e) =>
  //             setForm((prev) => ({
  //               ...prev,
  //               formTitle: e.target.value,
  //               updatedAt: new Date().toISOString(),
  //             }))
  //           }
  //         />
  //         <TextField
  //           label="Form Description"
  //           fullWidth
  //           value={form.description}
  //           margin="normal"
  //           onChange={(e) =>
  //             setForm((prev) => ({
  //               ...prev,
  //               description: e.target.value,
  //               updatedAt: new Date().toISOString(),
  //             }))
  //           }
  //           multiline
  //         />
  //         <input
  //           accept="image/*"
  //           style={{ display: "none" }}
  //           id="upload-image"
  //           type="file"
  //           onChange={(e) => {
  //             const file = e.target.files?.[0];
  //             if (file) {
  //               const reader = new FileReader();
  //               reader.onload = (ev) => {
  //                 console.log(ev.target?.result);
  //               };
  //               reader.readAsDataURL(file);
  //             }
  //           }}
  //         />
  //         <label htmlFor="upload-image">
  //           <Button variant="contained" color="primary" component="span">
  //             Upload Image
  //           </Button>
  //         </label>
  //       </div>
  //     )}

  //     {/* Render questions */}
  //     {section &&
  //       section.questions &&
  //       section.questions.map((ques: Question) => (
  //         <Paper
  //           key={ques.questionId}
  //           elevation={2}
  //           className={classes.questionPaper}
  //           style={{
  //             ...(!ques.dependentOn?.length
  //               ? questionStyles.independent
  //               : questionStyles.dependent),
  //           }}
  //         >
  //           {/* Question Type Badge */}
  //           <div style={{ marginBottom: "16px" }}>
  //             <span
  //               style={{
  //                 ...questionStyles.questionBadge,
  //                 ...(ques.dependentOn?.length
  //                   ? questionStyles.dependentBadge
  //                   : questionStyles.independentBadge),
  //               }}
  //             >
  //               {ques.dependentOn?.length
  //                 ? "Dependent Question"
  //                 : "Independent Question"}
  //             </span>
  //           </div>

  //           {/* Add dependency info at the top if question has dependencies */}
  //           {ques.dependentOn?.length > 0 && (
  //             <div
  //               style={{
  //                 padding: "8px",
  //                 marginBottom: "16px",
  //                 borderBottom: "1px dashed #2196f3",
  //                 fontSize: "0.875rem",
  //                 color: "#666",
  //               }}
  //             >
  //               {(() => {
  //                 const info = getDependencyInfo(ques.dependentOn);
  //                 return (
  //                   <>
  //                     {/* // this is not showing */}
  //                     <div style={{ marginTop: "4px" }}>
  //                       <strong>Shows when:</strong> {info?.sectionName} →{" "}
  //                       {info?.questionText} = {info?.expectedAnswer}
  //                       {info?.type === "options" && " (Dynamic Options)"}
  //                     </div>
  //                   </>
  //                 );
  //               })()}
  //             </div>
  //           )}

  //           <Grid container spacing={2} className={classes.questionRow}>
  //             <Grid item xs={12} sm={8}>
  //               <TextField
  //                 label="Question Text"
  //                 value={ques.questionText}
  //                 onChange={(e) =>
  //                   handleUpdateQuestionTitle(ques.questionId, e.target.value)
  //                 }
  //                 fullWidth
  //               />
  //             </Grid>
  //             <Grid item xs={12} sm={4}>
  //               <FormControl fullWidth>
  //                 <InputLabel id={`type-label-${ques.questionId}`}>
  //                   Answer Type
  //                 </InputLabel>
  //                 <Select
  //                   labelId={`type-label-${ques.questionId}`}
  //                   value={ques.type}
  //                   onChange={(e) =>
  //                     handleUpdateQuestionType(
  //                       ques.questionId,
  //                       e.target.value as QuestionType
  //                     )
  //                   }
  //                 >
  //                   <MenuItem value="single-select">Single Select</MenuItem>
  //                   <MenuItem value="multi-select">Multi Select</MenuItem>
  //                   <MenuItem value="integer">Input Integer</MenuItem>
  //                   <MenuItem value="number">Input Number</MenuItem>
  //                   <MenuItem value="text">Input Text</MenuItem>
  //                   <MenuItem value="linear-scale">Linear Scale</MenuItem>
  //                 </Select>
  //               </FormControl>
  //             </Grid>
  //           </Grid>
  //           {/* Render options/inputs based on question type */}
  //           <div>
  //             {["single-select", "multi-select"].includes(ques.type) && (
  //               <>
  //                 {ques.options
  //                   // .filter((opt) => shouldDisplayOption(opt, responses))
  //                   .map((option) => (
  //                     <div
  //                       key={option.optionId}
  //                       style={{
  //                         display: "flex",
  //                         alignItems: "center",
  //                         marginBottom: "8px",
  //                       }}
  //                     >
  //                       {ques.type === "single-select" ? (
  //                         <Radio disabled style={{ marginRight: "8px" }} />
  //                       ) : (
  //                         <Checkbox disabled style={{ marginRight: "8px" }} />
  //                       )}
  //                       <TextField
  //                         label="Option"
  //                         value={option.value}
  //                         onChange={(e) =>
  //                           handleUpdateOptionValue(
  //                             ques.questionId,
  //                             option.optionId,
  //                             e.target.value
  //                           )
  //                         }
  //                         fullWidth
  //                         margin="dense"
  //                       />
  //                       <IconButton
  //                         aria-label="delete-option"
  //                         onClick={() =>
  //                           handleDeleteOption(ques.questionId, option.optionId)
  //                         }
  //                       >
  //                         <Delete />
  //                       </IconButton>
  //                     </div>
  //                   ))}
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     alignItems: "center",
  //                     marginTop: 8,
  //                   }}
  //                 >
  //                   <Button
  //                     variant="outlined"
  //                     color="primary"
  //                     onClick={() => handleAddOption(ques.questionId)}
  //                   >
  //                     Add Options
  //                   </Button>
  //                   <Button
  //                     variant="outlined"
  //                     color="secondary"
  //                     onClick={() => {
  //                       console.log("This will make a table in the options");
  //                       handleAddOption(ques.questionId);
  //                     }}
  //                   >
  //                     Add Table
  //                   </Button>
  //                 </div>
  //               </>
  //             )}

  //             {["integer", "number", "text"].includes(ques.type) && (
  //               <>
  //                 {ques.type === "integer" && (
  //                   <TextField
  //                     label="Answer"
  //                     type="number"
  //                     inputProps={{ step: 1 }}
  //                     disabled
  //                     fullWidth
  //                     margin="dense"
  //                   />
  //                 )}
  //                 {ques.type === "number" && (
  //                   <TextField
  //                     label="Answer"
  //                     type="number"
  //                     inputProps={{ step: 0.01 }}
  //                     disabled
  //                     fullWidth
  //                     margin="dense"
  //                   />
  //                 )}
  //                 {ques.type === "text" && (
  //                   <TextField
  //                     label="Answer"
  //                     type="text"
  //                     disabled
  //                     fullWidth
  //                     margin="dense"
  //                     multiline
  //                   />
  //                 )}
  //               </>
  //             )}

  //             {ques.type === "linear-scale" && (
  //               <div>
  //                 <div
  //                   style={{
  //                     display: "flex",
  //                     justifyContent: "space-between",
  //                     marginTop: "16px",
  //                     alignItems: "center",
  //                     flexWrap: "wrap",
  //                     gap: "8px",
  //                   }}
  //                 >
  //                   {getLikertLabels(ques.scaleRange || 5).map(
  //                     ({ value, label }) => (
  //                       <div
  //                         key={value}
  //                         style={{
  //                           textAlign: "center",
  //                           minWidth: "80px",
  //                           flex: "1",
  //                         }}
  //                       >
  //                         <Radio disabled />
  //                         <div>{value}</div>
  //                         <Typography
  //                           variant="caption"
  //                           style={{
  //                             display: "block",
  //                             minHeight: "40px",
  //                             fontSize:
  //                               ques.scaleRange === 10 ? "0.7rem" : "0.75rem",
  //                           }}
  //                         >
  //                           {label}
  //                         </Typography>
  //                       </div>
  //                     )
  //                   )}
  //                 </div>
  //               </div>
  //             )}
  //           </div>
  //           <div style={{ marginTop: 16 }}>
  //             <Button
  //               variant="outlined"
  //               color="secondary"
  //               startIcon={<Delete />}
  //               onClick={() => handleDeleteQuestion(ques.questionId)}
  //             >
  //               Delete Question
  //             </Button>
  //           </div>
  //         </Paper>
  //       ))}

  //     <div style={{ display: "flex", gap: "16px" }}>
  //       <Button
  //         variant="outlined"
  //         color="primary"
  //         onClick={() => handleAddQuestion(section.SectionId)}
  //         className={classes.addQuestionBtn}
  //       >
  //         Add Question
  //       </Button>
  //       <Button
  //         variant="outlined"
  //         color="secondary"
  //         onClick={openDependencyDialog}
  //       >
  //         Add Dependent Question
  //       </Button>
  //     </div>

  //     {/* Dependency Dialog */}
  //     <DependencyDialog
  //       open={dependencyDialogOpen}
  //       onClose={() => setDependencyDialogOpen(false)}
  //       form={form}
  //       section={section}
  //       currentQuestionForDependency={null}
  //       handleCreateDependentQuestion={handleCreateDependentQuestion}
  //     ></DependencyDialog>
  //   </Paper>
  // );
};
