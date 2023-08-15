import React, { useState } from "react";

import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { Button, CircularProgress } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import { buildResourceUrl } from "~/networking/common";
import { useDispatch } from "react-redux";
import { changeResources } from "~/state/design/designState";
import styles from "./VideoDisplay.module.css";
import DesignService from "~/services/DesignService";

function VideoDisplayDesign({ code, t, onMainLang }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isUploading, setUploading] = useState(false);

  const state = useSelector((state) => {
    return state.designState[code];
  });

  const handleVideoUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    let file = e.target.files[0];
    DesignService.uploadResource(file)
      .then((response) => {
        setUploading(false);
        dispatch(changeResources({ code, key: "videoUrl", value: file.name }));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {!isUploading && state.resources?.videoUrl && (
        <div
          style={{
            position: "relative",
            marginTop: "16px",
            // 16:9 aspect ratio
            paddingTop: state.audio_only ? "10%" : "56%",
          }}
        >
          <ReactPlayer
            url={buildResourceUrl(state.resources.videoUrl)}
            loop={state.loop || false}
            light={true}
            controls={true}
            config={{
              forceAudio: state.audio_only || false,
            }}
            style={{
              backgroundColor: "black",
              position: "absolute",
              top: "0",
              left: "0",
            }}
            volume={1}
            width="100%"
            height="100%"
          />
        </div>
      )}

      {isUploading ? (
        <div className={styles.buttonContainer}>
          <CircularProgress />
          <br />
          <span>{t("uploading_video")}</span>
        </div>
      ) : onMainLang ? (
        <div className={styles.buttonContainer}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<VideocamIcon />}
          >
            {state.resources?.videoUrl ? t("replace_video") : t("upload_video")}
            <input
              hidden
              id={code}
              accept="video/*"
              type="file"
              onChange={handleVideoUpload}
            />
          </Button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default VideoDisplayDesign;
