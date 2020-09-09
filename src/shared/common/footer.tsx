import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Flex } from "./flex";
import { contentPadding } from "./styles/style-padding";
import { TOP_BAR_HEIGHT } from "./top-bar";

export const FOOTER_HEIGHT = 89;

export const FOOTER_ABOVE = {
  minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`,
};

export function Footer(): JSX.Element {
  return (
    <Align>
      <Flex>{`Copyright © ${new Date().getFullYear()}`}</Flex>
      <Flex>Built with ❤️ in San Francisco</Flex>
    </Align>
  );
}

const Align = styled("div", ({ $theme }) => ({
  ...contentPadding,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "32px",
  paddingBottom: "32px",
  minHeight: `${FOOTER_HEIGHT}px`,
  backgroundColor: $theme.colors.nav02,
  color: $theme?.colors.textReverse,
}));
