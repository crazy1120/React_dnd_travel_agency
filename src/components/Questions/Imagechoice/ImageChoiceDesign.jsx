import React, { useEffect, useRef, useState } from "react";
import styles from "./ImageChoiceDesign.module.css";
import { useSelector } from "react-redux";
import { GridContextProvider, GridDropZone } from "react-grid-dnd";

import { onDrag } from "~/state/design/designState";
import { useDispatch } from "react-redux";
import ImageChoiceItemDesign from "./ImageChoiceItemDesign";

function ImageChoiceQuestion(props) {
  const containerRef = useRef(null);
  const dispatch = useDispatch();

  const [width, setWidth] = useState(800);

  const children = useSelector((state) => {
    return state.designState[props.code].children || [];
  });

  const questionType = useSelector((state) => {
    return state.designState[props.code].type;
  });

  const childrenWithAdd = props.onMainLang
    ? [...children, { type: "add", code: "add" }]
    : children;

  const columnNumber = useSelector((state) => {
    return state.designState[props.code].columns || 2;
  });

  const hideText = useSelector((state) => {
    return state.designState[props.code].hideText || false;
  });

  const spacing = useSelector((state) => {
    return state.designState[props.code].spacing || 8;
  });
  const imageAspectRatio = useSelector((state) => {
    return state.designState[props.code].imageAspectRatio || 1;
  });

  const textHeight = hideText ? 0 : 80;

  const imageHeight =
    (width - columnNumber * spacing * 2) / columnNumber / imageAspectRatio;

  const totalHeight =
    Math.ceil((children ? childrenWithAdd.length : 1) / columnNumber) *
    (imageHeight + textHeight + columnNumber * spacing);

  const onChange = (sourceId, sourceIndex, targetIndex, targetId) => {
    if (
      sourceIndex < childrenWithAdd.length - 1 &&
      targetIndex < childrenWithAdd.length - 1
    ) {
      const payload = {
        type: "reorder_answers",
        id: children[sourceIndex].qualifiedCode,
        fromIndex: sourceIndex,
        toIndex: targetIndex,
      };
      dispatch(onDrag(payload));
    }
  };

  useEffect(() => {
    setWidth(containerRef?.current?.offsetWidth);
  }, [containerRef]);

  return (
    <div
      ref={containerRef}
      className={styles.questionItem}
      style={{
        direction: "ltr",
      }}
    >
      {imageHeight && (
        <GridContextProvider onChange={onChange}>
          <GridDropZone
            id={"items-" + props.code}
            boxesPerRow={columnNumber}
            rowHeight={imageHeight + textHeight + spacing}
            style={{ height: totalHeight + "px" }}
          >
            {childrenWithAdd.map((item) => (
              <ImageChoiceItemDesign
                key={item.code}
                spacing={spacing}
                t={props.t}
                addAnswer={() => props.addNewAnswer(props.code, questionType)}
                type={item.type}
                imageHeight={imageHeight}
                hideText={hideText}
                qualifiedCode={item.qualifiedCode}
              />
            ))}
          </GridDropZone>
        </GridContextProvider>
      )}
    </div>
  );
}

export default ImageChoiceQuestion;
