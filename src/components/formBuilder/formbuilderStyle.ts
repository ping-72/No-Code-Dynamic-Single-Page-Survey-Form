import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100vw",
    maxWidth: "100%",
    backgroundColor: "#fff",
    fontFamily: "sans-serif",
    margin: 0,
    padding: 0,
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "hidden",
  },

  /** HEADER (TOP BAR) **/
  headerBar: {
    backgroundColor: "#fff", // White background
    color: "#000", // Black text
    borderBottom: "2px solid #ccc",
  },

  headerTitle: {
    fontWeight: "bold",
    fontSize: "1.25rem",
  },
  headerButtons: {
    display: "flex",
    gap: theme.spacing(2),
  },
  previewButton: {
    backgroundColor: "#f0f0f0", // Light-gray
    color: "#000",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  saveButton: {
    backgroundColor: "#BD73FD", // Black
    textEmphasisColor: "#ffffff",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#A63FFF",
    },
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  contentContainer: {
    display: "flex",
    flex: 1,
    width: "100%",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  },

  /** SIDEBAR STYLES **/
  sidebar: {
    width: "20%",
    minWidth: 200,
    margin: 0,
    padding: theme.spacing(2),
    borderRight: "1px solid #ccc",
    backgroundColor: "#f7f7f7",
    overflowY: "auto",
  },
  sidebarTitle: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
  addSectionBtn: {
    marginTop: theme.spacing(2),
    backgroundColor: "#607d8b", // Blue-gray
    color: "#fff",
    width: "100%",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#546e7a",
    },
  },
  listItem: {
    backgroundColor: "#e0e0e0",
    marginBottom: theme.spacing(1),
    borderRadius: 4,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#d5d5d5",
    },
  },
  activeListItem: {
    backgroundColor: "#2196f3",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1976d2",
    },
    "& .MoveIcons": {
      color: "#fff",
    },
  },
  downloadIcon: {
    marginLeft: "auto",
    color: "#555",
  },

  /** MAIN CONTENT STYLES **/
  mainContent: {
    flex: 1,
    padding: theme.spacing(3),
    overflowY: "auto",
    backgroundColor: "#f5f5f5",
  },

  /** FORM INFO PAPER STYLES **/
  formInfoPaper: {
    marginBottom: theme.spacing(3),
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  /** SECTION STYLES **/
  sectionPaper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  sectionTitleInput: {
    marginRight: theme.spacing(2),
  },
  sectionTitle: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
  },

  /** QUESTION STYLES **/
  questionContainer: {
    marginBottom: theme.spacing(3),
  },
  questionPaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  questionRow: {
    marginBottom: theme.spacing(2),
  },
  optionContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  optionInput: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  deleteButton: {
    color: theme.palette.error.main,
  },
  addQuestionBtn: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  addOptionButton: {
    marginTop: theme.spacing(1),
  },
  moveIcon: {
    cursor: "move",
    marginRight: theme.spacing(1),
  },
}));
