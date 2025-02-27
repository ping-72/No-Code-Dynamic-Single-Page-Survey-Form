import React from "react";
import { Typography, Container, Grid, fade } from "@material-ui/core";
import { Section, Question } from "../../interface/interface";
import QuestionDisplay from "./questionDisplay";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTypography-h5": {
        animation: "fadeIn 1s ease-in-out",
      },
      "& .MuiGrid-item": {
        animation: "fadeIn 1s ease-in-out",
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        backgroundColor: fade(theme.palette.common.white, 0.7),
        borderRadius: 10,
      },
    },
  })
);

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
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* <Typography variant="h3" gutterBottom>
            {section.sectionTitle}
          </Typography> */}
        </Grid>
        {section.description && (
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              {section.description}
            </Typography>
          </Grid>
        )}
        {section.questions.map((question: Question, index: number) => (
          <Grid item key={question.questionId} xs={12}>
            <QuestionDisplay
              question={question}
              index={index}
              responses={responses}
              onResponseChange={onResponseChange}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SectionDisplay;
