import { LANGUAGE_DEF } from "~/constants/language";
import { defaultSurveyTheme } from "~/constants/theme";
import DesignService from "~/services/DesignService";

export async function GetData(setState, setError, langInfo) {
  setError(false);
  try {
    const response = await DesignService.getSurveyDesign();
    return processResponse(response, setState, langInfo);
  } catch (err) {
    console.log(err);
    setError({
      errorType: "click",
      message: err.message,
    });
  }
}

export async function SetData(state, setState, setError) {
  setError(false);
  try {
    const params = new URLSearchParams([
      ["version", state.versionDto.version],
      ["sub_version", state.versionDto.subVersion],
    ]);
    const response = await DesignService.setSurveyDesign(state, params);
    processResponse(response, setState, state.langInfo);
  } catch (err) {
    setError({
      errorType: "click",
      message: err.message,
    });
    console.log(err);
    GetData(setState, setError, state.langInfo);
  }
}

const processResponse = (response, setState, langInfo) => {
  let state = response.designerInput.state;

  if (!state.Survey.theme) {
    state.Survey.theme = defaultSurveyTheme;
  }
  const defaultLang =
    response.designerInput.state.Survey.defaultLang || LANGUAGE_DEF.en;
  const mainLang = defaultLang.code;
  const lang = langInfo?.lang || defaultLang.code;
  const languagesList = [defaultLang].concat(
    response.designerInput.state.Survey.additionalLang || []
  );
  state.langInfo = {
    languagesList,
    mainLang,
    lang,
    onMainLang: lang == mainLang,
  };
  state.versionDto = response.versionDto;
  state.componentIndex = response.designerInput.componentIndexList;
  setState(state);
  return state;
};
