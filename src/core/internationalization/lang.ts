import { setting } from "@modules";
import { observable } from "mobx";

class Translate {
	languages: {
		code: string;
		RTL: boolean;
		loadTerms: () => Promise<{ [key: string]: string }>;
	}[] = [
		{
			code: "ar",
			RTL: true,
			loadTerms: async () => {
				return (await import("./languages/ar")).default;
			}
		},
		{
			code: "en",
			RTL: false,
			loadTerms: async () => {
				return {};
			}
		}
	];

	@observable terms: { [key: string]: string } = {};

	@observable loadedCode: string = "en";

	constructor() {
		setTimeout(() => {
			this.checkLang();
		}, 500);
		setting.onSettingChange(() => this.checkLang());
	}

	private async checkLang() {
		const languageCode = setting.getSetting("lang");
		if (languageCode !== this.loadedCode) {
			const newLang = this.languages.find(l => l.code === languageCode);
			if (newLang) {
				if (newLang.RTL) {
					this.setRTL();
				} else {
					this.unsetRTL();
				}
				this.loadedCode = languageCode;
				this.terms = await newLang.loadTerms();
			}
		}
	}

	private toUpperCase(phrase: string) {
		return phrase
		  .toLowerCase()
		  .split(' ')
		  .map(word => { if ( word.charAt(0) === '"'){ return word.charAt(1).toUpperCase() + word.slice(1) } else{ return word.charAt(0).toUpperCase() + word.slice(1) } } )
		  .join(' ');
	}

	private setRTL() {
		document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
	}

	private unsetRTL() {
		document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
	}

	text(term: string) {
	//	var newterm = this.toUpperCase(term)
		this.checkLang();
		return this.terms[term] || term;
	}
}

export const translate = new Translate();

export function text(term: string) {
	return translate.text(term);
}
