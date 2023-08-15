import React, { useState } from "react";
import { Query, Builder, Utils } from "@react-awesome-query-builder/mui";
import loadedConfig from "./config";
import "@react-awesome-query-builder/mui/css/styles.css";
import "./override.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { EditOutlined } from "@mui/icons-material";

function LogicBuilder(props) {
  const {
    jsonLogicFormat,
    queryString,
    loadTree,
    uuid,
    loadFromJsonLogic,
    checkTree,
  } = Utils;
  const config = { ...loadedConfig, fields: props.fields };
  const initTree = props.logic
    ? checkTree(loadFromJsonLogic(props.logic, config), config)
    : loadTree({ id: uuid(), type: "group" });
  const [tree, setTree] = useState(initTree);
  const [html, setHtml] = useState(queryString(tree, config, true));

  const renderBuilder = (props) => (
    <div jey="builder" className="query-builder-container">
      <div className="query-builder">
        <Builder {...props} />
      </div>
    </div>
  );

  const onChange = (immutableTree) => {
    setTree(immutableTree);
  };

  const saveState = () => {
    const { logic, errors } = jsonLogicFormat(tree, config);
    setHtml(queryString(tree, config, true));
    props.onChange(logic);
  };

  return (
    <>
      <div key="result" className="query-builder-result">
        {props.logic && html ? (
          <pre
            className="condition-human-text"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="condition-human-text">{props.t("no_condition")}</pre>
        )}
        <IconButton onClick={() => props.onDialogStateChanged(true)}>
          <EditOutlined />
        </IconButton>
      </div>

      <Dialog
        fullScreen={true}
        sx={{ margin: "200px" }}
        open={props.dialogOpen}
        onClose={() => props.onDialogStateChanged(false)}
        aria-labelledby="alert-dialog-title-logic-builder"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title-logic-builder">
          {props.title}
        </DialogTitle>
        <DialogContent>
          <Query
            {...config}
            value={tree}
            onChange={onChange}
            renderBuilder={renderBuilder}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.onDialogStateChanged(false);
              saveState();
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default LogicBuilder;
