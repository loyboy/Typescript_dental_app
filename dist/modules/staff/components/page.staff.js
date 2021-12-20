import * as tslib_1 from "tslib";
import { Col, DataTableComponent, ProfileComponent, ProfileSquaredComponent, Row, SectionComponent } from "@common-components";
import { router, text, user } from "@core";
import { AppointmentsList, setting, staff, StaffMember } from "@modules";
import { dateNames, formatDate, num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Checkbox, Icon, IconButton, MessageBar, MessageBarType, Panel, PanelType, PersonaInitialsColor, TextField, Toggle, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";
let StaffPage = class StaffPage extends React.Component {
    constructor() {
        super(...arguments);
        this.selectedId = router.currentLocation.split("/")[1];
        this.viewWhich = 1;
    }
    get canEdit() {
        return user.currentUser.canEditStaff;
    }
    get selectedMemberIndex() {
        return staff.getIndexByID(this.selectedId);
    }
    get member() {
        return staff.list[this.selectedMemberIndex];
    }
    render() {
        return (React.createElement("div", { className: "staff-component p-15 p-l-10 p-r-10" },
            React.createElement(Row, { gutter: 16 },
                React.createElement(Col, { lg: 16 },
                    React.createElement(DataTableComponent, { maxItemsOnLoad: 10, heads: [
                            text("Staff Member"),
                            text("Last/Next Appointment"),
                            text("Contact Details")
                        ], rows: staff.list.map(member => ({
                            id: member._id,
                            searchableString: member.searchableString,
                            cells: [
                                {
                                    dataValue: member.name,
                                    component: (React.createElement("div", null,
                                        React.createElement(ProfileComponent, { name: member.name, secondaryElement: React.createElement("span", null,
                                                member
                                                    .nextAppointments
                                                    .length,
                                                " ",
                                                text("upcoming appointments")), size: 3 }),
                                        React.createElement("br", null),
                                        React.createElement(TooltipHost, { content: text("Staff Member Details") },
                                            React.createElement(IconButton, { className: "action-button", iconProps: {
                                                    iconName: "DietPlanNotebook"
                                                }, onClick: () => {
                                                    this.selectedId =
                                                        member._id;
                                                    this.viewWhich = 1;
                                                } })),
                                        React.createElement(TooltipHost, { content: text("Level and Permission") },
                                            React.createElement(IconButton, { className: "action-button", iconProps: {
                                                    iconName: "Permissions"
                                                }, onClick: () => {
                                                    this.selectedId =
                                                        member._id;
                                                    this.viewWhich = 2;
                                                } })),
                                        user.currentUser
                                            .canViewAppointments ? (React.createElement(TooltipHost, { content: text("Upcoming Appointments") },
                                            React.createElement(IconButton, { className: "action-button", iconProps: {
                                                    iconName: "Calendar"
                                                }, onClick: () => {
                                                    this.selectedId =
                                                        member._id;
                                                    this.viewWhich = 3;
                                                } }))) : (""),
                                        React.createElement(TooltipHost, { content: text("Delete") },
                                            React.createElement(IconButton, { className: "action-button delete", iconProps: {
                                                    iconName: "Trash"
                                                }, onClick: () => staff.deleteModal(member._id), disabled: !this.canEdit })))),
                                    className: "no-label"
                                },
                                {
                                    dataValue: (member.lastAppointment ||
                                        member.nextAppointment || {
                                        date: 0
                                    }).date,
                                    component: (React.createElement("div", null,
                                        React.createElement(ProfileSquaredComponent, { text: member.lastAppointment
                                                ? member
                                                    .lastAppointment
                                                    .treatment
                                                    ? member
                                                        .lastAppointment
                                                        .treatment
                                                        .type
                                                    : ""
                                                : "", subText: member.lastAppointment
                                                ? formatDate(member
                                                    .lastAppointment
                                                    .date, setting.getSetting("date_format"))
                                                : text("No last appointment"), size: 3, onRenderInitials: () => (React.createElement(Icon, { iconName: "Previous" })), onClick: () => { }, initialsColor: member.lastAppointment
                                                ? undefined
                                                : PersonaInitialsColor.transparent }),
                                        React.createElement("br", null),
                                        React.createElement(ProfileSquaredComponent, { text: member.nextAppointment
                                                ? member
                                                    .nextAppointment
                                                    .treatment
                                                    ? member
                                                        .nextAppointment
                                                        .treatment
                                                        .type
                                                    : ""
                                                : "", subText: member.nextAppointment
                                                ? formatDate(member
                                                    .nextAppointment
                                                    .date, setting.getSetting("date_format"))
                                                : text("No next appointment"), size: 3, onRenderInitials: () => (React.createElement(Icon, { iconName: "Next" })), onClick: () => { }, initialsColor: member.nextAppointment
                                                ? undefined
                                                : PersonaInitialsColor.transparent }))),
                                    className: "hidden-xs"
                                },
                                {
                                    dataValue: member.phone || member.email,
                                    component: (React.createElement("div", null,
                                        React.createElement(ProfileSquaredComponent, { text: member.phone, subText: member.phone
                                                ? text("Phone number")
                                                : text("No phone number"), size: 3, onRenderInitials: () => (React.createElement(Icon, { iconName: "Phone" })), initialsColor: member.phone
                                                ? PersonaInitialsColor.teal
                                                : PersonaInitialsColor.transparent }),
                                        React.createElement(ProfileSquaredComponent, { text: member.email, subText: member.email
                                                ? text("Email")
                                                : text("No Email"), size: 3, onRenderInitials: () => (React.createElement(Icon, { iconName: "Mail" })), initialsColor: member.email
                                                ? PersonaInitialsColor.teal
                                                : PersonaInitialsColor.transparent }))),
                                    className: "hidden-xs"
                                }
                            ]
                        })), commands: this.canEdit
                            ? [
                                {
                                    key: "addNew",
                                    title: "Add new",
                                    name: text("Add new"),
                                    onClick: () => {
                                        const member = new StaffMember();
                                        staff.list.push(member);
                                        this.selectedId =
                                            member._id;
                                        this.viewWhich = 1;
                                    },
                                    iconProps: {
                                        iconName: "Add"
                                    }
                                }
                            ]
                            : [] })),
                React.createElement(Col, { lg: 8 },
                    React.createElement("table", { className: "ms-table duty-table" },
                        React.createElement("tbody", null, dateNames.days(true).map(dayName => {
                            return (React.createElement("tr", { key: dayName },
                                React.createElement("th", { className: "day-name" }, text(dayName)),
                                React.createElement("td", null, staff.list
                                    .filter(member => member.onDutyDays.indexOf(dayName) !== -1)
                                    .map(member => {
                                    return (React.createElement(ProfileComponent, { className: "m-b-5", size: 3, key: member._id, name: member.name, secondaryElement: React.createElement("span", null,
                                            (member
                                                .weeksAppointments[dayName] ||
                                                [])
                                                .length,
                                            " ",
                                            text("appointments for"),
                                            " ",
                                            text(dayName)), onClick: () => {
                                            this.selectedId =
                                                member._id;
                                        } }));
                                }))));
                        }))))),
            this.member && this.viewWhich ? (React.createElement(Panel, { isOpen: !!this.member, type: PanelType.medium, closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                    this.selectedId = "";
                    this.viewWhich = 0;
                }, onRenderNavigation: () => (React.createElement(Row, { className: "panel-heading" },
                    React.createElement(Col, { span: 20 }, this.member.name ? (React.createElement(ProfileComponent, { name: this.member.name, secondaryElement: React.createElement("span", null,
                            this.viewWhich === 1
                                ? text("Staff Member Details")
                                : "",
                            this.viewWhich === 2
                                ? text("Level and Permission")
                                : "",
                            this.viewWhich === 3
                                ? text("Upcoming Appointments")
                                : ""), tertiaryText: this.member.phone, size: 3 })) : (React.createElement("p", null))),
                    React.createElement(Col, { span: 4, className: "close" },
                        React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                this.selectedId = "";
                            } })))) },
                React.createElement("div", { className: "staff-editor" },
                    this.viewWhich === 1 ? (React.createElement("div", null,
                        React.createElement(SectionComponent, { title: text(`Basic Info`) },
                            React.createElement("div", { className: "staff-input" },
                                React.createElement(TextField, { label: text("Name"), value: this.member.name, onChange: (ev, val) => (this.member.name = val), disabled: !this.canEdit })),
                            React.createElement("div", { className: "staff-input" },
                                React.createElement("label", null, text("Days on duty")),
                                dateNames
                                    .days(true)
                                    .map((day, i) => {
                                    return (React.createElement(Checkbox, { key: day, disabled: !this.canEdit, label: dateNames.daysShort()[i], checked: this.member.onDutyDays.indexOf(day) > -1, onChange: (ev, checked) => {
                                            if (checked) {
                                                this.member.onDutyDays.push(day);
                                            }
                                            else {
                                                this.member.onDutyDays.splice(this.member.onDutyDays.indexOf(day), 1);
                                            }
                                            this.member
                                                .triggerUpdate++;
                                        } }));
                                }))),
                        React.createElement(SectionComponent, { title: text(`Contact Details`) },
                            React.createElement(Row, { gutter: 12 },
                                React.createElement(Col, { sm: 12 },
                                    React.createElement("div", { className: "staff-input" },
                                        React.createElement(TextField, { label: text("Phone number"), value: this.member.phone, onChange: (ev, val) => (this.member.phone = val), disabled: !this.canEdit }))),
                                React.createElement(Col, { sm: 12 },
                                    React.createElement("div", { className: "staff-input" },
                                        React.createElement(TextField, { label: text("Email"), value: this.member.email, onChange: (ev, val) => (this.member.email = val), disabled: !this.canEdit }))))))) : (""),
                    this.viewWhich === 2 ? (React.createElement("div", null,
                        this.member._id ===
                            user.currentUser._id ? (React.createElement(SectionComponent, { title: text(`Login PIN`) },
                            React.createElement("div", { className: "staff-input" },
                                React.createElement(TextField, { label: text("Login PIN"), value: this.member.pin, onChange: (ev, v) => {
                                        if (num(v) < 10000) {
                                            this.member.pin = v.toString();
                                        }
                                        else {
                                            this.forceUpdate();
                                        }
                                    }, onClick: () => { }, type: "number", max: 9999 })),
                            React.createElement(MessageBar, { messageBarType: MessageBarType.info }, text("Only you can edit this PIN, and it can only be 4 numbers")))) : (""),
                        React.createElement(SectionComponent, { title: text(`Permission`) },
                            this.member._id ===
                                user.currentUser._id ? (React.createElement("div", null,
                                React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("You can't edit your own level and permissions")),
                                React.createElement("br", null))) : (""),
                            React.createElement(Toggle, { defaultChecked: this.member.operates, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Operates on patients"), offText: text("Doesn't operate on patients"), onChange: (ev, newVal) => {
                                    this.member.operates = newVal;
                                } }),
                            React.createElement(Toggle, { defaultChecked: this.member.canViewStaff, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can view staff page"), offText: text("Can not view staff page"), onChange: (ev, newVal) => {
                                    this.member.canViewStaff = newVal;
                                } }),
                            React.createElement(Toggle, { defaultChecked: this.member.canViewPatients, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can view patients page"), offText: text("Can not view patients page"), onChange: (ev, newVal) => {
                                    this.member.canViewPatients = newVal;
                                } }),
                            setting.getSetting("module_orthodontics") ? (React.createElement(Toggle, { defaultChecked: this.member.canViewOrtho, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can view orthodontics page"), offText: text("Can not view orthodontics page"), onChange: (ev, newVal) => {
                                    this.member.canViewOrtho = newVal;
                                } })) : (""),
                            React.createElement(Toggle, { defaultChecked: this.member.canViewAppointments, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can view appointments page"), offText: text("Can not view appointments page"), onChange: (ev, newVal) => {
                                    this.member.canViewAppointments = newVal;
                                } }),
                            React.createElement(Toggle, { defaultChecked: this.member.canViewTreatments, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can view treatments page"), offText: text("Can not view treatments page"), onChange: (ev, newVal) => {
                                    this.member.canViewTreatments = newVal;
                                } }),
                            setting.getSetting("module_prescriptions") ? (React.createElement(Toggle, { defaultChecked: this.member
                                    .canViewPrescriptions, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can view prescriptions page"), offText: text("Can not view prescriptions page"), onChange: (ev, newVal) => {
                                    this.member.canViewPrescriptions = newVal;
                                } })) : (""),
                            setting.getSetting("module_statistics") ? (React.createElement(Toggle, { defaultChecked: this.member.canViewStats, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can view statistics page"), offText: text("Can not view statistics page"), onChange: (ev, newVal) => {
                                    this.member.canViewStats = newVal;
                                } })) : (""),
                            React.createElement(Toggle, { defaultChecked: this.member.canViewSettings, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can view settings page"), offText: text("Can not view settings page"), onChange: (ev, newVal) => {
                                    this.member.canViewSettings = newVal;
                                } }),
                            this.member.canViewStaff ? (React.createElement(Toggle, { defaultChecked: this.member.canEditStaff, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can edit staff page"), offText: text("Can not edit staff page"), onChange: (ev, newVal) => {
                                    this.member.canEditStaff = newVal;
                                } })) : (""),
                            this.member.canViewPatients ? (React.createElement(Toggle, { defaultChecked: this.member.canEditPatients, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can edit patients page"), offText: text("Can not edit patients page"), onChange: (ev, newVal) => {
                                    this.member.canEditPatients = newVal;
                                } })) : (""),
                            setting.getSetting("module_orthodontics") && this.member.canViewOrtho ? (React.createElement(Toggle, { defaultChecked: this.member.canEditOrtho, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can edit orthodontics page"), offText: text("Can not edit orthodontics page"), onChange: (ev, newVal) => {
                                    this.member.canEditOrtho = newVal;
                                } })) : (""),
                            this.member.canViewAppointments ? (React.createElement(Toggle, { defaultChecked: this.member
                                    .canEditAppointments, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can edit appointments page"), offText: text("Can not edit appointments page"), onChange: (ev, newVal) => {
                                    this.member.canEditAppointments = newVal;
                                } })) : (""),
                            this.member.canViewTreatments ? (React.createElement(Toggle, { defaultChecked: this.member
                                    .canEditTreatments, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can edit treatments page"), offText: text("Can not edit treatments page"), onChange: (ev, newVal) => {
                                    this.member.canEditTreatments = newVal;
                                } })) : (""),
                            setting.getSetting("module_prescriptions") &&
                                this.member.canViewPrescriptions ? (React.createElement(Toggle, { defaultChecked: this.member
                                    .canEditPrescriptions, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can edit prescriptions page"), offText: text("Can not edit prescriptions page"), onChange: (ev, newVal) => {
                                    this.member.canEditPrescriptions = newVal;
                                } })) : (""),
                            this.member.canViewSettings ? (React.createElement(Toggle, { defaultChecked: this.member.canEditSettings, disabled: this.member._id ===
                                    user.currentUser._id, onText: text("Can edit settings page"), offText: text("Can not edit settings page"), onChange: (ev, newVal) => {
                                    this.member.canEditSettings = newVal;
                                } })) : ("")))) : (""),
                    this.viewWhich === 3 ? (React.createElement(SectionComponent, { title: text(`Upcoming Appointments`) }, this.member.nextAppointments.length ? (React.createElement(AppointmentsList, { list: this.member.nextAppointments })) : (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, text("There are no upcoming appointments for this staff member"))))) : ("")))) : ("")));
    }
};
tslib_1.__decorate([
    observable
], StaffPage.prototype, "selectedId", void 0);
tslib_1.__decorate([
    observable
], StaffPage.prototype, "viewWhich", void 0);
tslib_1.__decorate([
    computed
], StaffPage.prototype, "canEdit", null);
tslib_1.__decorate([
    computed
], StaffPage.prototype, "selectedMemberIndex", null);
tslib_1.__decorate([
    computed
], StaffPage.prototype, "member", null);
StaffPage = tslib_1.__decorate([
    observer
], StaffPage);
export { StaffPage };
//# sourceMappingURL=page.staff.js.map