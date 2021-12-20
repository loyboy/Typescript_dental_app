import { connectToDB, menu, router, user } from "@core";
import { implants, Implant, implantsNamespace , setting} from "@modules";
import * as React from "react";

export const registerImplants = {
	async register() {
		router.register({
			namespace: implantsNamespace,
			regex: /^implants/,
			component: async () => {
				const Component = (await import("./components/page"))
					.Consents;
				return <Component />;
			},
			condition: () =>
				!!setting.getSetting("module_implants") &&
				user.currentUser.canEditImplants
		});
		menu.items.push({
			icon: "DataEnrichment",
			name: implantsNamespace,
			key: implantsNamespace,
			onClick: () => {
				router.go([implantsNamespace]);
			},
			order:8,
			url: "",
			condition: () =>
				user.currentUser.canEditImplants &&
				!!setting.getSetting("module_implants")
		});
		await ((await connectToDB(implantsNamespace, implantsNamespace)) as any)(
			Implant,
			implants
		);
		return true;
	},
	order: 15
};
