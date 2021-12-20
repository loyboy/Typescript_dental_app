import { connectToDB, menu, router, user } from "@core";
import { Insurance, insurances, setting } from "@modules";
import * as React from "react";
import { financialNamespace } from './data';

export const registerFinancial = {
  register: async () => {
    router.register({
      namespace: financialNamespace,
      regex: /^financial/,
      component: async () => {
        const Component = (await import("./components/page.financial"))
          .Financial;
        return <Component />;
      },
      condition: () => true
      // user.currentUser.canViewInsurance && !!setting.getSetting("module_insurance") 
    });

    menu.items.push({
      icon: "PaymentCard",
      name: financialNamespace,
      onClick: () => {
        router.go([financialNamespace]);
      },
      order: 5,
      url: "",
      key: financialNamespace,
      condition: () => true
      // user.currentUser.canViewInsurance && !!setting.getSetting("module_insurance")
    });
    // await ((await connectToDB(financialNamespace, financialNamespace)) as any)(
    //   Insurance,
    //   insurances
    // );
    return true;
  },
  order: 3
};
