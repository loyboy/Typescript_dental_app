import { connectToDB, menu, router, user } from "@core";
import { Expense, expensesNamespace, expenses, setting, Expenses } from "@modules";
import * as React from "react";

export const registerExpense = {
  register: async () => {
    router.register({
      namespace: expensesNamespace,
      regex: /^expenses/,
      component: async () => {
        const Component = (await import("./components/page.expense"))
            .Expenses;
        return <Component />;
      },
      condition: () => user.currentUser.canViewExpense && !!setting.getSetting("module_insurance") 
    });

    // menu.items.push({
    //   icon: "PaymentCard",
    //   name: expensesNamespace,
    //   onClick: () => {
    //     router.go([expensesNamespace]);
    //   },
    //   order: 5,  
    //   url: "",
    //   key: expensesNamespace,
    //   condition: () => user.currentUser.canViewExpense && !!setting.getSetting("module_insurance")
    // });
    await ((await connectToDB(expensesNamespace, expensesNamespace)) as any)(
      Expense,
      expenses
    );
    return true;  
  },
  order: 11
};