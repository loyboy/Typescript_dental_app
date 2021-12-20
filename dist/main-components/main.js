import * as tslib_1 from "tslib";
import { AsyncComponent } from "@common-components";
import { LoginStep, router, status, text } from "@core";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { MessageBar, PrimaryButton, Spinner, SpinnerSize, } from "office-ui-fabric-react";
import * as React from "react";
let ErrorBoundaryView = class ErrorBoundaryView extends React.Component {
    constructor() {
        super(...arguments);
        this.hasError = false;
        this.stackTrace = "";
    }
    componentDidCatch(error, info) {
        this.hasError = true;
        this.stackTrace = error.stack;
        console.log(error, error.stack, error.toString(), JSON.stringify(error), error.message, info);
    }
    render() {
        if (this.hasError) {
            return (React.createElement(MessageBar, { className: "eb", messageBarType: 1 },
                "Error occurred",
                React.createElement("br", null),
                " send a screenshot of the following details",
                React.createElement("textarea", { defaultValue: this.stackTrace }),
                React.createElement(PrimaryButton, { onClick: () => {
                        location.href = location.href.split("#")[0];
                        location.reload();
                    }, text: text("Reload") })));
        }
        return this.props.children;
    }
};
tslib_1.__decorate([
    observable
], ErrorBoundaryView.prototype, "hasError", void 0);
tslib_1.__decorate([
    observable
], ErrorBoundaryView.prototype, "stackTrace", void 0);
ErrorBoundaryView = tslib_1.__decorate([
    observer
], ErrorBoundaryView);
export { ErrorBoundaryView };
let MainView = class MainView extends React.Component {
    get view() {
        if (status.step === LoginStep.allDone) {
            return (React.createElement("div", { className: "main-component", style: { borderColor: "red", borderWidth: 2 } },
                React.createElement(AsyncComponent, { key: router.currentNamespace, loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const HeaderView = (yield import("./header")).HeaderView;
                        const UserPanelView = (yield import("./user")).UserPanelView;
                        const MenuView = (yield import("./menu")).MenuView;
                        return (React.createElement("div", null,
                            React.createElement("div", { key: "router", id: "router-outlet" },
                                React.createElement(AsyncComponent, { key: router.currentNamespace, loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                        yield router.currentLoader();
                                        return yield router.currentComponent();
                                    }) })),
                            React.createElement(HeaderView, { key: "header" }),
                            React.createElement(UserPanelView, { key: "user" }),
                            React.createElement(MenuView, { key: "menu" })));
                    }) })));
        }
        else if (status.step === LoginStep.chooseUser) {
            return (React.createElement(AsyncComponent, { key: "choose-user", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const ChooseUserComponent = (yield import("./choose-user"))
                        .ChooseUserComponent;
                    return React.createElement(ChooseUserComponent, null);
                }) }));
        }
        else if (status.step === LoginStep.initial) {
            return (React.createElement(AsyncComponent, { key: "choose-user", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const LoginView = (yield import("./login")).LoginView;
                    return React.createElement(LoginView, null);
                }) }));
        }
        else {
            return (React.createElement("div", { className: "spinner-container" },
                React.createElement(Spinner, { size: SpinnerSize.large, label: text(`Please wait`) })));
        }
    }
    componentDidCatch() {
        console.log("Error");
    }
    componentDidMount() {
        setInterval(() => {
            if (document.querySelectorAll(".ms-Panel").length) {
                document.querySelectorAll("html")[0].classList.add("has-panel");
            }
            else {
                document.querySelectorAll("html")[0].classList.remove("has-panel");
            }
        }, 100);
    }
    render() {
        return React.createElement(ErrorBoundaryView, { key: status.step }, this.view);
    }
};
tslib_1.__decorate([
    computed
], MainView.prototype, "view", null);
MainView = tslib_1.__decorate([
    observer
], MainView);
export { MainView };
//# sourceMappingURL=main.js.map