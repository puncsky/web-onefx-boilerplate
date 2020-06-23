import serialize from "form-serialize";
import { t } from "onefx/lib/iso-i18n";
import Helmet from "onefx/lib/react-helmet";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";

import Button from "antd/lib/button";

import { connect } from "react-redux";
import { Flex } from "../../../common/flex";
import { colors } from "../../../common/styles/style-color";
import { fullOnPalm } from "../../../common/styles/style-media";
import { ContentPadding } from "../../../common/styles/style-padding";
import { axiosInstance } from "./axios-instance";
import { FieldMargin } from "./field-margin";
import { FormContainer } from "./form-container";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";
import { PasswordField } from "./password-field";
import { TextInput } from "./text-input";

const LOGIN_FORM = "reset-password";

type Props = {
  token: string;
};
type State = {
  errorPassword: string;
  errorNewPassword: string;

  valuePassword: string;
  valueNewPassword: string;

  message: string;

  disableButton: boolean;
};

export const ResetPasswordContainer = connect(
  (state: { base: { token: string } }) => ({
    token: state.base.token
  })
)(
  class ResetPassword extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        errorPassword: "",
        errorNewPassword: "",

        valuePassword: "",
        valueNewPassword: "",

        message: "",
        disableButton: false
      };
    }

    public onSubmit(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
      e.preventDefault();
      const el = window.document.getElementById(LOGIN_FORM) as HTMLFormElement;
      if (!el) {
        return;
      }
      const { newPassword = "", password = "", token = "" } = serialize(el, {
        hash: true
      }) as { newPassword: string; password: string; token: string };
      this.setState({
        disableButton: true,
        valueNewPassword: newPassword,
        valuePassword: password
      });
      axiosInstance
        .post("/api/reset-password/", {
          password,
          newPassword,
          token
        })
        .then(r => {
          if (r.data.ok) {
            this.setState({
              message: t("auth/reset_password.success"),
              errorPassword: "",
              errorNewPassword: "",
              valuePassword: "",
              valueNewPassword: "",
              disableButton: false
            });
            if (r.data.shouldRedirect) {
              window.setInterval(() => {
                window.location.href = r.data.next;
              }, 3000);
            }
          } else if (r.data.error) {
            const { error } = r.data;
            const errorState = {
              valuePassword: password,
              valueNewPassword: newPassword,
              errorPassword: "",
              errorNewPassword: "",
              message: "",
              disableButton: false
            };
            if (error.code === "auth/wrong-password") {
              errorState.errorPassword = error.message;
            }
            if (error.code === "auth/weak-password") {
              errorState.errorNewPassword = error.message;
            }

            this.setState(errorState);
          }
        })
        .catch(err => {
          window.console.error(`failed to post reset-password: ${err}`);
        });
    }

    public render(): JSX.Element {
      const {
        errorPassword,
        errorNewPassword,
        valuePassword,
        valueNewPassword,
        message
      } = this.state;
      const { token } = this.props;

      return (
        <ContentPadding>
          <Flex center minHeight="550px">
            <Form id={LOGIN_FORM}>
              <Helmet title={`login - ${t("topbar.brand")}`} />
              <Flex column>
                <h1>{t("auth/reset_password")}</h1>
                {message && (
                  <Info>
                    <Flex width="100%">
                      <span>{message}</span>
                      <i
                        className="fas fa-times"
                        onClick={() => this.setState({ message: "" })}
                        role="button"
                        style={{ color: colors.white, cursor: "pointer" }}
                      />
                    </Flex>
                  </Info>
                )}
                {token ? (
                  <input
                    defaultValue={token}
                    hidden
                    name="token"
                    placeholder=""
                  />
                ) : (
                  <PasswordField
                    defaultValue={valuePassword}
                    error={errorPassword}
                  />
                )}
                {!message && (
                  <FieldMargin>
                    <InputLabel>New Password</InputLabel>
                    <TextInput
                      aria-label="New Password"
                      defaultValue={valueNewPassword}
                      error={errorNewPassword}
                      name="newPassword"
                      placeholder="New Password"
                      type="password"
                    />
                    <InputError>{errorNewPassword || "\u0020"}</InputError>
                  </FieldMargin>
                )}
                {!message && (
                  <FieldMargin>
                    {/*
                     */}
                    <Button
                      htmlType="submit"
                      loading={this.state.disableButton}
                      onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
                        this.onSubmit(e)
                      }
                      size="large"
                      style={{ width: "100%" }}
                      type="primary"
                    >
                      {t("auth/button_submit")}
                    </Button>
                  </FieldMargin>
                )}
              </Flex>
            </Form>
          </Flex>
        </ContentPadding>
      );
    }
  }
);

const Form = styled(FormContainer, {
  width: "320px",
  ...fullOnPalm
});

const Info = styled("div", {
  padding: "16px",
  width: "100%",
  backgroundColor: colors.success,
  color: colors.white
});
