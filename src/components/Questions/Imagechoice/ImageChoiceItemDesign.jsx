import styles from "./ImageChoiceDesign.module.css";
import { Card, IconButton, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import PhotoCamera from "@mui/icons-material/Photo";
import {
  changeContent,
  changeResources,
  removeAnswer,
} from "~/state/design/designState";
import { GridItem } from "react-grid-dnd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { buildResourceUrl } from "~/networking/common";
import AddIcon from "@mui/icons-material/Add";
import DesignService from "~/services/DesignService";

function ImageChoiceItemDesign({
  qualifiedCode,
  imageHeight,
  hideText,
  spacing,
  type,
  t,
  addAnswer,
}) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const langInfo = useSelector((state) => {
    return state.designState.langInfo;
  });

  const answer = useSelector((state) => {
    return type == "add" ? undefined : state.designState[qualifiedCode];
  });
  const onMainLang = langInfo.lang === langInfo.mainLang;
  const lang = langInfo.lang;

  const content = useSelector((state) => {
    return type == "add"
      ? undefined
      : state.designState[qualifiedCode].content?.["label"]?.[lang];
  });

  const mainContent = useSelector((state) => {
    return type == "add"
      ? undefined
      : state.designState[qualifiedCode].content?.["label"]?.[
          langInfo.mainLang
        ];
  });

  const onDelete = () => {
    if (window.confirm(`Are you sure?`)) {
      dispatch(removeAnswer(qualifiedCode));
    }
  };

  const backgroundImage = answer?.resources?.image
    ? `url('${buildResourceUrl(answer.resources.image)}')`
    : "0";

  function handleImageChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    DesignService.uploadResource(file)
      .then((response) => {
        dispatch(
          changeResources({
            code: qualifiedCode,
            key: "image",
            value: file.name,
          })
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return type == "add" ? (
    <GridItem
      key="add"
      style={{
        padding: spacing + "px",
      }}
    >
      <Card
        className={styles.addAnswerButton}
        style={{
          backgroundColor: theme.palette.background.default,
          height: imageHeight + "px",
          width: "100%",
        }}
      >
        <IconButton
          className={styles.addAnswerIcon}
          onClick={() => {
            addAnswer();
          }}
        >
          <AddIcon />
        </IconButton>
      </Card>
    </GridItem>
  ) : (
    <GridItem
      key={qualifiedCode}
      style={{
        padding: spacing + "px",
      }}
    >
      <Card
        className={styles.imageContainer}
        style={{
          backgroundImage: backgroundImage,
          backgroundColor: theme.palette.background.default,
          height: imageHeight + "px",
        }}
      >
        {onMainLang && (
          <IconButton
            className={styles.imageIconButton}
            onClick={() => {
              onDelete();
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        )}
        {onMainLang && (
          <IconButton component="label" className={styles.imageIconButton}>
            <input
              hidden
              id={qualifiedCode}
              accept="image/*"
              multiple
              type="file"
              onChange={handleImageChange}
            />
            <PhotoCamera />
          </IconButton>
        )}
      </Card>
      {!hideText && (
        <TextField
          variant="standard"
          value={content || ""}
          onChange={(e) =>
            dispatch(
              changeContent({
                code: qualifiedCode,
                key: "label",
                lang: lang,
                value: e.target.value,
              })
            )
          }
          placeholder={
            onMainLang
              ? t("content_editor_placeholder_option")
              : mainContent || t("content_editor_placeholder_option")
          }
          InputProps={{
            sx: {
              fontFamily: theme.textStyles.text.font,
              color: theme.textStyles.text.color,
              fontSize: theme.textStyles.text.size,
            },
          }}
        />
      )}
    </GridItem>
  );
}

export default ImageChoiceItemDesign;
