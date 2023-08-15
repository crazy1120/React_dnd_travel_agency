import React, { useEffect, useState } from "react";
import DesignSurvey from "../DesignSurvey";
import { useDispatch } from "react-redux";
import {
  designStateReceived,
  onAddComponentsVisibilityChange,
  onError,
  resetSetup,
} from "~/state/design/designState";
import { setFetching } from "~/state/templateState";
import { GetData } from "~/networking/design";
import ErrorWrapper from "~/components/design/ErrorWrapper";
import { PROCESSED_ERRORS, processError } from "~/utils/errorsProcessor";
import SavingSurvey from "~/components/design/SavingSurvey";

function ManageSurvey() {
  const dispatch = useDispatch();

  const [designAvailable, setDesignAvailable] = useState(false);

  const setState = (state) => {
    dispatch(designStateReceived(state));
  };
  const setError = (error) => {
    dispatch(onError(error));
  };

  const processApirror = (e) => {
    setFetching(false);
    const processed = processError(e);
    switch (processed) {
      case PROCESSED_ERRORS.NETWORK_ERR:
      case PROCESSED_ERRORS.BACKEND_DOWN:
        dispatch(onError(processed));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispatch(onAddComponentsVisibilityChange(true));
    dispatch(resetSetup());

    dispatch(setFetching(true));
    GetData(setState, setError)
      .then((data) => {
        if (data) {
          setDesignAvailable(true);
          dispatch(setFetching(false));
        }
      })
      .catch((err) => {
        processApirror(err);
        dispatch(setFetching(false));
      });
  }, []);

  return (
    <>
      {designAvailable && <DesignSurvey />}
      <ErrorWrapper />
      <SavingSurvey />
    </>
  );
}
export default ManageSurvey;
