import { connectToDB, menu, router, user } from "@core";
import { implantz, Implantation, implantzNamespace , setting } from "@modules";
import * as React from "react";

export const registerImplantz = {
  register: async () => {
    router.register({
      namespace: implantzNamespace,
      regex: /^implantz/,
      component: async () => {
        const Component = (await import("./components/page"))
          .ImplantationPanel;
        return <Component />;
      },
      condition: () => user.currentUser.canEditImplants && !!setting.getSetting("module_implants") 
    });

    menu.items.push({
      icon: "PaymentCard",
      name: implantzNamespace,
      onClick: () => {
        router.go([implantzNamespace]);
      },
      order:8,
      url: "",
      key: implantzNamespace,
      condition: () => user.currentUser.canEditImplants && !!setting.getSetting("module_implants")
    });
    await ((await connectToDB(implantzNamespace, implantzNamespace)) as any)(
      Implantation,
      implantz
    );
    return true;
  },
  order: 12
};
