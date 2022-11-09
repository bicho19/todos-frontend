import { extendTheme, theme } from "@chakra-ui/react";

const colors = {
  "main-bg": "#FFF",

  "white-text": "#0E1012",
  "subtle-text": "#0E1012",

  "column-bg": "#E8E8EA",
  "column-header-bg": "#0E1012",

  "card-bg": "#E8E8EA",
  "card-border": "#0E1012"
};

const fonts = {
  heading: "Poppins",
  body: "Poppins",
};

export default extendTheme({
  ...theme,
  colors,
  fonts,
});
