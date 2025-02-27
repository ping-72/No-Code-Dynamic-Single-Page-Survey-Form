import React, { useState } from "react";
import { Paper, Typography, LinearProgress, Box } from "@material-ui/core";
import { Form } from "../../interface/interface";
import SectionPreview from "./sectionPreview";

interface FormPreviewProps {
  formData: Form;
}

const FormPreview: React.FC<FormPreviewProps> = ({ formData }) => {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <Paper
      style={{
        backgroundColor: "#f5f7fa",
        padding: 16,
        margin: 8,
        borderRadius: 4,
      }}
    >
      <LinearProgress
        variant="determinate"
        style={{ width: "100%", borderRadius: 4 }}
      />
      <Box
        maxWidth={800}
        mx="auto"
        p={3}
        style={{ animation: "fadeIn 0.5s ease-in-out" }}
      >
        <Box
          mb={4}
          style={{ backgroundColor: "#fff", borderRadius: 4, padding: 16 }}
        >
          <Typography variant="h3" gutterBottom>
            {formData.formTitle}
          </Typography>
          <Typography variant="body1">{formData.description}</Typography>
        </Box>

        {formData.sections.map((section, _index) => (
          <Box
            key={section.SectionId}
            mb={4}
            style={{ backgroundColor: "#fff", borderRadius: 4, padding: 16 }}
          >
            <SectionPreview
              section={section}
              responses={responses}
              onResponseChange={handleResponseChange}
            />
          </Box>
        ))}
      </Box>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </Paper>
  );
};

export default FormPreview;
