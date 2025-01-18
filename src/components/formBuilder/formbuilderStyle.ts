import { blue } from "@material-ui/core/colors";
// import { makeStyles, Theme } from "@mui/styles";
// import { makeStyles, Theme } from "@material-ui/core/styles";
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
    margin: 0,
  },
  sectionPaper: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
    alignItems: "center",
  },
  sectionTitleInput: {
    marginRight: theme.spacing(2),
  },
  questionPaper: {
    padding: theme.spacing(2),
    backgroundColor: "rgb(226 232 240)",

    marginBottom: theme.spacing(2),
  },
  questionRow: {
    marginBottom: theme.spacing(2),
  },
  questionLabel: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
  addQuestionBtn: {
    marginTop: theme.spacing(2),
    textTransform: "none",
  },
  moveIcon: {
    padding: 4,
    margin: "0 2px",
    "& svg": {
      fontSize: "1rem",
    },
  },
}));
