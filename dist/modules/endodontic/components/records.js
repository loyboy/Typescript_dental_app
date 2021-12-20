import * as tslib_1 from "tslib";
import { Col, fileTypes, GridTableComponent, PickAndUploadComponent, Row, SectionComponent } from "@common-components";
import { files, modals, ORTHO_RECORDS_DIR, status, text, user } from "@core";
import { Photo, setting, Visit } from "@modules";
import { day, formatDate, num } from "@utils";
import { EditableListComponent } from "common-components/editable-list/editable-list";
import { diff } from "fast-array-diff";
import { computed, observable, observe } from "mobx";
import { observer } from "mobx-react";
import { CommandBar, DefaultButton, DetailsList, Dialog, Dropdown, Icon, IconButton, MessageBar, MessageBarType, SelectionMode, TextField, Toggle, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";
const viewsTerms = [
    "Frontal",
    "Right Buccal",
    "Left Buccal",
    "Palatal",
    "Lingual"
];
let OrthoRecordsPanel = class OrthoRecordsPanel extends React.Component {
    constructor() {
        super(...arguments);
        this.selectedPhotoId = "";
        this.zoomedColumn = -1;
        this.expandedField = "";
        this.uploadingPhotoID = "";
        this.imagesTable = {};
        this.showGrid = false;
        this.overlayWithPrev = false;
        this.overlayWithNext = false;
        this.openCallouts = [];
        this.stopObservation = function () { };
    }
    get canEdit() {
        return user.currentUser.canEditOrtho;
    }
    get dates() {
        if (!this.props.orthoCase.patient) {
            return [];
        }
        return this.props.orthoCase.patient.appointments
            .map(appointment => ({
            date: appointment.date,
            treatmentType: (appointment.treatment || { type: "" }).item
        }))
            .sort((a, b) => b.date - a.date);
    }
    get allImages() {
        return this.props.orthoCase.visits.reduce((all, visit) => {
            visit.photos
                .map(x => x.photoID)
                .forEach(path => {
                if (path) {
                    all.push(path);
                }
            });
            return all;
        }, []);
    }
    componentDidMount() {
        this.allImages.forEach((path) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.addImage(path);
        }));
        this.stopObservation = this.observe();
    }
    componentWillUnmount() {
        this.stopObservation();
    }
    addImage(path) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.imagesTable[path] = "";
            const uri = yield files.get(path);
            this.imagesTable[path] = uri;
            return;
        });
    }
    removeImage(path) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield files.remove(path);
            delete this.imagesTable[path];
            return;
        });
    }
    observe() {
        return observe(this.props.orthoCase, change => {
            if (change.name === "visits") {
                const diffResult = diff(Object.keys(this.imagesTable).sort(), this.allImages.sort());
                diffResult.added.forEach(path => {
                    this.addImage(path);
                });
                diffResult.removed.forEach(path => {
                    this.removeImage(path);
                });
            }
        });
    }
    render() {
        return (React.createElement("div", { className: "ortho-records" },
            React.createElement(SectionComponent, { title: text(`Problems`) }, this.props.orthoCase.computedProblems.length === 0 &&
                this.props.orthoCase.problemsList.length === 0 ? (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("This patient does not seem to have any problems or concerns, have you filled the case sheet?"))) : (React.createElement(DetailsList, { compact: true, items: [
                    ...[
                        ...this.props.orthoCase.computedProblems,
                        ...this.props.orthoCase.problemsList.map(x => text("Patient concern") + ": " + x)
                    ].map((x, i) => [`${i + 1}. ${x}`])
                ], isHeaderVisible: false, selectionMode: SelectionMode.none }))),
            React.createElement(SectionComponent, { title: text(`Laboratory Plan`) },
                this.props.orthoCase.treatmentPlan_appliance.length ? ("") : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("A Lab Order must be done before starting the treatment"))),
                React.createElement(EditableListComponent, { label: text(`Add Plan`), value: this.props.orthoCase.treatmentPlan_appliance, onChange: val => {
                        this.props.orthoCase.treatmentPlan_appliance = val;
                        this.tu();
                    }, disabled: !this.canEdit })),
            React.createElement(SectionComponent, { title: text(`Started/Finished`) },
                React.createElement(Row, { gutter: 12 },
                    React.createElement(Col, { span: 12 },
                        React.createElement(Toggle, { onText: text("Started"), offText: text("Not started yet"), checked: this.props.orthoCase.isStarted, onChange: (ev, val) => (this.props.orthoCase.isStarted = val), disabled: !this.canEdit }),
                        this.props.orthoCase.isStarted ? (React.createElement(Dropdown, { selectedKey: this.props.orthoCase.startedDate.toString(), options: this.dates.map(date => {
                                return {
                                    key: date.date.toString(),
                                    text: `${formatDate(date.date, setting.getSetting("date_format"), setting.getSetting("month_format"))} ${date.treatmentType
                                        ? `, ${date.treatmentType}`
                                        : ""}`
                                };
                            }), disabled: !this.canEdit, onChange: (ev, newValue) => {
                                this.props.orthoCase.startedDate = num(newValue.key);
                            } })) : ("")),
                    " ",
                    React.createElement(Col, { span: 12 },
                        React.createElement(Toggle, { onText: text("Finished"), offText: text("Not finished yet"), checked: this.props.orthoCase.isFinished, onChange: (ev, val) => (this.props.orthoCase.isFinished = val), disabled: !this.canEdit }),
                        this.props.orthoCase.isFinished ? (React.createElement(Dropdown, { selectedKey: this.props.orthoCase.finishedDate.toString(), options: this.dates.map(date => {
                                return {
                                    key: date.date.toString(),
                                    text: `${formatDate(date.date, setting.getSetting("date_format"), setting.getSetting("month_format"))} ${date.treatmentType
                                        ? `, ${date.treatmentType}`
                                        : ""}`
                                };
                            }), disabled: !this.canEdit, onChange: (ev, newValue) => {
                                this.props.orthoCase.finishedDate = num(newValue.key);
                            } })) : ("")))),
            React.createElement(SectionComponent, { title: text(`Records`) }, status.online ? (status.dropboxActive ? (React.createElement("div", { className: "album" },
                this.props.orthoCase.visits.length ? (React.createElement("table", null,
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("td", null),
                            viewsTerms.map((term, index) => {
                                if (this
                                    .zoomedColumn !==
                                    -1 &&
                                    this
                                        .zoomedColumn !==
                                        index) {
                                    return undefined;
                                }
                                else {
                                    return (React.createElement("td", { key: term },
                                        this
                                            .zoomedColumn ===
                                            index ? (React.createElement("p", { className: "column-header" }, viewsTerms[index])) : (React.createElement("p", { className: "term-initials" }, viewsTerms[index]
                                            .split(" ")
                                            .map(x => x.charAt(0))
                                            .join(""))),
                                        React.createElement("br", null),
                                        React.createElement(TooltipHost, { content: text("Zoom") },
                                            React.createElement(IconButton, { iconProps: {
                                                    iconName: this
                                                        .zoomedColumn ===
                                                        index
                                                        ? "ZoomOut"
                                                        : "ZoomIn"
                                                }, className: "clickable-icon", onClick: () => {
                                                    if (this
                                                        .zoomedColumn ===
                                                        index) {
                                                        this.zoomedColumn = -1;
                                                        return;
                                                    }
                                                    this.zoomedColumn = index;
                                                } })),
                                        this
                                            .zoomedColumn ===
                                            index ? (React.createElement(TooltipHost, { content: text("View grid") },
                                            React.createElement(IconButton, { iconProps: {
                                                    iconName: "gridViewSmall"
                                                }, className: "clickable-icon", onClick: () => {
                                                    this.showGrid = !this
                                                        .showGrid;
                                                } }))) : ("")));
                                }
                            }),
                            React.createElement("td", null)),
                        this.props.orthoCase.visits
                            .slice()
                            .sort((a, b) => a.visitNumber -
                            b.visitNumber)
                            .map((visit, visitIndex, sortedVisits) => {
                            const prevVisit = sortedVisits[visitIndex - 1] || new Visit();
                            const nextVisit = sortedVisits[visitIndex + 1] || new Visit();
                            return [
                                React.createElement("tr", { key: visit.id },
                                    React.createElement("td", null,
                                        React.createElement(TooltipHost, { content: `#${visit.visitNumber}, ${formatDate(visit.date, setting.getSetting("date_format"), setting.getSetting("month_format"))}` },
                                            React.createElement(IconButton, { id: visit.id.replace(/[0-9]/g, ""), iconProps: {
                                                    iconName: "info"
                                                }, onClick: () => {
                                                    this.openCallouts.push(visit.id);
                                                } })),
                                        React.createElement(Dialog, { onDismiss: () => {
                                                this.openCallouts = this.openCallouts.filter(x => x !==
                                                    visit.id);
                                            }, hidden: this.openCallouts.indexOf(visit.id) ===
                                                -1, className: "visit-dialog" },
                                            React.createElement(DetailsList, { compact: true, items: [
                                                    [
                                                        React.createElement("div", { id: "gf-visit" }, this
                                                            .expandedField ===
                                                            "gf-visit" ? (React.createElement(TextField, { autoFocus: true, type: "number", label: text(`Visit number`), value: visit.visitNumber.toString(), onBlur: () => {
                                                                this.expandedField =
                                                                    "";
                                                            }, disabled: !this
                                                                .canEdit, onChange: (ev, val) => {
                                                                this.props.orthoCase.visits[visitIndex].visitNumber = num(val);
                                                                this.tu();
                                                            } })) : (`${text("Visit")} #${visit.visitNumber}`))
                                                    ],
                                                    [
                                                        React.createElement("div", { id: "gf-date" }, this
                                                            .expandedField ===
                                                            "gf-date" ? (React.createElement(Dropdown, { label: text(`Visit date`), selectedKey: visit.date.toString(), disabled: !this
                                                                .canEdit, options: this.dates.map(date => {
                                                                return {
                                                                    key: date.date.toString(),
                                                                    text: `${formatDate(date.date, setting.getSetting("date_format"), setting.getSetting("month_format"))} ${date.treatmentType
                                                                        ? `, ${date.treatmentType}`
                                                                        : ""}`
                                                                };
                                                            }), onChange: (ev, newValue) => {
                                                                this.props.orthoCase.visits[visitIndex].date = num(newValue
                                                                    .key);
                                                                this.tu();
                                                            } })) : (`${text("Date")}: ${formatDate(visit.date, setting.getSetting("date_format"), setting.getSetting("month_format"))}`))
                                                    ],
                                                    [
                                                        React.createElement("div", { id: "gf-appliance" }, this
                                                            .expandedField ===
                                                            "gf-appliance" ? (React.createElement(TextField, { autoFocus: true, label: text(`Appliance`), disabled: !this
                                                                .canEdit, value: visit.appliance, onBlur: () => {
                                                                this.expandedField =
                                                                    "";
                                                            }, multiline: true, onChange: (ev, val) => {
                                                                this.props.orthoCase.visits[visitIndex].appliance = val;
                                                                this.tu();
                                                            } })) : (`${text("Appliance")}: ${visit.appliance
                                                            ? visit.appliance
                                                            : text("No appliance info")}`))
                                                    ]
                                                ], isHeaderVisible: false, selectionMode: SelectionMode.none, onActiveItemChanged: row => {
                                                    this.expandedField =
                                                        row[0].props.id;
                                                } }))),
                                    viewsTerms.map((term, photoIndex) => {
                                        const photo = visit
                                            .photos[photoIndex];
                                        if (this
                                            .zoomedColumn !==
                                            -1 &&
                                            this
                                                .zoomedColumn !==
                                                photoIndex) {
                                            return undefined;
                                        }
                                        return (React.createElement("td", { key: term },
                                            this
                                                .showGrid &&
                                                this
                                                    .zoomedColumn ===
                                                    photoIndex &&
                                                this
                                                    .imagesTable[photo
                                                    .photoID] ? (React.createElement(GridTableComponent, null)) : (""),
                                            photo.photoID ? (this
                                                .imagesTable[photo
                                                .photoID] ? (React.createElement("div", { key: visit.id, className: "photo", onClick: () => {
                                                    this.selectedPhotoId =
                                                        photo.id;
                                                } },
                                                React.createElement(Icon, { iconName: "MiniExpandMirrored", className: "hover-effect" }),
                                                React.createElement("img", { style: {
                                                        width: "100%"
                                                    }, src: this
                                                        .imagesTable[photo
                                                        .photoID], className: "ortho-img-el" }),
                                                this
                                                    .selectedPhotoId ===
                                                    photo.id ? (React.createElement(Dialog, { modalProps: {
                                                        className: "photo-dialog"
                                                    }, hidden: false, onDismiss: () => (this.selectedPhotoId =
                                                        "") },
                                                    React.createElement("div", { style: {
                                                            position: "relative"
                                                        } },
                                                        React.createElement("img", { style: {
                                                                width: "100%"
                                                            }, src: this
                                                                .imagesTable[photo
                                                                .photoID] }),
                                                        this
                                                            .overlayWithNext ? (React.createElement("img", { className: "overlay-img", src: this
                                                                .imagesTable[nextVisit
                                                                .photos[photoIndex]
                                                                .photoID] })) : (""),
                                                        this
                                                            .overlayWithPrev ? (React.createElement("img", { className: "overlay-img", src: this
                                                                .imagesTable[prevVisit
                                                                .photos[photoIndex]
                                                                .photoID] })) : ("")),
                                                    React.createElement(DetailsList, { compact: true, items: [
                                                            [
                                                                React.createElement("div", { id: "gf-visit" }, this
                                                                    .expandedField ===
                                                                    "gf-visit" ? (React.createElement(TextField, { autoFocus: true, disabled: !this
                                                                        .canEdit, type: "number", label: text(`Visit number`), value: visit.visitNumber.toString(), onBlur: () => {
                                                                        this.expandedField =
                                                                            "";
                                                                    }, onChange: (ev, val) => {
                                                                        this.props.orthoCase.visits[visitIndex].visitNumber = num(val);
                                                                        this.tu();
                                                                    } })) : (`${text("Visit")} #${visit.visitNumber}`))
                                                            ],
                                                            [
                                                                React.createElement("div", { id: "gf-date" }, this
                                                                    .expandedField ===
                                                                    "gf-date" ? (React.createElement(Dropdown, { label: text(`Visit date`), disabled: !this
                                                                        .canEdit, selectedKey: visit.date.toString(), options: this.dates.map(date => {
                                                                        return {
                                                                            key: date.date.toString(),
                                                                            text: `${formatDate(date.date, setting.getSetting("date_format"), setting.getSetting("month_format"))} ${date.treatmentType
                                                                                ? `, ${date.treatmentType}`
                                                                                : ""}`
                                                                        };
                                                                    }), onChange: (ev, newValue) => {
                                                                        this.props.orthoCase.visits[visitIndex].date = num(newValue
                                                                            .key);
                                                                        this.tu();
                                                                    } })) : (`${text("Date")}: ${formatDate(visit.date, setting.getSetting("date_format"), setting.getSetting("month_format"))}`))
                                                            ],
                                                            [
                                                                React.createElement("div", { id: "gf-appliance" }, this
                                                                    .expandedField ===
                                                                    "gf-appliance" ? (React.createElement(TextField, { autoFocus: true, label: text(`Appliance`), value: visit.appliance, disabled: !this
                                                                        .canEdit, onBlur: () => {
                                                                        this.expandedField =
                                                                            "";
                                                                    }, multiline: true, onChange: (ev, val) => {
                                                                        this.props.orthoCase.visits[visitIndex].appliance = val;
                                                                        this.tu();
                                                                    } })) : (`${text("Appliance")}: ${visit.appliance
                                                                    ? visit.appliance
                                                                    : text("No appliance info")}`))
                                                            ],
                                                            [
                                                                React.createElement("div", { id: "gf-comment" }, this
                                                                    .expandedField ===
                                                                    "gf-comment" ? (React.createElement(TextField, { autoFocus: true, label: text(`Comment`), disabled: !this
                                                                        .canEdit, value: photo.comment, onBlur: () => {
                                                                        this.expandedField =
                                                                            "";
                                                                    }, multiline: true, onChange: (ev, val) => {
                                                                        this.props.orthoCase.visits[visitIndex].photos[photoIndex].comment = val;
                                                                        this.tu();
                                                                    } })) : (`${text("Comment")}: ${photo.comment
                                                                    ? photo.comment
                                                                    : text("no comment on this photo")}`))
                                                            ]
                                                        ], isHeaderVisible: false, selectionMode: SelectionMode.none, onActiveItemChanged: row => {
                                                            this.expandedField =
                                                                row[0].props.id;
                                                        } }),
                                                    React.createElement(CommandBar, { items: [
                                                            {
                                                                key: "overlay prev",
                                                                text: text("Overlay prev"),
                                                                iconProps: {
                                                                    iconName: "MapLayers"
                                                                },
                                                                className: this
                                                                    .overlayWithPrev
                                                                    ? "active-button"
                                                                    : undefined,
                                                                onClick: () => {
                                                                    this.overlayWithPrev = !this
                                                                        .overlayWithPrev;
                                                                },
                                                                hidden: !this
                                                                    .imagesTable[prevVisit
                                                                    .photos[photoIndex]
                                                                    .photoID]
                                                            },
                                                            {
                                                                key: "overlay next",
                                                                text: text("Overlay next"),
                                                                iconProps: {
                                                                    iconName: "MapLayers"
                                                                },
                                                                className: this
                                                                    .overlayWithNext
                                                                    ? "active-button"
                                                                    : undefined,
                                                                onClick: () => {
                                                                    this.overlayWithNext = !this
                                                                        .overlayWithNext;
                                                                },
                                                                hidden: !this
                                                                    .imagesTable[nextVisit
                                                                    .photos[photoIndex]
                                                                    .photoID]
                                                            }
                                                        ], farItems: [
                                                            {
                                                                key: "delete photo",
                                                                text: text("Delete"),
                                                                iconProps: {
                                                                    iconName: "trash"
                                                                },
                                                                disabled: !this
                                                                    .canEdit,
                                                                onClick: () => {
                                                                    this.props.orthoCase.visits[visitIndex].photos[photoIndex] = new Photo();
                                                                    this.selectedPhotoId =
                                                                        "";
                                                                    this.tu();
                                                                }
                                                            }
                                                        ] }))) : (""))) : (React.createElement(Icon, { iconName: "sync", className: "rotate" }))) : (React.createElement(PickAndUploadComponent, Object.assign({}, {
                                                crop: true,
                                                allowMultiple: false,
                                                accept: fileTypes.image,
                                                prevSrc: this
                                                    .imagesTable[prevVisit
                                                    .photos[photoIndex]
                                                    .photoID],
                                                disabled: !this
                                                    .canEdit,
                                                onFinish: e => {
                                                    if (e[0]) {
                                                        this.props.orthoCase.visits[visitIndex].photos[photoIndex].photoID =
                                                            e[0];
                                                        this.tu();
                                                    }
                                                },
                                                onStartLoading: () => {
                                                    this.uploadingPhotoID =
                                                        photo.id;
                                                },
                                                onFinishLoading: () => {
                                                    this.uploadingPhotoID =
                                                        "";
                                                },
                                                targetDir: `${ORTHO_RECORDS_DIR}/${this
                                                    .props
                                                    .orthoCase
                                                    ._id}`
                                            }),
                                                React.createElement(TooltipHost, { content: text("Add photo") },
                                                    React.createElement(IconButton, { iconProps: {
                                                            iconName: "Photo2Add"
                                                        }, className: "clickable-icon add-photo", disabled: !this
                                                            .canEdit }))))));
                                    }),
                                    React.createElement("td", null,
                                        React.createElement(TooltipHost, { content: text("Delete visit") },
                                            React.createElement(IconButton, { className: "clickable-icon delete-visit", key: visit.id, disabled: !this
                                                    .canEdit, iconProps: {
                                                    iconName: "DeleteRows"
                                                }, onClick: () => {
                                                    modals.newModal({
                                                        message: text("This visit data will be deleted along with all photos and notes"),
                                                        onConfirm: () => {
                                                            this.props.orthoCase.visits.splice(visitIndex, 1);
                                                            this.tu();
                                                        },
                                                        showCancelButton: true,
                                                        showConfirmButton: true,
                                                        id: Math.random()
                                                    });
                                                } })))),
                                React.createElement("tr", { key: visit.id +
                                        "days" },
                                    React.createElement("td", { colSpan: 7 }, sortedVisits[visitIndex +
                                        1] ? (React.createElement("i", { className: "days-num" },
                                        Math.round((nextVisit.date -
                                            visit.date) /
                                            day),
                                        " ",
                                        text("days"))) : ("")))
                            ];
                        })))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, text("No visits recorded yet! add a new visit using the button below"))),
                React.createElement("br", null),
                React.createElement(DefaultButton, { disabled: !this.canEdit, iconProps: { iconName: "ExploreContent" }, text: text("Add visit"), onClick: () => {
                        const visitNumber = this.props.orthoCase
                            .visits.length
                            ? this.props.orthoCase.visits
                                .slice()
                                .sort((a, b) => b.visitNumber -
                                a.visitNumber)[0].visitNumber + 1
                            : 1;
                        this.props.orthoCase.visits.push(new Visit(undefined, visitNumber));
                        this.tu();
                    } }))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("A valid DropBox access token is required for this section")))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("You can not access orthodontic records while offline")))),
            React.createElement(SectionComponent, { title: text(`Notes for the next visit`) },
                React.createElement(EditableListComponent, { label: text(`Add note`), value: this.props.orthoCase.nextVisitNotes, onChange: val => {
                        this.props.orthoCase.nextVisitNotes = val;
                        this.tu();
                    }, disabled: !this.canEdit }))));
    }
    tu() {
        this.props.orthoCase.triggerUpdate++;
    }
};
tslib_1.__decorate([
    observable
], OrthoRecordsPanel.prototype, "selectedPhotoId", void 0);
tslib_1.__decorate([
    observable
], OrthoRecordsPanel.prototype, "zoomedColumn", void 0);
tslib_1.__decorate([
    observable
], OrthoRecordsPanel.prototype, "expandedField", void 0);
tslib_1.__decorate([
    observable
], OrthoRecordsPanel.prototype, "uploadingPhotoID", void 0);
tslib_1.__decorate([
    observable
], OrthoRecordsPanel.prototype, "imagesTable", void 0);
tslib_1.__decorate([
    observable
], OrthoRecordsPanel.prototype, "showGrid", void 0);
tslib_1.__decorate([
    observable
], OrthoRecordsPanel.prototype, "overlayWithPrev", void 0);
tslib_1.__decorate([
    observable
], OrthoRecordsPanel.prototype, "overlayWithNext", void 0);
tslib_1.__decorate([
    observable
], OrthoRecordsPanel.prototype, "openCallouts", void 0);
tslib_1.__decorate([
    computed
], OrthoRecordsPanel.prototype, "canEdit", null);
tslib_1.__decorate([
    computed
], OrthoRecordsPanel.prototype, "dates", null);
tslib_1.__decorate([
    computed
], OrthoRecordsPanel.prototype, "allImages", null);
OrthoRecordsPanel = tslib_1.__decorate([
    observer
], OrthoRecordsPanel);
export { OrthoRecordsPanel };
//# sourceMappingURL=records.js.map