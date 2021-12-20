import * as tslib_1 from "tslib";
import { status, text } from "@core";
import { store } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, MessageBar, MessageBarType, PrimaryButton, TextField, } from "office-ui-fabric-react";
import * as React from "react";
let LoginView = class LoginView extends React.Component {
    constructor() {
        super(...arguments);
        this.usernameFieldValue = "";
        this.passwordFieldValue = "";
        this.serverFieldValue = window.couchDBServer ||
            store.get("server_location") ||
            location.origin.replace(/:\d+$/g, ":5984");
        this.errorMessage = "";
        this.disableInputs = false;
        this.step = 1;
        this.editServerLocation = false;
        this.initiallyChecked = false;
    }
    get impossibleToLogin() {
        return !navigator.onLine && !store.found("LSL_hash");
    }
    componentWillMount() {
        status
            .initialCheck(this.serverFieldValue)
            .then(() => (this.initiallyChecked = true));
    }
    render() {
        return (React.createElement("div", { className: "login-component" }, this.impossibleToLogin ? (React.createElement("div", { className: "impossible" },
            React.createElement(MessageBar, { messageBarType: MessageBarType.error },
                "You're offline and unable to login",
                React.createElement("br", null)),
            React.createElement(DefaultButton, { text: "Reload", className: "m-t-15 m-b-15", onClick: () => {
                    location.reload();
                } }))) : (React.createElement("div", null,
            this.initiallyChecked ? (React.createElement("div", { className: "login-step" },
                React.createElement("div", { className: navigator.onLine ? "hidden" : "" },
                    React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, `${text(`You're offline. Use the latest username/password you've successfully used on this machine to login to this server`)}:
								${(this.serverFieldValue || "").replace(/([^\/])\/[^\/].+/, "$1")}.
							`)),
                React.createElement("br", null),
                React.createElement("hr", null),
                React.createElement("div", { className: navigator.onLine ? "" : "hidden" },
                    React.createElement("div", { style: {
                            display: "inline-block",
                            width: "75%",
                        } },
                        React.createElement(TextField, { name: "server", label: text(`Server location`), value: this.serverFieldValue, disabled: this.disableInputs || !this.editServerLocation, onChange: (ev, v) => (this.serverFieldValue = v) })),
                    React.createElement(DefaultButton, { className: "edit-server-location", onClick: () => {
                            this.editServerLocation = true;
                        } }, "Change")),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("hr", null),
                React.createElement(TextField, { name: "identification", label: text(`Username`), disabled: this.disableInputs, value: this.usernameFieldValue, onChange: (e, v) => (this.usernameFieldValue = v) }),
                React.createElement(TextField, { name: "password", type: "Password", label: text(`Password`), disabled: this.disableInputs, value: this.passwordFieldValue, onChange: (e, v) => (this.passwordFieldValue = v) }),
                React.createElement(PrimaryButton, { text: text("Login"), disabled: this.disableInputs, className: "m-t-15 m-b-15", onClick: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        if (!(this.usernameFieldValue &&
                            this.passwordFieldValue &&
                            this.serverFieldValue)) {
                            this.errorMessage = "All fields are necessary";
                            return;
                        }
                        this.errorMessage = "";
                        const result = yield status.loginWithCredentials({
                            username: this.usernameFieldValue,
                            password: this.passwordFieldValue,
                            server: this.serverFieldValue.replace(/([^\/])\/[^\/].+/, "$1"),
                        });
                        if (typeof result !== "boolean" || result !== true) {
                            this.errorMessage = result;
                        }
                    }) }),
                status.tryOffline ? (React.createElement(PrimaryButton, { text: text("Access offline"), disabled: this.disableInputs, className: "m-t-15 m-b-15 m-l-5 m-r-5", onClick: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        if (!(this.usernameFieldValue &&
                            this.passwordFieldValue &&
                            this.serverFieldValue)) {
                            this.errorMessage = "All fields are necessary";
                            return;
                        }
                        this.errorMessage = "";
                        const result = yield status.loginWithCredentialsOffline({
                            username: this.usernameFieldValue,
                            password: this.passwordFieldValue,
                            server: this.serverFieldValue.replace(/([^\/])\/[^\/].+/, "$1"),
                        });
                        if (typeof result !== "boolean" || result !== true) {
                            this.errorMessage = result;
                        }
                    }) })) : (""),
                React.createElement(DefaultButton, { onClick: () => {
                        status.startNoServer();
                    }, className: "no-server-mode" }, "no-server mode"))) : (""),
            this.errorMessage ? (React.createElement(MessageBar, { messageBarType: MessageBarType.error }, this.errorMessage)) : ("")))));
    }
};
tslib_1.__decorate([
    observable
], LoginView.prototype, "usernameFieldValue", void 0);
tslib_1.__decorate([
    observable
], LoginView.prototype, "passwordFieldValue", void 0);
tslib_1.__decorate([
    observable
], LoginView.prototype, "serverFieldValue", void 0);
tslib_1.__decorate([
    observable
], LoginView.prototype, "errorMessage", void 0);
tslib_1.__decorate([
    observable
], LoginView.prototype, "disableInputs", void 0);
tslib_1.__decorate([
    observable
], LoginView.prototype, "step", void 0);
tslib_1.__decorate([
    observable
], LoginView.prototype, "editServerLocation", void 0);
tslib_1.__decorate([
    observable
], LoginView.prototype, "initiallyChecked", void 0);
tslib_1.__decorate([
    computed
], LoginView.prototype, "impossibleToLogin", null);
LoginView = tslib_1.__decorate([
    observer
], LoginView);
export { LoginView };
//# sourceMappingURL=login.js.map