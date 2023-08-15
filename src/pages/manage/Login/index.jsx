import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Box,
  Typography,
  FormHelperText,
  Link,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthService from "~/services/AuthService";
import { AuthWrap } from "~/components/manage/AuthWrap";
import styles from "./Login.module.css";
import { PROCESSED_ERRORS, processError } from "~/utils/errorsProcessor";

function Login() {
  const { t, i18n } = useTranslation("manage");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [processedError, setProcessedError] = useState("");
  const [showError, setShowError] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validate = () => {
    setEmailError("");
    setPassError("");
    if (email.length == 0) {
      setEmailError(t("email_required"));
      return false;
    }
    if (password.length == 0) {
      setPassError(t("password_required"));
      return false;
    }
    return true;
  };

  const onPasswordChanged = (e) => {
    setPassword(e.target.value);
    setPassError("");
  };

  const onEmailChanged = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const onError = (e) => {
    const processed = processError(e);
    switch (processed) {
      case PROCESSED_ERRORS.NETWORK_ERR:
      case PROCESSED_ERRORS.BACKEND_DOWN:
      case PROCESSED_ERRORS.GOOGLE_AUTH_ERROR:
        setShowError(true);
        setProcessedError(processed);
        break;
      case PROCESSED_ERRORS.WRONG_CREDENTIALS:
        setEmailError(t(`processed_errors.${processed}`));
        break;
      default:
        break;
    }
  };

  const onSubmit = () => {
    if (!validate()) {
      return;
    }
    setLoading(true);
    AuthService.login(email, password)
      .then((data) => {
        console.log(data)
        console.log("navigate")
        const { from } = location.state || { from: { pathname: "/" } };
        console.log(from)
        navigate(from);
      })
      .catch((e) => {
        onError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <AuthWrap
      loading={loading}
      showError={showError}
      processedError={processedError}
      handleClose={() => setShowError(false)}
    >
      <Box className={styles.wrapper}>
        <Box className={styles.content}>
          <Typography variant="h2">{t("login.title")}</Typography>
          <Box className={styles.form}>
            <TextField
              onChange={onEmailChanged}
              error={emailError?.length > 0}
              value={email}
              id="email"
              label={t("label.email")}
              name="email"
              required={true}
              variant="standard"
            />

            <FormControl required={true} variant="standard" sx={{ mt: "10px" }}>
              <InputLabel htmlFor="standard-adornment-password">
                {t("label.password")}
              </InputLabel>
              <Input
                error={passError?.length > 0}
                name="password"
                value={password}
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                onChange={onPasswordChanged}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {(emailError || passError) && (
              <FormHelperText className={styles.errorText}>
                {emailError || passError}
              </FormHelperText>
            )}
            <Button onClick={onSubmit} sx={{ mt: "40px" }}>
              {t("login.submit")}
            </Button>
          </Box>
        </Box>
      </Box>
    </AuthWrap>
  );
}

export default Login;
