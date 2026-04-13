import { mode } from "@chakra-ui/theme-tools";
const Card = {
  baseStyle: (props) => ({
    p: "20px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    borderRadius: "20px",
    minWidth: "0px",
    wordWrap: "break-word",
    bg: mode("#ffffff", "rgba(11, 20, 55, 0.7)")(props),
    backdropFilter: mode("none", "blur(20px)")(props),
    boxShadow: mode(
      "0px 20px 40px rgba(112, 144, 176, 0.08)",
      "0px 10px 30px rgba(0, 0, 0, 0.2)"
    )(props),
    border: mode("none", "1px solid rgba(255, 255, 255, 0.1)")(props),
    backgroundClip: "border-box",
    transition: "all 0.25s ease-in-out",
    _hover: {
      boxShadow: mode(
        "0px 30px 60px rgba(112, 144, 176, 0.12)",
        "0px 20px 40px rgba(0, 0, 0, 0.4)"
      )(props),
      transform: "translateY(-5px)",
    },
  }),
};

export const CardComponent = {
  components: {
    Card,
  },
};
