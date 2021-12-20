(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[16],{

/***/ "./src/common-components/editable-list/editable-list.tsx":
/*!***************************************************************!*\
  !*** ./src/common-components/editable-list/editable-list.tsx ***!
  \***************************************************************/
/*! exports provided: EditableListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EditableListComponent\", function() { return EditableListComponent; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _common_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common-components */ \"./src/common-components/index.ts\");\n/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ \"./node_modules/mobx/lib/mobx.module.js\");\n/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx-react */ \"./node_modules/mobx-react/index.module.js\");\n/* harmony import */ var office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! office-ui-fabric-react */ \"./node_modules/office-ui-fabric-react/lib/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nlet EditableListComponent = class EditableListComponent extends react__WEBPACK_IMPORTED_MODULE_5__[\"Component\"] {\n    constructor() {\n        super(...arguments);\n        this.valueToAdd = \"\";\n        this.expandIndex = -1;\n    }\n    addItem() {\n        if (this.valueToAdd.replace(/\\W/, \"\").length) {\n            this.props.value.push(this.valueToAdd);\n            this.valueToAdd = \"\";\n            (this.props.onChange || (() => { }))(this.props.value);\n        }\n    }\n    render() {\n        return (react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](\"div\", { className: \"elc-c\", style: this.props.style },\n            react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](\"div\", { className: \"editable-list\" },\n                react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](\"div\", { className: \"input\", style: this.props.value.length\n                        ? {}\n                        : { borderBottom: \"none\" } },\n                    react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"Row\"], null,\n                        react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], { xs: this.props.disabled ? 24 : 20, sm: this.props.disabled ? 24 : 21 },\n                            react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](\"input\", { className: \"new-item-input\", style: this.props.value.length > 0\n                                    ? undefined\n                                    : { borderBottom: \"none\" }, placeholder: this.props.label || undefined, onKeyDown: keydown => {\n                                    if (keydown.keyCode === 13) {\n                                        this.addItem();\n                                        keydown.preventDefault();\n                                    }\n                                }, onKeyUp: keyUp => {\n                                    if (keyUp.keyCode === 13) {\n                                        this.addItem();\n                                        keyUp.preventDefault();\n                                    }\n                                }, value: this.valueToAdd, onChange: e => (this.valueToAdd = e.target.value), disabled: this.props.disabled })),\n                        react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"Col\"], { xs: 4, sm: 3, style: { textAlign: \"right\" } }, this.props.disabled ? (\"\") : (react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_4__[\"Icon\"], { className: \"input-icon\", iconName: \"Add\", onClick: () => {\n                                this.addItem();\n                            } }))))),\n                this.props.value.length ? (react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](\"div\", { className: \"items\" },\n                    react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_4__[\"DetailsList\"], { compact: true, items: [\n                            ...this.props.value.map((x, i) => [\n                                react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](\"div\", { id: i.toString() },\n                                    this.expandIndex === i ? (react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](\"div\", { className: \"list-item\" },\n                                        react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_4__[\"TextField\"], { multiline: true, value: x, onBlur: () => (this.expandIndex = -1), disabled: this.props.disabled, autoFocus: true, onChange: (e, val) => {\n                                                this.props.value[i] = val;\n                                                (this.props\n                                                    .onChange ||\n                                                    (() => { }))(this.props.value);\n                                            } }))) : (react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](\"div\", { className: \"el-expander\", onClick: () => {\n                                            this.expandIndex = i;\n                                        } }, x.length > 30\n                                        ? x.substr(0, 25) +\n                                            \"...\"\n                                        : x)),\n                                    react__WEBPACK_IMPORTED_MODULE_5__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_4__[\"IconButton\"], { className: \"delete\", iconProps: {\n                                            iconName: \"trash\"\n                                        }, onClick: e => {\n                                            this.expandIndex = -1;\n                                            this.props.value.splice(i, 1);\n                                            (this.props.onChange ||\n                                                (() => { }))(this.props.value);\n                                        }, disabled: this.props.disabled }))\n                            ])\n                        ], isHeaderVisible: false, selectionMode: office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_4__[\"SelectionMode\"].none }))) : (\"\"))));\n    }\n};\nObject(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"])([\n    mobx__WEBPACK_IMPORTED_MODULE_2__[\"observable\"]\n], EditableListComponent.prototype, \"valueToAdd\", void 0);\nObject(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"])([\n    mobx__WEBPACK_IMPORTED_MODULE_2__[\"observable\"]\n], EditableListComponent.prototype, \"expandIndex\", void 0);\nEditableListComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"])([\n    mobx_react__WEBPACK_IMPORTED_MODULE_3__[\"observer\"]\n], EditableListComponent);\n\n\n\n//# sourceURL=webpack:///./src/common-components/editable-list/editable-list.tsx?");

/***/ }),

/***/ "./src/modules/endodontic/components/case-sheet.tsx":
/*!**********************************************************!*\
  !*** ./src/modules/endodontic/components/case-sheet.tsx ***!
  \**********************************************************/
/*! exports provided: EndoCaseSheetPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"EndoCaseSheetPanel\", function() { return EndoCaseSheetPanel; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _common_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common-components */ \"./src/common-components/index.ts\");\n/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core */ \"./src/core/index.ts\");\n/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @modules */ \"./src/modules/index.ts\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @utils */ \"./src/utils/index.ts\");\n/* harmony import */ var common_components_editable_list_editable_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! common-components/editable-list/editable-list */ \"./src/common-components/editable-list/editable-list.tsx\");\n/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! mobx */ \"./node_modules/mobx/lib/mobx.module.js\");\n/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! mobx-react */ \"./node_modules/mobx-react/index.module.js\");\n/* harmony import */ var office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! office-ui-fabric-react */ \"./node_modules/office-ui-fabric-react/lib/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_9__);\n\n\n\n\n\n\n\n\n\n\nconst EndoDiv = Object(mobx_react__WEBPACK_IMPORTED_MODULE_7__[\"observer\"])(({ canEdit, orthoCase, index }) => (react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](react__WEBPACK_IMPORTED_MODULE_9__[\"Fragment\"], null,\n    react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"div\", { style: { display: \"flex\", width: \"100%\" } },\n        react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"span\", { style: { width: \"80%\" } },\n            react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"TextField\"], { disabled: canEdit, min: 0, max: 180, value: orthoCase.workinglen[index].toString(), onChange: (ev, v) => {\n                    orthoCase.workinglen[index] = v;\n                }, type: \"text\", prefix: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(`Working Length of Canal ${index + 1} `) })),\n        react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"span\", { style: { width: \"20%\" } },\n            react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"div\", { className: \"\" },\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"IconButton\"], { className: \"delete-button\", iconProps: {\n                        iconName: \"delete\",\n                    }, onClick: () => {\n                        orthoCase.workinglen.splice(index, 1);\n                    } })))))));\nlet EndoCaseSheetPanel = class EndoCaseSheetPanel extends react__WEBPACK_IMPORTED_MODULE_9__[\"Component\"] {\n    get canEdit() {\n        return _core__WEBPACK_IMPORTED_MODULE_2__[\"user\"].currentUser.canEditOrtho;\n    }\n    render() {\n        return (react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"div\", null,\n            react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"SectionComponent\"], { title: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(`Features`) },\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"Label\"], null,\n                    \" \",\n                    Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(`Access`),\n                    \" \"),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"Dropdown\"], { disabled: !this.canEdit, placeholder: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Access\"), options: Object.keys(_modules__WEBPACK_IMPORTED_MODULE_3__[\"Access\"]).map((x) => ({\n                        key: x,\n                        text: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(_modules__WEBPACK_IMPORTED_MODULE_3__[\"Access\"][x]),\n                    })), defaultSelectedKey: this.props.orthoCase.access, onChange: (ev, has) => {\n                        this.props.orthoCase.access = has.key;\n                        console.log(\" Access has changes: \" + this.props.orthoCase.access);\n                    }, prefix: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(`Access`) }),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"br\", null),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"Label\"], null,\n                    \" \",\n                    Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(`Cleaning and Shaping`),\n                    \" \"),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"Dropdown\"], { disabled: !this.canEdit, placeholder: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Cleaning / Shaping\"), options: Object.keys(_modules__WEBPACK_IMPORTED_MODULE_3__[\"Cleaning\"]).map((x) => ({\n                        key: x,\n                        text: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(_modules__WEBPACK_IMPORTED_MODULE_3__[\"Cleaning\"][x]),\n                    })), defaultSelectedKey: this.props.orthoCase.cleaning, onChange: (ev, has) => {\n                        this.props.orthoCase.cleaning = has.key;\n                    }, prefix: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(`Cleaning and Shaping`) }),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"br\", null),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"Label\"], null,\n                    \" \",\n                    Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(`Obturbation`),\n                    \" \"),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"Dropdown\"], { disabled: !this.canEdit, placeholder: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Obturbation\"), options: Object.keys(_modules__WEBPACK_IMPORTED_MODULE_3__[\"Obturation\"]).map((x) => ({\n                        key: x,\n                        text: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(_modules__WEBPACK_IMPORTED_MODULE_3__[\"Obturation\"][x]),\n                    })), defaultSelectedKey: this.props.orthoCase.obturation, onChange: (ev, has) => {\n                        this.props.orthoCase.obturation = has.key;\n                    }, prefix: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(`Obturbation`) }),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"br\", null),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"TextField\"], { disabled: !this.canEdit, min: 0, max: 180, value: this.props.orthoCase.canals.toString(), onChange: (ev, v) => {\n                        this.props.orthoCase.canals = Object(_utils__WEBPACK_IMPORTED_MODULE_4__[\"num\"])(v);\n                    }, type: \"number\", prefix: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(`Number of Canals`) }),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"DefaultButton\"], { text: \"Add New Working Length\", allowDisabledFocus: true, onClick: (e) => {\n                        this.props.orthoCase.workinglen.push(\"\");\n                    } }),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"br\", null),\n                this.props.orthoCase.workinglen &&\n                    this.props.orthoCase.workinglen.map((item, i) => {\n                        return (react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](EndoDiv, { key: i, index: i, orthoCase: this.props.orthoCase, canEdit: !this.canEdit }));\n                    })),\n            react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"SectionComponent\"], { title: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(`Problems`) },\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](common_components_editable_list_editable_list__WEBPACK_IMPORTED_MODULE_5__[\"EditableListComponent\"], { disabled: !this.canEdit, label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Patient concerns\"), value: this.props.orthoCase.problemsList, onChange: (v) => {\n                        this.props.orthoCase.problemsList = v;\n                        console.log(\"Problem list changed: \" + v);\n                    } }),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"br\", null),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"br\", null),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](\"h3\", null, Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Other Problems\")),\n                react__WEBPACK_IMPORTED_MODULE_9__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_8__[\"TextField\"], { label: \"\", value: this.props.orthoCase.problemsOther, onChange: (ev, v) => {\n                        this.props.orthoCase.problemsOther = v;\n                    }, multiline: true, rows: 5 }))));\n    }\n};\nObject(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"])([\n    mobx__WEBPACK_IMPORTED_MODULE_6__[\"computed\"]\n], EndoCaseSheetPanel.prototype, \"canEdit\", null);\nEndoCaseSheetPanel = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"])([\n    mobx_react__WEBPACK_IMPORTED_MODULE_7__[\"observer\"]\n], EndoCaseSheetPanel);\n\n\n\n//# sourceURL=webpack:///./src/modules/endodontic/components/case-sheet.tsx?");

/***/ })

}]);