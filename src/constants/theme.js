export const BG_COLOR = "#d7ccc8";
export const TEXT_COLOR = "#000000CC";
export const PRIMARY_COLOR = "#3f51b5";
export const SECONDARY_COLOR = "#5e35b1";
export const ERR_COLOR = "#f44336";
export const PAPER_COLOR = "#fafafa";

export const defualtTheme = (theme) => {
  return {
    textStyles: {
      group: {
        font: theme?.textStyles?.group?.font || "Google Sans",
        size: theme?.textStyles?.group?.size || 26,
        color: theme?.textStyles?.group?.color || TEXT_COLOR,
      },
      question: {
        font: theme?.textStyles?.question?.font || "Google Sans",
        size: theme?.textStyles?.question?.size || 18,
        color: theme?.textStyles?.question?.color || TEXT_COLOR,
      },
      text: {
        font: theme?.textStyles?.text?.font || "Google Sans",
        size: theme?.textStyles?.text?.size || 14,
        color: theme?.textStyles?.text?.color || TEXT_COLOR,
      },
    },
    palette: {
      type: "light",
      primary: {
        main: theme?.primaryColor || PRIMARY_COLOR,
      },
      secondary: {
        main: SECONDARY_COLOR,
      },
      error: {
        main: ERR_COLOR,
      },
      background: {
        default: theme?.bgColor || BG_COLOR,
        paper: theme?.paperColor || PAPER_COLOR,
      },
    },
  };
};

export const defaultSurveyTheme = {
  textStyles: {
    group: {
      font: "Google Sans",
      size: 26,
      color: TEXT_COLOR,
    },
    question: {
      font: "Google Sans",
      size: 18,
      color: TEXT_COLOR,
    },
    text: {
      font: "Google Sans",
      size: 14,
      color: TEXT_COLOR,
    },
  },
  primaryColor: PRIMARY_COLOR,
  bgColor: BG_COLOR,
  paperColor: PAPER_COLOR,
};
