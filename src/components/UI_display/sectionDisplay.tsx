import React from "react";
import { Box, Typography, Container } from "@material-ui/core";
import { Section, Question } from "../../interface/interface";
import QuestionDisplay from "./questionDisplay";

interface SectionDisplayProps {
  section: Section;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
}

const SectionDisplay: React.FC<SectionDisplayProps> = ({
  section,
  responses,
  onResponseChange,
}) => {
  return (
    <Container maxWidth="md">
      {section.description && (
        <Box mb={2}>
          <Typography variant="body1" gutterBottom>
            {section.description}
          </Typography>
        </Box>
      )}
      {section.questions.map((question: Question, index: number) => (
        <QuestionDisplay
          key={question.questionId}
          question={question}
          index={index}
          responses={responses}
          onResponseChange={onResponseChange}
        />
      ))}
    </Container>
  );
};

export default SectionDisplay;
