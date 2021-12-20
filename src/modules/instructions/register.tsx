import { connectToDB, menu, router, user } from "@core";
import { InstructionItem, instructions, instructionsNamespace, setting } from "@modules";
import * as React from "react";
export const registerInstructions = {
	async register() {
		router.register({
			namespace: instructionsNamespace,
			regex: /^instructions/,
			component: async () => {
				const Component = (await import("./components/page.instructions"))
					.InstructionsPage;
				return <Component />;
			},
			condition: () =>
				!!setting.getSetting("module_instructions") &&
				user.currentUser.canViewInstructions
		});

		menu.items.push({
			icon: "AutoFillTemplate",
			name: instructionsNamespace,
			key: instructionsNamespace,
			onClick: () => {
				router.go([instructionsNamespace]);
			},
			order: 10,
			url: "",
			condition: () =>
				user.currentUser.canViewInstructions &&
				!!setting.getSetting("module_instructions")
		});
		await ((await connectToDB(
			instructionsNamespace,
			instructionsNamespace
		)) as any)(InstructionItem, instructions);
		return true;
	},
	order: 8
};
