import { MenuItem, Select } from "@mui/material";
import ColorPicker from "../ColorPicker";
import styles from "./ThemingItem.module.css";

function ThemingItem(props) {
  const listFont = [
    "Alegreya",
    "Amatic SC",
    "Arial",
    "Bree Serif",
    "Calibri",
    "Cambria",
    "Caveat",
    "Comfortaa",
    "Comic Sans MS",
    "Courier New",
    "EB Garamond",
    "Georgia",
    "Google Sans",
    "Impact",
    "Lexend",
    "Lobster",
    "Lora",
    "Merriweather",
    "Montserrat",
    "Nunito",
    "Oswald",
    "Pacifico",
    "Permanent Marker",
    "Pinyon Script",
    "Playfair Display",
    "Proxima Nova",
    "Roboto",
    "Roboto Mono",
    "Roboto Serif",
    "Spectral",
    "Times New Roman",
    "Trebuchet MS",
    "Ultra",
    "Varela Round",
    "Verdana",
  ];

  const listFontSize = Array.from({ length: 12 }, (_, index) => index * 2 + 10);

  function handleChange(key, value) {
    props.onChange({ ...props.value, [key]: value });
  }

  return (
    <div className={styles.themingItem}>
      <div className={styles.themingItemBody}>
        <Select
          key="fontFamily"
          size="small"
          className="mr-10"
          value={props.value.font || props.default.font}
          onChange={(e) => handleChange("font", e.target.value)}
        >
          {listFont &&
            listFont.length > 0 &&
            listFont.map((el, index) => (
              <MenuItem
                key={`fontFamily-${index}`}
                sx={{ fontFamily: el }}
                value={el}
              >
                {el}
              </MenuItem>
            ))}
        </Select>
        <Select
          key="fontSize"
          size="small"
          value={props.value.size || props.default.size}
          onChange={(e) => handleChange("size", e.target.value)}
        >
          {listFontSize &&
            listFontSize.length > 0 &&
            listFontSize.map((el, index) => (
              <MenuItem key={`fontSize-${index}`} value={el}>
                {el}
              </MenuItem>
            ))}
        </Select>
      </div>
      <br />
      <ColorPicker
        color={props.value.color}
        default={props.default.color}
        handleChange={(value) => handleChange("color", value)}
      />
    </div>
  );
}

export default ThemingItem;
