import * as tslib_1 from "tslib";
import { setting } from "@modules";
import { observable } from "mobx";
class Translate {
    constructor() {
        this.languages = [
            {
                code: "ar",
                RTL: true,
                loadTerms: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return (yield import("./languages/ar")).default;
                })
            },
            {
                code: "en",
                RTL: false,
                loadTerms: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return {};
                })
            }
        ];
        this.terms = {};
        this.loadedCode = "en";
        setTimeout(() => {
            this.checkLang();
        }, 500);
        setting.onSettingChange(() => this.checkLang());
    }
    checkLang() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const languageCode = setting.getSetting("lang");
            if (languageCode !== this.loadedCode) {
                const newLang = this.languages.find(l => l.code === languageCode);
                if (newLang) {
                    if (newLang.RTL) {
                        this.setRTL();
                    }
                    else {
                        this.unsetRTL();
                    }
                    this.loadedCode = languageCode;
                    this.terms = yield newLang.loadTerms();
                }
            }
        });
    }
    setRTL() {
        document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
    }
    unsetRTL() {
        document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
    }
    text(term) {
        this.checkLang();
        return this.terms[term] || term;
    }
}
tslib_1.__decorate([
    observable
], Translate.prototype, "terms", void 0);
tslib_1.__decorate([
    observable
], Translate.prototype, "loadedCode", void 0);
export const translate = new Translate();
export function text(term) {
    return translate.text(term);
}
//# sourceMappingURL=lang.js.map