import { i as __toESM } from "../_runtime.mjs";
import { g as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { d as createRootRoute, l as lazyRouteComponent, n as Scripts, o as createRouter, r as HeadContent, s as Outlet, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ClerkProvider } from "./dist-DgnZ9HRO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CUBEvMc5.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var App_default = "/assets/App-Cky0-n2w.css";
var src_default = "/assets/index-B48wOAhZ.css";
var Route$1 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			},
			{ title: "Shareable gallery" },
			{
				property: "og:image",
				content: "https://example.com/image.jpg"
			},
			{
				property: "og:title",
				content: "Your Title"
			},
			{
				property: "og:description",
				content: "Your Description"
			}
		],
		links: [{
			rel: "stylesheet",
			href: src_default
		}, {
			rel: "stylesheet",
			href: App_default
		}]
	}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RootDocument, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClerkProvider, { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var $$splitComponentImporter = () => import("./routes-DAnDlDOJ.mjs");
var rootRouteChildren = { IndexRoute: createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") }).update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
