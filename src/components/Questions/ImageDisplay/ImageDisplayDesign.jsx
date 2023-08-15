import React, { useState } from "react";

import { useSelector } from "react-redux";
import { Button, CircularProgress } from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import { buildResourceUrl } from "~/networking/common";
import { useDispatch } from "react-redux";
import { changeResources } from "~/state/design/designState";
import styles from "./ImageDisplayDesign.module.css";
import DesignService from "~/services/DesignService";

function ImageDisplayDesign({ code, t, onMainLang }) {
  const dispatch = useDispatch();
  const [isUploading, setUploading] = useState(false);

  const state = useSelector((state) => {
    return state.designState[code];
  });

  const handleUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    let file = e.target.files[0];
    DesignService.uploadResource(file)
      .then((response) => {
        setUploading(false);
        dispatch(changeResources({ code, key: "imageUrl", value: file.name }));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {!isUploading && state.resources?.imageUrl && (
        <img
          style={{
            width: "100%",
          }}
          src={buildResourceUrl(state.resources.imageUrl)}
        />
      )}

      {isUploading ? (
        <div className={styles.buttonContainer}>
          <CircularProgress />
          <br />
          <span>{t("uploading_image")}</span>
        </div>
      ) : onMainLang ? (
        <div className={styles.buttonContainer}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<PhotoIcon />}
          >
            {state.resources?.imageUrl ? t("replace_image") : t("upload_image")}
            <input
              hidden
              id={code}
              accept="image/*"
              type="file"
              onChange={handleUpload}
            />
          </Button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default ImageDisplayDesign;
