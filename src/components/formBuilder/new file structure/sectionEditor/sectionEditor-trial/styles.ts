import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  sectionPaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  sectionTitleInput: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
  questionPaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  questionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  addQuestionBtn: {
    marginLeft: theme.spacing(2),
  },
}));
