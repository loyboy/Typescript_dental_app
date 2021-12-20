import { TextField, Dialog, DialogType, DialogFooter, PrimaryButton, DefaultButton } from "office-ui-fabric-react";
import * as React from "react";
export default class PrintPrescriptionPage extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement(Dialog, { hidden: this.props.show, onDismiss: this.props.onDismiss, dialogContentProps: {
                    type: DialogType.largeHeader,
                    title: 'Type your Name and Upload an Icon as A Dentist',
                    subText: 'Follow instructions'
                }, modalProps: {
                    isBlocking: false,
                    styles: { main: { maxWidth: 450 } }
                } },
                React.createElement(TextField, { label: "Dentist's Name: ", type: "text" }),
                React.createElement("br", null),
                React.createElement(TextField, { label: "Print Logo: ", type: "file" }),
                React.createElement(DialogFooter, null,
                    React.createElement(PrimaryButton, { onClick: this.props.onPrint, text: "Print" }),
                    React.createElement(DefaultButton, { onClick: this.props.onDismiss, text: "Cancel" })))));
    }
}
//# sourceMappingURL=dialog.js.map