import { clientReactRender } from "onefx/lib/iso-react-render/client-react-render";
import { noopReducer } from "onefx/lib/iso-react-render/root/root-reducer";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { apolloClient } from "@/shared/common/apollo-client";
import { ProfileAppContainer } from "./profile-app";

clientReactRender({
  VDom: (
    <ApolloProvider client={apolloClient}>
      <ProfileAppContainer />
    </ApolloProvider>
  ),
  reducer: noopReducer,
});
