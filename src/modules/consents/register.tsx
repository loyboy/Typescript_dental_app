import { connectToDB, menu, router, user } from "@core";
import { consents, Consent, consentsNamespace , setting} from "@modules";
import * as React from "react";

export const registerConsents = {
	async register() {
		router.register({
			namespace: consentsNamespace,
			regex: /^consents/,
			component: async () => {
				const Component = (await import("./components/page"))
					.Consents;
				return <Component />;
			},
			condition: () =>
				!!setting.getSetting("module_consents") &&
				user.currentUser.canEditConsents
		});
		menu.items.push({
			icon: "PreviewLink",
			name: consentsNamespace,
			key: consentsNamespace,
			onClick: () => {
				router.go([consentsNamespace]);
			},
			order:8,
			url: "",
			condition: () =>
				user.currentUser.canEditConsents &&
				!!setting.getSetting("module_consents")
		});
		await ((await connectToDB(consentsNamespace, consentsNamespace)) as any)(
			Consent,
			consents
		);
		return true;
	},
	order: 12
};
