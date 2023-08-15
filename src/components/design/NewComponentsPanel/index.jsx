import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import PagesIcon from "@mui/icons-material/Pages";
import FlagIcon from "@mui/icons-material/Flag";
import StartIcon from "@mui/icons-material/Start";

import styles from "./NewComponentsPanel.module.css";
import NewComponentsItem from "~/components/design/NewComponentsItem";
import { QUESTION_TYPES } from "~/components/Questions/utils";
import { IconButton, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const groups = [
  {
    name: "section_sections",
    type: "sections",
    items: [
      {
        idType: 1,
        type: "welcome",
        icon: <StartIcon />,
      },
      {
        idType: 2,
        type: "group",
        icon: <PagesIcon />,
      },
      {
        idType: 3,
        type: "end",
        icon: <FlagIcon />,
      },
    ],
  },
];

function NewComponentsPanel({ t, passedref, onClose }) {
  let draggableIndex = 0;
  let groupsdraggableIndex = 0;
  return (
    <div ref={passedref} className={styles.leftContent}>
      <Paper elevation={3} sx={{ display: "flex" }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onClose}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Setup
        </Typography>
      </Paper>
      <Droppable droppableId="new-groups" type="groups" isDropDisabled>
        {(provided) => (
          <div
            style={{ padding: "16px" }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {groups.map((item, index) => (
              <div
                className={styles.leftPanelGroupItem}
                index={index}
                key={index}
              >
                <div className={styles.groupTitle}>{t(item.name)}</div>
                <div className={styles.leftItems}>
                  {item.items.map((question, index) => {
                    groupsdraggableIndex++;
                    return (
                      <Draggable
                        key={question.type}
                        draggableId={question.type}
                        index={groupsdraggableIndex}
                      >
                        {(provided, snapshot) => {
                          return (
                            <NewComponentsItem
                              t={t}
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                              providedref={provided.innerRef}
                              snapshot={snapshot}
                              item={question}
                              index={index}
                            />
                          );
                        }}
                      </Draggable>
                    );
                  })}
                </div>
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="new-questions" type="questions" isDropDisabled>
        {(provided) => (
          <div
            style={{ padding: "16px" }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {QUESTION_TYPES.map((item, index) => (
              <div
                className={styles.leftPanelGroupItem}
                index={index}
                key={index}
              >
                <div className={styles.groupTitle}>{t(item.name)}</div>
                <div className={styles.leftItems}>
                  {item.items.map((question, index) => {
                    draggableIndex++;
                    return (
                      <div key={`draggable-${index}`}>
                        <Draggable
                          draggableId={question.type}
                          index={draggableIndex}
                        >
                          {(provided, snapshot) => {
                            return (
                              <NewComponentsItem
                                t={t}
                                draggableProps={provided.draggableProps}
                                dragHandleProps={provided.dragHandleProps}
                                providedref={provided.innerRef}
                                snapshot={snapshot}
                                item={question}
                                index={index}
                              />
                            );
                          }}
                        </Draggable>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default NewComponentsPanel;

export const createGroup = (groupType, gId, lang) => {
  let code = `G${gId}`;
  let state = { groupType, content: { label: {}, description: {} } };
  let newGroup = { code, qualifiedCode: code, type: groupType.toLowerCase() };
  return { newGroup, state };
};
