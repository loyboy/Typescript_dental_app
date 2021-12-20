import * as tslib_1 from "tslib";
import { generateID } from "@utils";
import { observable } from "mobx";
export class Message {
    constructor(string) {
        this.id = generateID();
        this.string = "";
        this.expiresIn = 10000;
        this.onExpire = () => { };
        this.string = string;
    }
}
tslib_1.__decorate([
    observable
], Message.prototype, "string", void 0);
class Messages {
    constructor() {
        this.messages = [];
    }
    addMessage(msg) {
        this.messages.push(msg);
        setTimeout(() => {
            if (this.removeMsgByID(msg.id)) {
                msg.onExpire();
            }
        }, msg.expiresIn);
    }
    removeMsgByID(id) {
        const i = this.messages.findIndex(x => x.id === id);
        if (i === -1) {
            return false;
        }
        else {
            this.messages.splice(i, 1);
            return true;
        }
    }
}
tslib_1.__decorate([
    observable
], Messages.prototype, "messages", void 0);
const messages = new Messages();
export { messages };
//# sourceMappingURL=messages.js.map