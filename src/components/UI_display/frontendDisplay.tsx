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
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { Form } from "../../interface/interface";
import testData from "../formBuilder/new file structure/testData.json";
import SectionDisplay from "./sectionDisplay";
import {
  // useTheme, useMediaQuery,
  Button,
} from "@material-ui/core";

interface RouteParams extends Record<string, string | undefined> {
  userId: string;
  id: string;
}

const FrontendDisplay: React.FC = () => {
  const { userId, id: formId } = useParams<RouteParams>();
  console.log("userId", userId, " formId", formId);
  const [formData, setFormData] = useState<Form | null>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [expandedSection, setExpandedSection] = useState<string | false>(false);

  // const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // const _previewWidth = isSmallScreen ? "95vw" : isMediumScreen? "90vw": "80vw";
  // const _previewHeight = isSmallScreen? "95vh": isMediumScreen ? "90vh": "80vh";
  // Uncomment and use this to fetch form data from the backend.
  // const fetchForm = async (): Promise<Form | null> => {
  //   try {
  //     const response = await fetch(`/api/forms/${userId}/${formId}`);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch form");
  //     }
  //     const data = await response.json();
  //     return data;
  //   } catch (err) {
  //     console.error(err);
  //     return null;
  //   }
  // };

  useEffect(() => {
    // For now, set testData as formData.
    setFormData(testData as Form);
    // If fetching from the backend, you could use:
    // (async () => {
    //   const data = await fetchForm();
    //   setFormData(data);
    // })();
  }, [formId]);

  // Optionally log formData changes.
  useEffect(() => {
    if (formData) {
      console.log("FormData", formData);
    }
  }, [formData]);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  // Only for sections other than Introduction
  const handleSectionChange =
    (sectionId: string) =>
    (_event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? sectionId : false);
    };

  const handleSubmit = async () => {
    console.log("Responses submitted:", responses);
    try {
      const res = await fetch(`/api/forms/${userId}/${formId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: formData?.formId,
          responses: responses,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to submit form");
      }
      const data = await res.json();
      console.log(data);
      alert("Form submitted successfully");
    } catch (err: any) {
      alert("Error submitting form: " + err.message);
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <Paper
      style={{
        backgroundColor: "#f5f7fa",
        padding: "1rem",
        margin: "1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.2)",
        animation: "fadeIn 0.5s ease-in-out",
        maxWidth: 800,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <LinearProgress
        variant="determinate"
        value={0}
        style={{ width: "100%", borderRadius: "0.5rem" }}
      />
      <Box
        mx="auto"
        p={3}
        pt={6}
        pb={6}
        style={{
          animation: "fadeIn 0.5s ease-in-out",
          opacity: disableSubmit ? 0.5 : 1,
        }}
      >
        {/* Form Header */}
        <Box
          mb={4}
          style={{
            backgroundColor: "#fff",
            borderRadius: "0.5rem",
            padding: "1rem",
            boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            style={{
              fontWeight: 700,
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          >
            {formData.formTitle}
          </Typography>
          <Typography variant="body1" style={{ fontSize: "1rem" }}>
            {formData.description}
          </Typography>
        </Box>

        {/* Render each section */}
        {formData.sections.map((section) => {
          // The Introduction section is always visible.
          if (section.sectionTitle.toLowerCase() === "introduction") {
            return (
              <Box
                key={section.SectionId}
                mb={4}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  marginTop: "1rem",
                  boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h5"
                  style={{
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {section.sectionTitle}
                </Typography>
                <br />
                <SectionDisplay
                  section={section}
                  responses={responses}
                  onResponseChange={handleResponseChange}
                />
              </Box>
            );
          } else {
            // Other sections are rendered as Accordions (collapsible panels)
            return (
              <Accordion
                key={section.SectionId}
                expanded={expandedSection === section.SectionId}
                onChange={handleSectionChange(section.SectionId)}
                style={{
                  borderRadius: "0.5rem",
                  boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)",
                  marginBottom: "1rem",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  style={{ padding: "1rem" }}
                >
                  <Typography
                    variant="h5"
                    style={{
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {section.sectionTitle}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    padding: "1rem",
                    backgroundColor: "#fff",
                  }}
                >
                  <SectionDisplay
                    section={section}
                    responses={responses}
                    onResponseChange={handleResponseChange}
                  />
                </AccordionDetails>
              </Accordion>
            );
          }
        })}

        <br />
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmit();
              setDisableSubmit(true);
              setTimeout(() => setDisableSubmit(false), 2000);
            }}
            disabled={disableSubmit}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
            }}
          >
            {disableSubmit ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </Paper>
  );
};

export default FrontendDisplay;
