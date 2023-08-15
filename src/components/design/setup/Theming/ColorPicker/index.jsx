import styles from "./ColorPicker.module.css";
import { SwatchesPicker } from "react-color";
import { useState } from "react";

function ColorPicker(props) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <>
      <div
        style={{
          backgroundColor: props.color || props.default,
        }}
        className={styles.swatch}
        onClick={(e) => setShowColorPicker(true)}
      >
        <div className={styles.color} />
      </div>
      {showColorPicker ? (
        <div>
          <div
            className={styles.cover}
            onClick={(e) => setShowColorPicker(false)}
          />
          <SwatchesPicker
            onChange={(e) => {
              props.handleChange(e.hex);
              setShowColorPicker(false);
            }}
          />
        </div>
      ) : null}
    </>
  );
}

export default ColorPicker;
