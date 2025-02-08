import React from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  makeStyles,
} from "@material-ui/core";
import { Section, Question } from "../../interface/interface";
import QuestionPreview from "./questionPreview";

const useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(0, 0),
    padding: theme.spacing(2),
    borderRadius: 10,
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
    animation: `$fadeIn 0.5s ease-in-out`,
  },
  "@keyframes fadeIn": {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
}));

interface SectionPreviewProps {
  section: Section;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
}

const SectionPreview: React.FC<SectionPreviewProps> = ({
  section,
  responses,
  onResponseChange,
}) => {
  const classes = useStyles();

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box className={classes.section}>
            <Typography variant="h5" gutterBottom component="h2">
              {section.sectionTitle}
            </Typography>
            {section.description && (
              <Typography variant="body1" gutterBottom>
                {section.description}
              </Typography>
            )}
            <br />
            {section.questions.map((question: Question, index: number) => (
              <QuestionPreview
                index_no={index}
                key={question.questionId}
                question={question}
                responses={responses}
                onResponseChange={onResponseChange}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SectionPreview;
