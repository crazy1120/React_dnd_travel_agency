import React from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AbcIcon from "@mui/icons-material/Abc";
import PinIcon from "@mui/icons-material/Pin";
import FeedIcon from "@mui/icons-material/Feed";
import PhotoIcon from "@mui/icons-material/Photo";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TodayIcon from "@mui/icons-material/Today";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BurstModeIcon from "@mui/icons-material/BurstMode";
import SortIcon from "@mui/icons-material/Sort";
import BrushIcon from "@mui/icons-material/Brush";
import VideocamIcon from "@mui/icons-material/Videocam";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import SpeedIcon from "@mui/icons-material/Speed";
import QrCodeIcon from "@mui/icons-material/QrCode";
import DvrIcon from "@mui/icons-material/Dvr";
import PagesIcon from "@mui/icons-material/Pages";
import FlagIcon from "@mui/icons-material/Flag";
import StartIcon from "@mui/icons-material/Start";

export const groupIconByType = (type, size = "medium") => {
  switch (type) {
    case "welcome":
      return <StartIcon fontSize={size} />;
    case "end":
      return <FlagIcon fontSize={size} />;
      default:
        return <PagesIcon fontSize={size} />;
  }
};

export const questionIconByType = (type, size = "medium") => {
  switch (type) {
    case "text":
      return <AbcIcon fontSize={size} />;
    case "paragraph":
      return <FeedIcon fontSize={size} />;
    case "barcode":
      return <QrCodeIcon fontSize={size} />;
    case "number":
      return <PinIcon fontSize={size} />;
    case "email":
      return <MailOutlineIcon fontSize={size} />;
    case "scq":
      return <RadioButtonCheckedIcon fontSize={size} />;
    case "image_scq":
      return <PhotoIcon fontSize={size} />;
    case "scq_array":
      return <RadioButtonCheckedIcon fontSize={size} />;
    case "mcq":
      return <CheckBoxIcon fontSize={size} />;
    case "image_mcq":
      return <BurstModeIcon fontSize={size} />;
    case "nps":
      return <SpeedIcon fontSize={size} />;
    case "date":
      return <TodayIcon fontSize={size} />;
    case "date_time":
      return <EventAvailableIcon fontSize={size} />;
    case "time":
      return <ScheduleIcon fontSize={size} />;
    case "file_upload":
      return <UploadFileIcon fontSize={size} />;
    case "signature":
      return <BrushIcon fontSize={size} />;
    case "photo_capture":
      return <PhotoIcon fontSize={size} />;
    case "video_capture":
      return <VideocamIcon fontSize={size} />;
    case "ranking":
      return <SortIcon fontSize={size} />;
    case "image_ranking":
      return <AutoAwesomeMotionIcon fontSize={size} />;
    case "text_display":
      return <DvrIcon fontSize={size} />;
    case "image_display":
      return <PhotoIcon fontSize={size} />;
    case "video_display":
      return <VideocamIcon fontSize={size} />;
  }
};

export const QUESTION_TYPES = [
  {
    name: "section_text_based",
    type: "text",
    items: [
      {
        type: "text",
        icon: questionIconByType("text"),
      },
      {
        type: "paragraph",
        icon: questionIconByType("paragraph"),
      },
      {
        type: "number",
        icon: questionIconByType("number"),
      },
      {
        type: "email",
        icon: questionIconByType("email"),
      },
    ],
  },
  {
    name: "section_choice_based",
    type: "choice",
    items: [
      {
        type: "scq",
        icon: questionIconByType("scq"),
      },
      {
        type: "image_scq",
        icon: questionIconByType("image_scq"),
      },
      {
        type: "scq_array",
        icon: questionIconByType("scq_array"),
      },
      {
        type: "mcq",
        icon: questionIconByType("mcq"),
      },
      {
        type: "image_mcq",
        icon: questionIconByType("image_mcq"),
      },
      {
        type: "nps",
        icon: questionIconByType("nps"),
      },
    ],
  },
  {
    name: "section_date_time",
    type: "date-time",
    items: [
      {
        type: "date",
        icon: questionIconByType("date"),
      },
      {
        type: "date_time",
        icon: questionIconByType("date_time"),
      },
      {
        type: "time",
        icon: questionIconByType("time"),
      },
    ],
  },
  {
    name: "section_file_based",
    type: "file",
    items: [
      {
        type: "file_upload",
        icon: questionIconByType("file_upload"),
      },
      {
        type: "signature",
        icon: questionIconByType("signature"),
      },
      {
        type: "photo_capture",
        offlineOnly: true,
        icon: questionIconByType("photo_capture"),
      },
      {
        type: "video_capture",
        offlineOnly: true,
        icon: questionIconByType("video_capture"),
      },
    ],
  },
  {
    name: "section_other",
    type: "other",
    items: [
      {
        type: "ranking",
        icon: questionIconByType("ranking"),
      },
      {
        type: "image_ranking",
        icon: questionIconByType("image_ranking"),
      },
      {
        type: "barcode",
        offlineOnly: true,
        icon: questionIconByType("barcode"),
      },
    ],
  },
  {
    name: "section_info",
    type: "info",
    items: [
      {
        type: "text_display",
        icon: questionIconByType("text_display"),
      },
      {
        type: "image_display",
        icon: questionIconByType("image_display"),
      },
      {
        type: "video_display",
        icon: questionIconByType("video_display"),
      },
    ],
  },
];

export const createQuestion = (type, qId, lang) => {
  let code = `Q${qId}`;
  let returnObj = {};
  let state = { type };
  let newQuestion = { code: `Q${qId}`, qualifiedCode: `Q${qId}`, type };
  returnObj[code] = state;
  returnObj.question = newQuestion;
  switch (type) {
    case "text":
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "String",
          },
          text: "",
        },
      ];
      state.maxChars = 30;
      state.showHint = true;
      break;
    case "number":
      state.maxChars = 30;
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "Double",
          },
          text: "",
        },
      ];
      state.showHint = true;
      break;
    case "email":
      state.maxChars = 30;
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "String",
          },
          text: "",
        },
      ];
      state.showHint = true;
      break;
    case "paragraph":
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "String",
          },
          text: "",
        },
      ];
      state.showHint = true;
      break;
    case "barcode":
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "String",
          },
          text: "",
        },
        {
          code: "mode",
          isActive: false,
          returnType: {
            name: "String",
          },
          text: "offline",
        },
      ];
      state.showHint = true;
      break;
    case "scq":
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "String",
          },
          text: "",
        },
      ];
      returnObj[`Q${qId}A1`] = {};
      returnObj[`Q${qId}A2`] = {};
      returnObj[`Q${qId}A3`] = {};
      state.children = [
        {
          code: "A1",
          qualifiedCode: `Q${qId}A1`,
        },
        {
          code: "A2",
          qualifiedCode: `Q${qId}A2`,
        },
        {
          code: "A3",
          qualifiedCode: `Q${qId}A3`,
        },
      ];
      break;
    case "image_scq":
      state.columns = 3;
      state.imageAspectRatio = 1;
      state.spacing = 8;
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "String",
          },
          text: "",
        },
      ];
      returnObj[`Q${qId}A1`] = {};
      returnObj[`Q${qId}A2`] = {};
      returnObj[`Q${qId}A3`] = {};
      state.children = [
        {
          code: "A1",
          qualifiedCode: `Q${qId}A1`,
        },
        {
          code: "A2",
          qualifiedCode: `Q${qId}A2`,
        },
        {
          code: "A3",
          qualifiedCode: `Q${qId}A3`,
        },
      ];
      break;
    case "mcq":
      returnObj[`Q${qId}A1`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Boolean",
            },
            text: "",
          },
        ],
      };
      returnObj[`Q${qId}A2`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Boolean",
            },
            text: "",
          },
        ],
      };
      returnObj[`Q${qId}A3`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Boolean",
            },
            text: "",
          },
        ],
      };
      state.children = [
        {
          code: "A1",
          qualifiedCode: `Q${qId}A1`,
        },
        {
          code: "A2",
          qualifiedCode: `Q${qId}A2`,
        },
        {
          code: "A3",
          qualifiedCode: `Q${qId}A3`,
        },
      ];
      break;
    case "image_ranking":
      state.columns = 3;
      state.imageAspectRatio = 1;
      state.spacing = 8;
      returnObj[`Q${qId}A1`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Int",
            },
            text: "",
          },
        ],
      };
      returnObj[`Q${qId}A2`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Int",
            },
            text: "",
          },
        ],
      };
      returnObj[`Q${qId}A3`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Int",
            },
            text: "",
          },
        ],
      };
      state.children = [
        {
          code: "A1",
          qualifiedCode: `Q${qId}A1`,
        },
        {
          code: "A2",
          qualifiedCode: `Q${qId}A2`,
        },
        {
          code: "A3",
          qualifiedCode: `Q${qId}A3`,
        },
      ];
      break;
    case "ranking":
      returnObj[`Q${qId}A1`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Int",
            },
            text: "",
          },
        ],
      };
      returnObj[`Q${qId}A2`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Int",
            },
            text: "",
          },
        ],
      };
      returnObj[`Q${qId}A3`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Int",
            },
            text: "",
          },
        ],
      };
      state.children = [
        {
          code: "A1",
          qualifiedCode: `Q${qId}A1`,
        },
        {
          code: "A2",
          qualifiedCode: `Q${qId}A2`,
        },
        {
          code: "A3",
          qualifiedCode: `Q${qId}A3`,
        },
      ];
      break;
    case "nps":
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "Int",
          },
          text: "",
        },
      ];
      break;
    case "image_mcq":
      state.columns = 3;
      state.imageAspectRatio = 1;
      state.spacing = 8;
      returnObj[`Q${qId}A1`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Boolean",
            },
            text: "",
          },
        ],
      };
      returnObj[`Q${qId}A2`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Boolean",
            },
            text: "",
          },
        ],
      };
      returnObj[`Q${qId}A3`] = {
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "Boolean",
            },
            text: "",
          },
        ],
      };
      state.children = [
        {
          code: "A1",
          qualifiedCode: `Q${qId}A1`,
        },
        {
          code: "A2",
          qualifiedCode: `Q${qId}A2`,
        },
        {
          code: "A3",
          qualifiedCode: `Q${qId}A3`,
        },
      ];
      break;
    case "scq_array":
      returnObj[`Q${qId}Ac1`] = {
        type: "column",
      };
      returnObj[`Q${qId}Ac2`] = {
        type: "column",
      };
      returnObj[`Q${qId}Ac3`] = {
        type: "column",
      };
      returnObj[`Q${qId}A1`] = {
        type: "row",
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "String",
            },
            text: "",
          },
        ],
      };
      returnObj[`Q${qId}A2`] = {
        type: "row",
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "String",
            },
            text: "",
          },
        ],
      };
      returnObj[`Q${qId}A3`] = {
        type: "row",
        instructionList: [
          {
            code: "value",
            isActive: false,
            returnType: {
              name: "String",
            },
            text: "",
          },
        ],
      };
      state.children = [
        {
          code: "Ac1",
          qualifiedCode: `Q${qId}Ac1`,
          type: "column",
        },
        {
          code: "Ac2",
          qualifiedCode: `Q${qId}Ac2`,
          type: "column",
        },
        {
          code: "Ac3",
          qualifiedCode: `Q${qId}Ac3`,
          type: "column",
        },
        {
          code: "A1",
          qualifiedCode: `Q${qId}A1`,
          type: "row",
        },
        {
          code: "A2",
          qualifiedCode: `Q${qId}A2`,
          type: "row",
        },
        {
          code: "A3",
          qualifiedCode: `Q${qId}A3`,
          type: "row",
        },
      ];
      break;
    case "file_upload":
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "File",
          },
          text: "",
        },
      ];
      break;
    case "signature":
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "File",
          },
          text: "",
        },
      ];
      break;
    case "photo_capture":
      state.showHint = true;
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "File",
          },
          text: "",
        },
        {
          code: "mode",
          isActive: false,
          returnType: {
            name: "String",
          },
          text: "offline",
        },
      ];
      break;
    case "video_capture":
      state.showHint = true;
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "File",
          },
          text: "",
        },
        {
          code: "mode",
          isActive: false,
          returnType: {
            name: "String",
          },
          text: "offline",
        },
      ];
      break;
    case "date":
      state.type = "date";
      state.dateFormat = "YYYY/MM/DD";
      state.maxDate = "";
      state.minDate = "";
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "Date",
          },
          text: "",
        },
      ];
      break;
    case "date_time":
      state.dateFormat = "YYYY/MM/DD";
      state.fullDayFormat = false;
      state.maxDate = "";
      state.minDate = "";
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "Date",
          },
          text: "",
        },
      ];
      break;
    case "time":
      state.fullDayFormat = false;
      state.instructionList = [
        {
          code: "value",
          isActive: false,
          returnType: {
            name: "Date",
          },
          text: "",
        },
      ];
      break;
    case "text_display":
      break;
    case "video_display":
      break;
    case "image_display":
      break;
    default:
      break;
  }
  return returnObj;
};

export const questionDesignError = (question) => {
  let errors = [];
  switch (question.type) {
    case "scq_array":
      if (
        !question.children ||
        question.children.filter((child) => child.type == "row").length === 0
      ) {
        errors.push({
          code: "insufficient_rows_min_1",
          message: "must have at least 1 row",
        });
      }
      if (
        !question.children ||
        question.children.filter((child) => child.type == "column").length < 2
      ) {
        errors.push({
          code: "insufficient_cols_min_2",
          message: "must have at least 2 columns",
        });
      }
      break;
    case "image_ranking":
    case "ranking":
    case "image_scq":
    case "scq":
      if (!question.children || question.children.length < 2) {
        errors.push({
          code: "insufficient_options_min_2",
          message: "must have at least 2 options",
        });
      }
      break;

    case "image_mcq":
    case "mcq":
      if (!question.children || question.children.length < 1) {
        errors.push({
          code: "insufficient_options_min_1",
          message: "must have at least 1 option",
        });
      }
      break;
  }
  return errors;
};
