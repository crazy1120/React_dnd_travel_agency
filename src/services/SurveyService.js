import authenticatedApi from "./authenticatedApi";

class SurveyService {
  async getAllSurveys() {
    return authenticatedApi.get(`/survey/all`).then((response) => {
      return response.data;
    });
  }

  async getSurvey() {
    const surveyId = sessionStorage.getItem("surveyId");
    return authenticatedApi.get(`/survey/${surveyId}`).then((response) => {
      return response.data;
    });
  }

  async createSurvey(data) {
    const response = await authenticatedApi.post(`/survey/create`, data);
    return response.data;
  }

  async putSurvey(data, surveyId) {
    const response = await authenticatedApi.put(`/survey/${surveyId}`, data);
    return response.data;
  }

  async closeSurvey(surveyId) {
    const response = await authenticatedApi.put(`/survey/${surveyId}/close`);
    return response.data;
  }

  async cloneSurvey(surveyId, data) {
    const response = await authenticatedApi.post(
      `/survey/${surveyId}/clone`,
      data
    );
    return response.data;
  }

  async deleteSurvey(surveyId) {
    const response = await authenticatedApi.delete(`/survey/${surveyId}`);
    return response.data;
  }

  async getSurveyPermissionAll(surveyId) {
    const response = await authenticatedApi.get(
      `/survey/${surveyId}/permission/all`
    );
    return response.data;
  }

  async removePermission(surveyId, userId) {
    const response = await authenticatedApi.delete(
      `/survey/${surveyId}/permission/${userId}`
    );
    return response.data;
  }

  async addPermission(surveyId, userId) {
    const response = await authenticatedApi.post(
      `/survey/${surveyId}/permission/${userId}`
    );
    return response.data;
  }

  async editPermission(surveyId, userId, data) {
    const response = await authenticatedApi.put(
      `/survey/${surveyId}/permission/${userId}`,
      data
    );
    return response.data;
  }

  async allResponse(
    surveyId,
    dbValues,
    page,
    per_page,
    complete,
    preview,
    surveyor
  ) {
    const shouldAddComplete = complete === true || complete === false;
    const shouldAddPreview = preview === true || preview === false;
    const response = await authenticatedApi.get(
      `/survey/${surveyId}/response/all?db_values=${dbValues}&page=${page}&per_page=${per_page}` +
        `${shouldAddComplete ? `&complete=${complete}` : ""}
        ${surveyor ? `&surveyor=${surveyor}` : ""}
        ${shouldAddPreview ? `&preview=${preview}` : ""}`
    );
    return response.data;
  }

  async exportResponses(surveyId, dbValues, complete, preview) {
    const shouldAddComplete = complete === true || complete === false;
    const shouldAddPreview = preview === true || preview === false;
    const response = await authenticatedApi.get(
      `/survey/${surveyId}/response/export?db_values=${dbValues}` +
        `${shouldAddComplete ? `&complete=${complete}` : ""}${
          shouldAddPreview ? `&preview=${preview}` : ""
        }`
    );
    return response.data;
  }

  async deleteResponse(surveyId, responseId) {
    const response = await authenticatedApi.delete(
      `/survey/${surveyId}/response/${responseId}`
    );
    return response;
  }
  async eventResponse(responseId) {
    const surveyId = sessionStorage.getItem("surveyId");
    const response = await authenticatedApi.get(
      `/survey/${surveyId}/response/${responseId}/events`
    );
    return response;
  }

  async responseAttach(surveyId, filename) {
    const response = await authenticatedApi.get(
      `/survey/${surveyId}/response/attach/${filename}`,
      {
        responseType: "blob",
      }
    );
    return response;
  }
}

export default new SurveyService();
