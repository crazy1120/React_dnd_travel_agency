import { Box } from "@mui/material";
import styles from "./RandomError.module.css";
import { Trans, useTranslation } from "react-i18next";

export default function RandomError({ errors }) {
  const { t } = useTranslation("design");

  return (
    <Box key="box" className={styles.errorDisplay}>
      {errors.map((error) => {
        if (error.name == "PriorityGroupItemNotChild") {
          return (
            <Trans
              t={t}
              i18nKey="err_priority_group_item_not_child"
              values={{ items: error.items.join(", ") }}
              key={error.name}
            />
          );
        } else if (error.name == "DuplicatePriorityGroupItems") {
          return (
            <Trans
              t={t}
              i18nKey="err_duplicate_priority_group_items"
              values={{ items: error.items.join(", ") }}
              key={error.name}
            />
          );
        } else if (error.name == "PriorityLimitMismatch") {
          return t("err_priority_limit_mismatch");
        } else if (error.name == "RandomGroupItemNotChild") {
          return (
            <Trans
              t={t}
              i18nKey="err_random_group_item_not_child"
              values={{ items: error.items.join(", ") }}
              key={error.name}
            />
          );
        } else if (error.name == "DuplicateRandomGroupItems") {
          return (
            <Trans
              t={t}
              i18nKey="err_duplicate_random_group_items"
              values={{ items: error.items.join(", ") }}
              key={error.name}
            />
          );
        }
      })}
    </Box>
  );
}
