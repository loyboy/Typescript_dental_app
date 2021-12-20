import { decrypt, encrypt } from "@utils";
export const dict = {
    LSL_hash: "",
    LSL_TS: "",
    user_id: "",
    no_server_mode: "",
    server_location: ""
};
export const store = {
    get(term, non) {
        return this.found(term)
            ? decrypt(localStorage.getItem(term) || "")
            : non || "";
    },
    set(term, value) {
        localStorage.setItem(term, encrypt(value));
    },
    found(term) {
        return !!localStorage.getItem(term);
    },
    remove(term) {
        localStorage.removeItem(term);
    },
    clear() {
        localStorage.clear();
    }
};
//# sourceMappingURL=store.js.map