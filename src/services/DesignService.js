import authenticatedApi from "./authenticatedApi";

class DesignService {
  getSurveyDesign() {
    const surveyId = sessionStorage.getItem("surveyId");
    return authenticatedApi
      .get(`/survey/${surveyId}/design`)
      .then((response) => {
        return response.data;
      });
  }

  setSurveyDesign(data, params) {
    const surveyId = sessionStorage.getItem("surveyId");
    return authenticatedApi
      .post(`/survey/${surveyId}/design`, data, { params })
      .then((response) => {
        return response.data;
      });
  }
}

export default new DesignService();
