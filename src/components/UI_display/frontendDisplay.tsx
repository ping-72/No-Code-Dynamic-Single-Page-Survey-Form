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
  useTheme,
  useMediaQuery,
  Button,
  CircularProgress,
  Fade,
  Zoom,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import { useParams } from "react-router-dom";
import { Form } from "../../interface/interface";
import testData from "../formBuilder/new file structure/testData.json";
import SectionDisplay from "./sectionDisplay";
import api from "../../config/api";

let currentFormId = "";

// Psychological Well-Being Survey form data
const psychologicalWellBeingForm = {
  formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
  formTitle: "Psychological Well Being of IIT Students",
  description:
    "To what extent have the following stressors affected you in your college life so far, on a scale of 1-5? (1 = Very low, 5 = Very high)",
  sections: [
    {
      SectionId: "a86f9ef9-147e-417a-92e0-357d8f9e5c7e",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle:
        "Kindly fill in the following details (All the details would remain confidential)",
      description: "",
      questions: [
        {
          questionId: "a738eea5-e625-4fca-84e4-e7c834691626",
          sectionId: "a86f9ef9-147e-417a-92e0-357d8f9e5c7e",
          questionText: "Year of study",
          type: "single-select",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [
            {
              optionId: "73a92bb8-3d20-4e52-ab78-26b4a93927d1",
              questionId: "a738eea5-e625-4fca-84e4-e7c834691626",
              type: "normal",
              value: "1st Year UG",
              dependencies: [],
              _id: "67eaa95f49b600e676c6543a",
            },
            {
              optionId: "c9411e22-cbca-4ffc-958c-5ba71f44666f",
              questionId: "a738eea5-e625-4fca-84e4-e7c834691626",
              type: "normal",
              value: "2nd Year UG",
              dependencies: [],
              _id: "67eaa95f49b600e676c6543b",
            },
            {
              optionId: "a9f0b1b1-81a6-4303-bc67-97123f76b664",
              questionId: "a738eea5-e625-4fca-84e4-e7c834691626",
              type: "normal",
              value: "3rd Year UG",
              dependencies: [],
              _id: "67eaa95f49b600e676c6543c",
            },
            {
              optionId: "3f65d682-72c0-4745-930d-73f5cb543080",
              questionId: "a738eea5-e625-4fca-84e4-e7c834691626",
              type: "normal",
              value: "4th Year UG",
              dependencies: [],
              _id: "67eaa95f49b600e676c6543d",
            },
            {
              optionId: "f1f89189-92c6-4301-8ffa-82dad7089463",
              questionId: "a738eea5-e625-4fca-84e4-e7c834691626",
              type: "normal",
              value: "5th Year UG",
              dependencies: [],
              _id: "67eaa95f49b600e676c6543e",
            },
            {
              optionId: "baca10bd-00a5-444e-ae62-6c0bd8e1f343",
              questionId: "a738eea5-e625-4fca-84e4-e7c834691626",
              type: "normal",
              value: "1st Year PG",
              dependencies: [],
              _id: "67eaa95f49b600e676c6543f",
            },
            {
              optionId: "abe5ec83-3a4b-4c19-b753-35cf2ad7ea60",
              questionId: "a738eea5-e625-4fca-84e4-e7c834691626",
              type: "normal",
              value: "2nd Year PG",
              dependencies: [],
              _id: "67eaa95f49b600e676c65440",
            },
            {
              optionId: "1380bdfc-c222-4fcb-814d-f183c9d2bff7",
              questionId: "a738eea5-e625-4fca-84e4-e7c834691626",
              type: "normal",
              value: "PhD",
              dependencies: [],
              _id: "67eaa95f49b600e676c65441",
            },
          ],
          _id: "67f0bd3764bdae3f97591d8f",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.340Z",
        },
        {
          questionId: "43b2ee28-fc68-49cc-a534-9bdbbd0adf43",
          sectionId: "a86f9ef9-147e-417a-92e0-357d8f9e5c7e",
          questionText: "Gender",
          type: "single-select",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [
            {
              optionId: "03b2ee2e-406f-4b1f-aa26-d12d2ee36fb9",
              questionId: "43b2ee28-fc68-49cc-a534-9bdbbd0adf43",
              type: "normal",
              value: "Male",
              dependencies: [],
              _id: "67eaa95f49b600e676c65443",
            },
            {
              optionId: "230a340f-b249-4415-aa5c-e3a6dfe69d89",
              questionId: "43b2ee28-fc68-49cc-a534-9bdbbd0adf43",
              type: "normal",
              value: "Female",
              dependencies: [],
              _id: "67eaa95f49b600e676c65444",
            },
            {
              optionId: "f61428c4-a869-44a9-9c56-5fd57d2c2b8f",
              questionId: "43b2ee28-fc68-49cc-a534-9bdbbd0adf43",
              type: "normal",
              value: "Others",
              dependencies: [],
              _id: "67eaa95f49b600e676c65445",
            },
          ],
          _id: "67f0bd3764bdae3f97591d98",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.341Z",
        },
      ],
      order: 0,
      _id: "67f0bd3764bdae3f97591d8e",
      createdAt: "2025-04-05T05:18:47.341Z",
    },
    {
      SectionId: "f50d080c-6c73-4488-b709-b7650e88a39d",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle: "Q1. Academics",
      description: "",
      questions: [
        {
          questionId: "3c743dcf-742f-4e0d-b322-58e89f4eec53",
          sectionId: "f50d080c-6c73-4488-b709-b7650e88a39d",
          questionText: "Exams",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [],
          _id: "67f0bd3764bdae3f97591d9d",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.342Z",
        },
        {
          questionId: "49290adc-586e-4542-8050-4f042fb394cb",
          sectionId: "f50d080c-6c73-4488-b709-b7650e88a39d",
          questionText: "Grades / CGPA",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [],
          _id: "67f0bd3764bdae3f97591d9e",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.343Z",
        },
        {
          questionId: "0abc61ce-e3b0-4fde-859c-f95cdd7f315d",
          sectionId: "f50d080c-6c73-4488-b709-b7650e88a39d",
          questionText: "Assignments and/or lab reports",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 2,
          options: [],
          _id: "67f0bd3764bdae3f97591d9f",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.343Z",
        },
      ],
      order: 1,
      _id: "67f0bd3764bdae3f97591d9c",
      createdAt: "2025-04-05T05:18:47.343Z",
    },
    {
      SectionId: "0d55b4e2-4fed-47d6-b6d1-e8a638fa435a",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle: "Q2. Career",
      description: "",
      questions: [
        {
          questionId: "5879fbf4-cf46-4dfc-a69e-30a9724c1a24",
          sectionId: "0d55b4e2-4fed-47d6-b6d1-e8a638fa435a",
          questionText: "Placement/Internship",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [],
          _id: "67f0bd3764bdae3f97591da1",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.343Z",
        },
        {
          questionId: "275baea2-0bbe-4a10-b6a5-82b53a2f4243",
          sectionId: "0d55b4e2-4fed-47d6-b6d1-e8a638fa435a",
          questionText: "CDC Process",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [],
          _id: "67f0bd3764bdae3f97591da2",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.344Z",
        },
      ],
      order: 2,
      _id: "67f0bd3764bdae3f97591da0",
      createdAt: "2025-04-05T05:18:47.344Z",
    },
    {
      SectionId: "f9260130-b85c-41f3-94c4-1eda9a0d5dac",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle: "Q3. Faculty related issues",
      description: "",
      questions: [
        {
          questionId: "5b6d9500-ffba-4c8d-ba95-dd247b7e214a",
          sectionId: "f9260130-b85c-41f3-94c4-1eda9a0d5dac",
          questionText: "Incompetent teaching methods",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [],
          _id: "67f0bd3764bdae3f97591da4",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.344Z",
        },
        {
          questionId: "6066f83f-338f-469f-87ba-ecbf67435aea",
          sectionId: "f9260130-b85c-41f3-94c4-1eda9a0d5dac",
          questionText: "Too strict attendance policies",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [],
          _id: "67f0bd3764bdae3f97591da5",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.344Z",
        },
      ],
      order: 3,
      _id: "67f0bd3764bdae3f97591da3",
      createdAt: "2025-04-05T05:18:47.344Z",
    },
    {
      SectionId: "841887b1-2ea1-4cf2-a176-aafe777570f6",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle: "Q4. Family background",
      description: "",
      questions: [
        {
          questionId: "8cd04c8f-5e5c-4a69-8776-9adc53995fd3",
          sectionId: "841887b1-2ea1-4cf2-a176-aafe777570f6",
          questionText: "Heightened expectations for a good paying job",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [],
          _id: "67f0bd3764bdae3f97591da7",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.345Z",
        },
        {
          questionId: "76531976-2064-4e8e-9f99-4a8873185ea2",
          sectionId: "841887b1-2ea1-4cf2-a176-aafe777570f6",
          questionText: "Financial issues",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [],
          _id: "67f0bd3764bdae3f97591da8",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.345Z",
        },
      ],
      order: 4,
      _id: "67f0bd3764bdae3f97591da6",
      createdAt: "2025-04-05T05:18:47.345Z",
    },
    {
      SectionId: "37460bca-c4e3-49a6-a154-d793b6f9ea48",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle: "Q5. Social Isolation",
      description: "",
      questions: [
        {
          questionId: "3b218b96-3a01-4223-a677-9ea578dd39c2",
          sectionId: "37460bca-c4e3-49a6-a154-d793b6f9ea48",
          questionText: "Lack of friends and no involvement in any society",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [],
          _id: "67f0bd3764bdae3f97591daa",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.345Z",
        },
        {
          questionId: "49afd748-ea66-4ff5-9f78-6434ba6312c7",
          sectionId: "37460bca-c4e3-49a6-a154-d793b6f9ea48",
          questionText: "Home sickness",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [],
          _id: "67f0bd3764bdae3f97591dab",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.346Z",
        },
        {
          questionId: "d2f2e124-9354-4075-948f-d76d07abf3f4",
          sectionId: "37460bca-c4e3-49a6-a154-d793b6f9ea48",
          questionText:
            "Over usage of social media, leading to cutting off from real world",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 2,
          options: [],
          _id: "67f0bd3764bdae3f97591dac",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.346Z",
        },
      ],
      order: 5,
      _id: "67f0bd3764bdae3f97591da9",
      createdAt: "2025-04-05T05:18:47.346Z",
    },
    {
      SectionId: "80409639-3a9a-459a-b803-89c4b57de5f6",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle: "Q6. Relationship issues",
      description: "",
      questions: [
        {
          questionId: "86d69fa7-49c6-40b3-944a-2e33e65810b0",
          sectionId: "80409639-3a9a-459a-b803-89c4b57de5f6",
          questionText: "Trust issues",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [],
          _id: "67f0bd3764bdae3f97591dae",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.433Z",
        },
        {
          questionId: "8f91eb7f-50cc-42b4-9103-4039afb30cfd",
          sectionId: "80409639-3a9a-459a-b803-89c4b57de5f6",
          questionText: "Anxiety and difficulty in dealing with breakups",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [],
          _id: "67f0bd3764bdae3f97591daf",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.433Z",
        },
      ],
      order: 6,
      _id: "67f0bd3764bdae3f97591dad",
      createdAt: "2025-04-05T05:18:47.433Z",
    },
    {
      SectionId: "22f68b58-5f42-4823-9653-535e1595420d",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle: "Q7. Health and hygiene",
      description: "",
      questions: [
        {
          questionId: "64d08e0d-0f70-4e4e-a440-249fe7ada51d",
          sectionId: "22f68b58-5f42-4823-9653-535e1595420d",
          questionText: "Lack of facilities at BC Roy Hospital",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [],
          _id: "67f0bd3764bdae3f97591db1",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.433Z",
        },
        {
          questionId: "7bd91b5a-7710-449f-809b-ed96a8a8203e",
          sectionId: "22f68b58-5f42-4823-9653-535e1595420d",
          questionText: "Unhygienic washrooms and contaminated water",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [],
          _id: "67f0bd3764bdae3f97591db2",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.434Z",
        },
      ],
      order: 7,
      _id: "67f0bd3764bdae3f97591db0",
      createdAt: "2025-04-05T05:18:47.434Z",
    },
    {
      SectionId: "5e3fdd15-bdda-47b5-84e5-05f4cd173230",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle: "Q8. Intoxication",
      description: "",
      questions: [
        {
          questionId: "2c5ec52a-d4a0-45ea-9c13-78ed000033e5",
          sectionId: "5e3fdd15-bdda-47b5-84e5-05f4cd173230",
          questionText:
            "Ill effects of smoking and drinking (Substance Addiction)",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [],
          _id: "67f0bd3764bdae3f97591db4",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.434Z",
        },
        {
          questionId: "4ffd89d4-ffb0-4df5-a622-5301bf65de36",
          sectionId: "5e3fdd15-bdda-47b5-84e5-05f4cd173230",
          questionText: "Pressure to get intoxicated",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [],
          _id: "67f0bd3764bdae3f97591db5",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.434Z",
        },
      ],
      order: 8,
      _id: "67f0bd3764bdae3f97591db3",
      createdAt: "2025-04-05T05:18:47.434Z",
    },
    {
      SectionId: "d8e1f7a6-783e-481a-9917-09d57edd9f2d",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle: "Q9. Stigma around mental health",
      description: "",
      questions: [
        {
          questionId: "0b0293dd-9196-4939-b248-83fa0a43a065",
          sectionId: "d8e1f7a6-783e-481a-9917-09d57edd9f2d",
          questionText:
            "Unable to share personal issues with anyone (maybe due to the fear of getting mocked)",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [],
          _id: "67f0bd3764bdae3f97591db7",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.345Z",
        },
        {
          questionId: "fc1237a9-003d-4b90-ab54-495c4f102a52",
          sectionId: "d8e1f7a6-783e-481a-9917-09d57edd9f2d",
          questionText: "Inefficiency of counselling center",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [],
          _id: "67f0bd3764bdae3f97591db8",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.435Z",
        },
      ],
      order: 9,
      _id: "67f0bd3764bdae3f97591db6",
      createdAt: "2025-04-05T05:18:47.435Z",
    },
    {
      SectionId: "192452d4-1a1e-4f0f-958b-8dd0e8877c26",
      formId: "28f53a50-0e39-11f0-8b6b-5b5717dbc6cc",
      sectionTitle: "Q10. Miscellaneous",
      description: "",
      questions: [
        {
          questionId: "9e19820f-8a54-447a-85a6-3ed258019594",
          sectionId: "192452d4-1a1e-4f0f-958b-8dd0e8877c26",
          questionText: "Stray dogs phobia",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 0,
          options: [],
          _id: "67f0bd3764bdae3f97591dba",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.435Z",
        },
        {
          questionId: "f8b1fd54-a8e3-4356-8022-79f73bc8a3ce",
          sectionId: "192452d4-1a1e-4f0f-958b-8dd0e8877c26",
          questionText: "Language barrier",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 1,
          options: [],
          _id: "67f0bd3764bdae3f97591dbb",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.436Z",
        },
        {
          questionId: "91ec4f56-c25b-43b0-b4b9-3151617aa4cd",
          sectionId: "192452d4-1a1e-4f0f-958b-8dd0e8877c26",
          questionText:
            "Acclimatization issues due to different geographical location than your hometown",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 2,
          options: [],
          _id: "67f0bd3764bdae3f97591dbc",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.436Z",
        },
        {
          questionId: "c9052a81-21ba-4f4d-8a6a-522041868862",
          sectionId: "192452d4-1a1e-4f0f-958b-8dd0e8877c26",
          questionText: "Monopoly of toto drivers regarding conveyance charges",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 3,
          options: [],
          _id: "67f0bd3764bdae3f97591dbd",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.436Z",
        },
        {
          questionId: "5b5a634b-0626-447c-b98c-0e1fa580785d",
          sectionId: "192452d4-1a1e-4f0f-958b-8dd0e8877c26",
          questionText:
            "Lack of privacy, as in the case of multiple sharing rooms (or some other reasons)",
          type: "linear-scale",
          isRequired: true,
          dependencies: [],
          order: 4,
          options: [],
          _id: "67f0bd3764bdae3f97591dbe",
          dependentOn: [],
          createdAt: "2025-04-05T05:18:47.436Z",
        },
      ],
      order: 10,
      _id: "67f0bd3764bdae3f97591db9",
      createdAt: "2025-04-05T05:18:47.436Z",
    },
  ],
  version: 17,
  isPublic: false,
};

// Create custom styles
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f8f9ff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 12px 28px rgba(0, 0, 0, 0.15)",
    },
  },
  formHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    padding: theme.spacing(3, 4),
    borderRadius: "12px 12px 0 0",
    position: "relative",
    overflow: "hidden",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage:
        "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
    },
  },
  formTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  formDescription: {
    opacity: 0.95,
    fontSize: "1.1rem",
    lineHeight: 1.6,
    maxWidth: "800px",
    margin: "0 auto",
    padding: theme.spacing(1, 0),
    borderTop: "1px solid rgba(255,255,255,0.2)",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
  },
  progress: {
    height: 8,
    borderRadius: 4,
    margin: theme.spacing(0, 0, 2, 0),
  },
  progressBar: {
    borderRadius: 4,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    marginBottom: theme.spacing(3),
    border: "1px solid rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    },
  },
  accordion: {
    boxShadow: "none",
    borderRadius: "12px !important",
    "&:before": {
      display: "none",
    },
    "&.Mui-expanded": {
      margin: 0,
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    },
  },
  accordionSummary: {
    borderRadius: "12px 12px 0 0",
    backgroundColor: theme.palette.grey[50],
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
    },
    "&.Mui-expanded": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
  },
  accordionDetails: {
    padding: theme.spacing(3),
    display: "block",
  },
  submitButton: {
    padding: theme.spacing(1.5, 4),
    borderRadius: "10px",
    fontWeight: 600,
    textTransform: "none",
    fontSize: "1rem",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 6px 14px rgba(0, 0, 0, 0.2)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
      transform: "translateY(1px)",
    },
  },
  errorBox: {
    backgroundColor: "#fff0f0",
    borderRadius: "12px",
    border: `1px solid ${theme.palette.error.light}`,
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(3),
    display: "flex",
    alignItems: "flex-start",
  },
  errorIcon: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(0.5),
  },
  successBox: {
    backgroundColor: "#f0fff5",
    borderRadius: "12px",
    padding: theme.spacing(4),
    textAlign: "center",
    maxWidth: 600,
    margin: "0 auto",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  },
  successIcon: {
    fontSize: 64,
    color: theme.palette.success.main,
    margin: theme.spacing(2, 0),
  },
  loadingContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

interface RouteParams extends Record<string, string | undefined> {
  userId: string;
  id: string;
}

// Define a type for form responses
type FormResponse = string | number | boolean | string[] | null;

// Define validation error type
interface ValidationError {
  questionId: string;
  message: string;
}

const FrontendDisplay: React.FC = () => {
  const { userId, id: formId } = useParams<RouteParams>();
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [formData, setFormData] = useState<Form | null>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [responses, setResponses] = useState<Record<string, FormResponse>>({});
  const [expandedSection, setExpandedSection] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // Calculate progress when responses change
  useEffect(() => {
    if (formData) {
      const totalRequiredQuestions = formData.sections.reduce(
        (count, section) => {
          return count + section.questions.filter((q) => q.isRequired).length;
        },
        0
      );

      const answeredRequiredQuestions = formData.sections.reduce(
        (count, section) => {
          return (
            count +
            section.questions.filter(
              (q) =>
                q.isRequired &&
                responses[q.questionId] !== undefined &&
                responses[q.questionId] !== null &&
                responses[q.questionId] !== ""
            ).length
          );
        },
        0
      );

      const progress =
        totalRequiredQuestions > 0
          ? (answeredRequiredQuestions / totalRequiredQuestions) * 100
          : 0;

      setProgressValue(progress);
    }
  }, [responses, formData]);

  // Fetch form data from the backend using the public endpoint
  useEffect(() => {
    const fetchForm = async () => {
      if (!formId || !userId) return;

      try {
        setLoading(true);
        setError(null);

        // Check if the current URL is the specific endpoint
        const currentUrl = window.location.href;

        if (
          currentUrl.includes(
            "dsy49p56mtk7n.cloudfront.net/67eaa0fb7cab6be7eb0b8689/28f53a50-0e39-11f0-8b6b-5b5717dbc6cc/sub"
          ) ||
          currentUrl.includes(
            "localhost:5173/67eaa0fb7cab6be7eb0b8689/28f53a50-0e39-11f0-8b6b-5b5717dbc6cc/sub"
          )
        ) {
          console.log("Using predefined psychological wellbeing form data");

          // Use the predefined form data
          setFormData(psychologicalWellBeingForm as unknown as Form);
          currentFormId = psychologicalWellBeingForm.formId;

          // Store in localStorage for easier loading later
          localStorage.setItem(
            psychologicalWellBeingForm.formId,
            JSON.stringify(psychologicalWellBeingForm)
          );

          // Automatically expand the first section
          if (
            psychologicalWellBeingForm.sections &&
            psychologicalWellBeingForm.sections.length > 0
          ) {
            setExpandedSection(
              psychologicalWellBeingForm.sections[0].SectionId
            );
          }
          setLoading(false);

          // Make a GET request to warm up the root backend endpoint
          try {
            await api.get("/");
            console.log("Backend endpoint warmed up successfully");
          } catch {
            console.log(
              "Backend warm-up request failed, but proceeding with form display"
            );
          }

          return;
        }

        // Continue with normal API request if not the special URL
        const response = await api.get(
          `/forms/public/${formId}?userId=${userId}`
        );

        if (response.data) {
          console.log("Form data received:", response.data);
          console.log("Form description:", response.data.description);
          setFormData(response.data);
          currentFormId = response.data.formId;

          // Automatically expand the first section
          if (response.data.sections && response.data.sections.length > 0) {
            setExpandedSection(response.data.sections[0].SectionId);
          }
        } else {
          throw new Error("Form not found");
        }
      } catch (err) {
        console.error("Error fetching form:", err);

        // Fallback to localStorage for development purposes
        const storedData = localStorage.getItem(formId)
          ? JSON.parse(localStorage.getItem(formId) as string)
          : null;

        if (storedData) {
          console.log("Using stored form data:", storedData);
          console.log("Stored form description:", storedData.description);
          setFormData(storedData as Form);
          currentFormId = storedData.formId;

          // Automatically expand the first section
          if (storedData.sections && storedData.sections.length > 0) {
            setExpandedSection(storedData.sections[0].SectionId);
          }
        } else {
          // Last resort: use test data
          console.log("Using test data:", testData);
          console.log("Test data description:", testData.description);
          setFormData(testData as Form);
          setError("Could not fetch form data. Using test data instead.");

          // Automatically expand the first section
          if (testData.sections && testData.sections.length > 0) {
            setExpandedSection(testData.sections[0].SectionId);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [userId, formId]);

  // Validate form responses
  const validateForm = (): ValidationError[] => {
    if (!formData) return [];

    const errors: ValidationError[] = [];

    // Check all questions in all sections
    formData.sections.forEach((section) => {
      section.questions.forEach((question) => {
        // Skip validation if question is not required
        if (!question.isRequired) return;

        const response = responses[question.questionId];

        // Check if required question is answered
        if (response === undefined || response === null || response === "") {
          errors.push({
            questionId: question.questionId,
            message: "This question requires an answer",
          });
        }

        // Type-specific validation
        if (response !== undefined && response !== null) {
          validateQuestionType(question, response, errors);
        }
      });
    });

    return errors;
  };

  // Validate specific question types
  const validateQuestionType = (
    question: {
      questionId: string;
      type: string;
    },
    response: FormResponse,
    errors: ValidationError[]
  ) => {
    switch (question.type) {
      case "integer":
        if (typeof response === "string" && !/^\d+$/.test(response)) {
          errors.push({
            questionId: question.questionId,
            message: "Please enter a valid integer",
          });
        }
        break;
      case "number":
        if (typeof response === "string" && !/^\d+(\.\d+)?$/.test(response)) {
          errors.push({
            questionId: question.questionId,
            message: "Please enter a valid number",
          });
        }
        break;
      case "multi-select":
        if (!Array.isArray(response) || response.length === 0) {
          errors.push({
            questionId: question.questionId,
            message: "Please select at least one option",
          });
        }
        break;
    }
  };

  const handleResponseChange = (questionId: string, value: FormResponse) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));

    // Clear validation errors for this question when user modifies the answer
    setValidationErrors((prev) =>
      prev.filter((error) => error.questionId !== questionId)
    );
  };

  const handleSectionChange = (sectionId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_event: any, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? sectionId : false);
    };
  };

  const handleSubmit = async () => {
    // Validate form before submission
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);

      // Find the first section with errors and expand it
      if (formData) {
        const firstErrorQuestionId = errors[0].questionId;
        const sectionWithError = formData.sections.find((section) =>
          section.questions.some((q) => q.questionId === firstErrorQuestionId)
        );

        if (sectionWithError) {
          setExpandedSection(sectionWithError.SectionId);
        }
      }

      // Scroll to the top where errors are displayed
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setDisableSubmit(true);

      // Format the data according to the required structure
      const formattedSections =
        formData?.sections.map((section) => {
          // Get all questions for this section with their responses
          const sectionQuestions = section.questions.map((question) => ({
            questionId: question.questionId,
            questionType: question.type,
            response: responses[question.questionId] || null,
            // Include responseId if available (usually for updates)
            responseId: undefined,
          }));

          return {
            sectionId: section.SectionId,
            sectionTitle: section.sectionTitle,
            questions: sectionQuestions,
          };
        }) || [];

      // Prepare submission data for the public endpoint
      const submissionData = {
        userId: userId,
        formId: currentFormId,
        sections: formattedSections,
        status: "submitted",
      };

      // Log the submission data for debugging
      console.log("Submitting form data:", JSON.stringify(submissionData));

      // Submit to the public endpoint
      const response = await api.post("/data/public/submit", submissionData);

      console.log("Form submission response:", response.data);
      setSubmitSuccess(true);

      // Clear responses after successful submission
      setResponses({});
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit form. Please try again.");
    } finally {
      setDisableSubmit(false);
    }
  };

  if (loading) {
    return (
      <Fade in={loading} timeout={800}>
        <Box className={classes.loadingContainer}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" className={classes.loadingText}>
            Loading form...
          </Typography>
        </Box>
      </Fade>
    );
  }

  if (!formData) {
    return (
      <Zoom in={!formData} timeout={500}>
        <Box p={3} textAlign="center" className={classes.errorBox}>
          <ErrorIcon fontSize="large" />
          <Box>
            <Typography variant="h5" color="error" gutterBottom>
              Error: Could not load form
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        </Box>
      </Zoom>
    );
  }

  if (submitSuccess) {
    return (
      <Zoom in={submitSuccess} timeout={800}>
        <Box className={classes.successBox}>
          <CheckCircleIcon className={classes.successIcon} />
          <Typography variant="h4" color="primary" gutterBottom>
            Thank you!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Your response has been recorded successfully.
          </Typography>
          <Typography variant="body1" paragraph>
            We appreciate your time and valuable feedback.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            className={classes.submitButton}
            style={{ marginTop: theme.spacing(2) }}
          >
            Submit Another Response
          </Button>
        </Box>
      </Zoom>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Paper
        className={classes.root}
        style={{
          maxWidth: isMobile ? "100%" : isTablet ? "90%" : "80%",
          margin: isMobile ? "0.5rem auto" : "2rem auto",
          padding: 0,
        }}
      >
        {/* Form Header */}
        <Box className={classes.formHeader}>
          <Typography variant="h4" className={classes.formTitle}>
            {formData.formTitle}
          </Typography>
          {formData.description && (
            <Box mt={2}>
              <Typography variant="body1" className={classes.formDescription}>
                {formData.description}
              </Typography>
            </Box>
          )}
        </Box>

        <Box p={isMobile ? 2 : 4}>
          {/* Progress bar */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="textSecondary">
                Progress
              </Typography>
              <Typography variant="body2" color="primary">
                {Math.round(progressValue)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              className={classes.progress}
              classes={{
                bar: classes.progressBar,
              }}
            />
          </Box>

          {/* Display validation errors at the top */}
          {validationErrors.length > 0 && (
            <Zoom in={validationErrors.length > 0} timeout={400}>
              <Box className={classes.errorBox} mb={3}>
                <ErrorIcon className={classes.errorIcon} />
                <Box>
                  <Typography variant="subtitle1" color="error" gutterBottom>
                    Please fix the following errors:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                    {validationErrors.map((error, index) => (
                      <li key={index}>
                        <Typography variant="body2" color="error">
                          {error.message} (Question ID: {error.questionId})
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>
            </Zoom>
          )}

          {/* Display general error */}
          {error && (
            <Zoom in={!!error} timeout={400}>
              <Box className={classes.errorBox} mb={3}>
                <ErrorIcon className={classes.errorIcon} />
                <Typography color="error">{error}</Typography>
              </Box>
            </Zoom>
          )}

          {/* Render each section */}
          {formData.sections.map((section, index) => {
            // The Introduction section is always visible.
            if (section.sectionTitle.toLowerCase() === "introduction") {
              return (
                <Zoom
                  in={true}
                  timeout={400}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  key={section.SectionId}
                >
                  <Box className={classes.section} mb={3}>
                    <Box p={isMobile ? 2 : 3}>
                      <Typography
                        variant="h5"
                        style={{
                          fontWeight: 600,
                          marginBottom: theme.spacing(2),
                          color: theme.palette.primary.main,
                        }}
                      >
                        {section.sectionTitle}
                      </Typography>

                      {section.description && (
                        <Box mb={2}>
                          <Typography variant="body1" color="textSecondary">
                            {section.description}
                          </Typography>
                          <Divider style={{ margin: theme.spacing(2, 0) }} />
                        </Box>
                      )}

                      <SectionDisplay
                        section={section}
                        responses={responses}
                        onResponseChange={handleResponseChange}
                        validationErrors={validationErrors}
                      />
                    </Box>
                  </Box>
                </Zoom>
              );
            } else {
              // Other sections are rendered as Accordions (collapsible panels)
              return (
                <Zoom
                  in={true}
                  timeout={400}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  key={section.SectionId}
                >
                  <Accordion
                    expanded={expandedSection === section.SectionId}
                    onChange={handleSectionChange(section.SectionId)}
                    className={classes.accordion}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      className={classes.accordionSummary}
                    >
                      <Typography
                        variant="h6"
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {section.sectionTitle}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails}>
                      {section.description && (
                        <Box mb={2}>
                          <Typography variant="body1" color="textSecondary">
                            {section.description}
                          </Typography>
                          <Divider style={{ margin: theme.spacing(2, 0) }} />
                        </Box>
                      )}

                      <SectionDisplay
                        section={section}
                        responses={responses}
                        onResponseChange={handleResponseChange}
                        validationErrors={validationErrors}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Zoom>
              );
            }
          })}

          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={disableSubmit}
              className={classes.submitButton}
              size={isMobile ? "medium" : "large"}
              disableElevation={false}
            >
              {disableSubmit ? (
                <>
                  <CircularProgress
                    size={24}
                    color="inherit"
                    style={{ marginRight: 10 }}
                  />
                  Submitting...
                </>
              ) : (
                "Submit Response"
              )}
            </Button>
          </Box>
        </Box>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </Paper>
    </Fade>
  );
};

export default FrontendDisplay;
