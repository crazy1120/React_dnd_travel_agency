import React, { Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

import { routes } from "./routes";
import { lazy } from "react";
import { manageStore } from "./store";
import { Provider } from "react-redux";

import TokenService from "./services/TokenService";

import LoadingIndicator from "./components/common/LoadingIndicator";
import { ManagePageWrapper } from "./pages/ManagePageWrapper";
import ManageSurvey from "./pages/ManageSurvey";

const Page404 = lazy(() => import("./pages/Page404"));
const Dashboard = lazy(() => import("./pages/manage/Dashboard"));
const Login = lazy(() => import("./pages/manage/Login"));

function Web() {
  return (
    <Routes>
      <Route
        path={routes.designSurvey}
        element={
          <Suspense fallback={<LoadingIndicator />}>
            <ManagePageWrapper>
              <PrivateDesignSurvey />
            </ManagePageWrapper>
          </Suspense>
        }
      />
      <Route
        path={routes.page404}
        element={
          <Suspense fallback={<LoadingIndicator />}>
            <Page404 />
          </Suspense>
        }
      />
      <Route
        path={routes.dashboard}
        element={
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateComponent>
              <ManagePageWrapper>
                <Dashboard />
              </ManagePageWrapper>
            </PrivateComponent>
          </Suspense>
        }
      />

      <Route
        path={routes.login}
        element={
          <Suspense fallback={<LoadingIndicator />}>
            <ManagePageWrapper>
              <Login />
            </ManagePageWrapper>
          </Suspense>
        }
      />
    </Routes>
  );
}

const PrivateDesignSurvey = () => {
  const params = useParams();
  sessionStorage.setItem("surveyId", params.surveyId);
  const location = useLocation();
  return TokenService.isAuthenticated() ? (
    <Provider store={manageStore}>
      <ManageSurvey />
    </Provider>
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

const PrivateComponent = ({ children }) => {
  const location = useLocation();
  return TokenService.isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default Web;
