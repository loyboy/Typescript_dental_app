import * as tslib_1 from "tslib";
import { ProfileComponent } from "@common-components";
import { Message, messages, modals, status, text } from "@core";
import { staff, StaffMember } from "@modules";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";
let ChooseUserComponent = class ChooseUserComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.newDocName = "";
        this.password = "";
    }
    render() {
        return (React.createElement("div", { className: "login-component" },
            React.createElement("div", { className: "m-b-5" }, staff.list.map((user) => (React.createElement("div", { className: "m-t-5 p-5 user-chooser pointer", onClick: () => {
                    if (user.pin) {
                        modals.newModal({
                            id: Math.random(),
                            message: text("Please enter your PIN"),
                            onConfirm: (providedPin) => {
                                if (providedPin === user.pin) {
                                    status.setUser(user._id);
                                }
                                else {
                                    const msg = new Message(text("Invalid PIN provided"));
                                    messages.addMessage(msg);
                                }
                            },
                            input: true,
                            showCancelButton: true,
                            showConfirmButton: true,
                        });
                    }
                    else {
                        status.setUser(user._id);
                    }
                }, key: user._id },
                React.createElement(ProfileComponent, { size: 3, name: user.name, secondaryElement: React.createElement("span", null, user.sortedDays.join(", ")) }))))),
            React.createElement("hr", null),
            staff.list.length === 0 ? (React.createElement("div", null,
                React.createElement(TextField, { value: this.newDocName, onChange: (ev, v) => (this.newDocName = v), label: text("Register as new staff member") }),
                React.createElement(TextField, { value: this.password, onChange: (ev, v) => (this.password = v), label: text("Password") }),
                React.createElement(PrimaryButton, { onClick: () => {
                        const newDoc = new StaffMember();
                        newDoc.name = this.newDocName;
                        this.newDocName = "";
                        staff.list.push(newDoc);
                        status.setUser(newDoc._id);
                    }, text: text("Register") }))) : ("")));
    }
};
tslib_1.__decorate([
    observable
], ChooseUserComponent.prototype, "newDocName", void 0);
tslib_1.__decorate([
    observable
], ChooseUserComponent.prototype, "password", void 0);
ChooseUserComponent = tslib_1.__decorate([
    observer
], ChooseUserComponent);
export { ChooseUserComponent };
//# sourceMappingURL=choose-user.js.map