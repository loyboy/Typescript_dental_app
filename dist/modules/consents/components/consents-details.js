import * as tslib_1 from "tslib";
import { SectionComponent, } from "@common-components";
import { text, user } from "@core";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { TextField } from "office-ui-fabric-react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import * as React from "react";
let ConsentsDetailsPanel = class ConsentsDetailsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.onEditorStateChange = (editorState) => {
            this.setState({
                editorState,
            });
            this.props.consent.notes = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        };
        this.state = {
            editorState: this.props.consent.notes === ""
                ? EditorState.createEmpty()
                : EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.consent.notes))),
        };
    }
    get canEdit() {
        return user.currentUser.canEditPatients;
    }
    render() {
        return (React.createElement("div", { className: "treatment-editor" },
            React.createElement(SectionComponent, { title: text("Consent") },
                React.createElement("div", { className: "treatment-input" },
                    React.createElement(TextField, { label: text("Consent Title"), value: this.props.consent.title, onChange: (ev, val) => {
                            this.props.consent.title = val;
                        }, disabled: !this.canEdit }),
                    React.createElement("label", null, "Consent Notes"),
                    React.createElement(Editor, { editorStyle: { height: 500 }, editorState: this.state.editorState, toolbarClassName: "toolbarClassName", wrapperClassName: "wrapperClassName", editorClassName: "editorClassName", onEditorStateChange: this.onEditorStateChange })))));
    }
};
tslib_1.__decorate([
    computed
], ConsentsDetailsPanel.prototype, "canEdit", null);
ConsentsDetailsPanel = tslib_1.__decorate([
    observer
], ConsentsDetailsPanel);
export { ConsentsDetailsPanel };
//# sourceMappingURL=consents-details.js.map