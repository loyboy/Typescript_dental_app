import * as tslib_1 from "tslib";
import { menu, resync } from "@core";
import { HomeView } from "@main-components";
import { computed, observable } from "mobx";
import * as React from "react";
class Router {
    constructor() {
        this.reSyncing = false;
        this.currentLocation = "";
        this.innerWidth = 0;
        this.directory = [];
        setTimeout(() => this.checkAndLoad(), 300);
        onhashchange = () => {
            this.checkAndLoad();
        };
        this.innerWidth = innerWidth;
        addEventListener("resize", () => (this.innerWidth = innerWidth));
    }
    get currentRoute() {
        return (this.directory.find(route => {
            return ((!route.condition || route.condition()) &&
                route.regex.test(this.currentLocation));
        }) || {
            component: () => tslib_1.__awaiter(this, void 0, void 0, function* () { return React.createElement(HomeView, null); }),
            namespace: "Home",
            regex: /a/
        });
    }
    get currentComponent() {
        return this.currentRoute.component;
    }
    get currentNamespace() {
        return this.currentRoute.namespace;
    }
    currentLoader() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const namespace = this.currentLocation.split("/")[0];
            this.reSyncing = true;
            try {
                const resyncModule = resync.modules.find(x => x.namespace === namespace);
                if (resyncModule) {
                    yield resyncModule.resync();
                }
            }
            catch (e) {
                console.log(e);
            }
            this.reSyncing = false;
            return true;
        });
    }
    register({ regex, component, namespace, condition }) {
        if (this.directory.find(x => x.namespace === namespace)) {
            console.log(namespace, "route name already registered, skipping");
            return;
        }
        this.directory.push({
            regex: regex,
            component: component,
            namespace: namespace,
            condition
        });
    }
    go(routes) {
        location.hash = "#!/" + routes.join("/");
        scrollTo(0, 0);
        menu.hide();
    }
    history(location) {
        history.go(location);
    }
    checkAndLoad() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newLocation = location.hash.substr(3);
            if (newLocation !== this.currentLocation) {
                this.currentLocation = location.hash.substr(3);
            }
        });
    }
}
tslib_1.__decorate([
    observable
], Router.prototype, "reSyncing", void 0);
tslib_1.__decorate([
    observable
], Router.prototype, "currentLocation", void 0);
tslib_1.__decorate([
    observable
], Router.prototype, "innerWidth", void 0);
tslib_1.__decorate([
    observable
], Router.prototype, "directory", void 0);
tslib_1.__decorate([
    computed
], Router.prototype, "currentRoute", null);
tslib_1.__decorate([
    computed
], Router.prototype, "currentComponent", null);
tslib_1.__decorate([
    computed
], Router.prototype, "currentNamespace", null);
export const router = new Router();
//# sourceMappingURL=router.js.map