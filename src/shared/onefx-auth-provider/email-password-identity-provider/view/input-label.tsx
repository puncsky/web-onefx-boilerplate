import { StyleObject, styled } from "onefx/lib/styletron-react";
import { fonts } from "@/shared/common/styles/style-font";

const style: StyleObject = {
  ...fonts.inputLabel,
  display: "inline-block",
  verticalAlign: "baseline",
  marginBottom: "0.625rem",
};

export const InputLabel = styled("label", style);
