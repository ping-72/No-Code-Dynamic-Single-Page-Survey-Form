import React from "react";
import {
  Typography,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  Fade,
  Collapse,
} from "@material-ui/core";
import { Section, Question } from "../../interface/interface";
import QuestionDisplay from "./questionDisplay";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

// Define a type for form responses
type FormResponse = string | number | boolean | string[] | null;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTypography-h5": {
        animation: "fadeIn 0.5s ease-in-out",
      },
      "& .MuiGrid-item": {
        animation: "fadeIn 0.5s ease-in-out",
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        backgroundColor: "transparent",
        transition: "all 0.3s ease-in-out",
      },
    },
    sectionContainer: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(2),
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      marginBottom: theme.spacing(4),
      overflow: "hidden",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        transform: "translateY(-2px)",
      },
    },
    sectionHeader: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      position: "relative",
      transition: "all 0.3s ease-in-out",
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: theme.palette.divider,
        transition: "all 0.3s ease-in-out",
      },
      "&.active": {
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
        color: theme.palette.primary.contrastText,
        "&::after": {
          background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
        },
      },
    },
    description: {
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(2),
      backgroundColor: theme.palette.common.white,
      borderRadius: theme.spacing(1),
      padding: theme.spacing(2),
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      borderLeft: `4px solid ${theme.palette.divider}`,
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      "&.active": {
        borderLeft: `4px solid ${theme.palette.primary.main}`,
      },
    },
    questionContainer: {
      padding: theme.spacing(2),
      margin: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(1),
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
        transform: "translateX(4px)",
      },
    },
    sectionTitle: {
      fontWeight: 700,
      textAlign: "center",
      transition: "all 0.3s ease-in-out",
      "&.active": {
        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    },
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(10px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
    "@keyframes slideIn": {
      from: { opacity: 0, transform: "translateX(-20px)" },
      to: { opacity: 1, transform: "translateX(0)" },
    },
  })
);

interface SectionDisplayProps {
  section: Section;
  responses: Record<string, FormResponse>;
  onResponseChange: (questionId: string, value: FormResponse) => void;
}

const SectionDisplay: React.FC<SectionDisplayProps> = ({
  section,
  responses,
  onResponseChange,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <Fade in timeout={500}>
      <Container
        maxWidth={isMobile ? "sm" : isTablet ? "md" : "lg"}
        className={classes.root}
        style={{
          padding: isMobile ? "0.5rem" : "1rem",
        }}
      >
        <Paper className={classes.sectionContainer}>
          <div
            className={`${classes.sectionHeader} ${isExpanded ? "active" : ""}`}
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ cursor: "pointer" }}
          >
            <Typography
              variant="h5"
              className={`${classes.sectionTitle} ${
                isExpanded ? "active" : ""
              }`}
              style={{
                fontSize: isMobile ? "1.1rem" : "1.25rem",
              }}
            >
              {section.sectionTitle}
            </Typography>
          </div>

          <Collapse in={isExpanded}>
            <Grid container spacing={isMobile ? 1 : 3}>
              {section.description && section.description.trim() !== "" && (
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    className={`${classes.description} ${
                      isExpanded ? "active" : ""
                    }`}
                    style={{
                      fontSize: isMobile ? "0.875rem" : "1rem",
                      lineHeight: isMobile ? 1.4 : 1.5,
                    }}
                  >
                    {section.description}
                  </Typography>
                </Grid>
              )}
              {section.questions && section.questions.length > 0
                ? section.questions.map((question: Question, index: number) => (
                    <Grid
                      item
                      key={question.questionId}
                      xs={12}
                      className={classes.questionContainer}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: "slideIn 0.5s ease-out forwards",
                      }}
                    >
                      <QuestionDisplay
                        question={question}
                        index={index}
                        responses={responses}
                        onResponseChange={onResponseChange}
                      />
                    </Grid>
                  ))
                : null}
            </Grid>
          </Collapse>
        </Paper>
      </Container>
    </Fade>
  );
};

export default SectionDisplay;
