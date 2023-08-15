
import { BACKEND_BASE_URL } from "~/constants/networking";


export const buildResourceUrl = (fileName) => {
  const surveyId = sessionStorage.getItem("surveyId");
  return `${BACKEND_BASE_URL}/survey/${surveyId}/resource/${fileName}`;
};


export async function getFileFromPath(filePath) {
  const response = await fetch(filePath);
  const blob = await response.blob();
  const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
  return new File([blob], fileName);
}
