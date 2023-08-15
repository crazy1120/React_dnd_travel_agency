import { Button, Typography } from "@mui/material";
import styles from "./Theming.module.css";
import ThemingItem from "./ThemingItem";
import ImageIcon from "@mui/icons-material/Image";
import ColorPicker from "./ColorPicker";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changeAttribute, changeResources } from "~/state/design/designState";
import { defaultSurveyTheme } from "~/constants/theme";
import DesignService from "~/services/DesignService";

function Theming({ t }) {
  const dispatch = useDispatch();

  const theme = useSelector((state) => {
    return state.designState.Survey.theme;
  });

  function handleChange(key, val) {
    dispatch(
      changeAttribute({
        code: "Survey",
        key: "theme",
        value: { ...theme, [key]: val },
      })
    );
  }

  function handleImageChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    DesignService.uploadResource(file)
      .then((response) => {
        dispatch(
          changeResources({
            code: "Survey",
            key: "headerImage",
            value: file.name,
          })
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className={styles.theming}>
      <h5>{t("text_style")}</h5>

      <h6>{t("group_title")}</h6>

      <ThemingItem
        key="group"
        value={theme.textStyles.group}
        default={defaultSurveyTheme.textStyles.group}
        onChange={(val) => {
          handleChange("textStyles", { ...theme.textStyles, ["group"]: val });
        }}
      />
      <hr />
      <h6>{t("question_title")}</h6>

      <ThemingItem
        key="question"
        value={theme.textStyles.question}
        default={defaultSurveyTheme.textStyles.question}
        onChange={(val) =>
          handleChange("textStyles", { ...theme.textStyles, ["question"]: val })
        }
      />
      <hr />
      <h6>{t("theme_text")}</h6>
      <ThemingItem
        key="text"
        value={theme.textStyles.text}
        default={defaultSurveyTheme.textStyles.text}
        onChange={(val) =>
          handleChange("textStyles", { ...theme.textStyles, ["text"]: val })
        }
      />
      <hr />
      <h5>{t("highlight_color")}</h5>
      <ColorPicker
        color={theme.primaryColor}
        default={defaultSurveyTheme.primaryColor}
        handleChange={(value) => handleChange("primaryColor", value)}
      />

      <hr />
      <h5>{t("background_color")}</h5>
      <ColorPicker
        color={theme.bgColor}
        default={defaultSurveyTheme.bgColor}
        handleChange={(value) => handleChange("bgColor", value)}
      />
      <hr />
      <h5>{t("foreground_color")}</h5>
      <ColorPicker
        color={theme.paperColor}
        default={defaultSurveyTheme.paperColor}
        handleChange={(value) => handleChange("paperColor", value)}
      />
      <hr />
      <h5>{t("theme_header")}</h5>
      <Button variant="outlined" component="label">
        <ImageIcon className="mr-10" />
        {t("choose_image")}
        <input
          hidden
          accept="image/*"
          multiple
          type="file"
          onChange={handleImageChange}
        />
      </Button>
    </div>
  );
}

export default Theming;
