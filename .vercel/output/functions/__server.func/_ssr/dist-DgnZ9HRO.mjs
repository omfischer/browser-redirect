import { i as __toESM } from "../_runtime.mjs";
import { _ as require_react, c as OrganizationProfile, d as UserProfile, f as setErrorThrowerOptions, g as require_jsx_runtime, i as useRoutingProps, l as SignIn, n as getToken, p as UNSAFE_PortalProvider, r as InternalClerkProvider, s as OrganizationList, t as dist_exports$1, u as SignUp } from "../_libs/@clerk/react+[...].mjs";
import { c as ScriptOnce, f as useNavigate, i as useLocation, p as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as getGlobalStartContext } from "./ssr.mjs";
import { n as getPublicEnvVariables, r as isClient } from "./env-BFwBKW27.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dist-DgnZ9HRO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var ClerkOptionsCtx = import_react.createContext(void 0);
ClerkOptionsCtx.displayName = "ClerkOptionsCtx";
var ClerkOptionsProvider = (props) => {
	const { children, options } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClerkOptionsCtx.Provider, {
		value: { value: options },
		children
	});
};
var useAwaitableNavigate = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const resolveFunctionsRef = import_react.useRef([]);
	const resolveAll = () => {
		resolveFunctionsRef.current.forEach((resolve) => resolve());
		resolveFunctionsRef.current.splice(0, resolveFunctionsRef.current.length);
	};
	const [_, startTransition] = (0, import_react.useTransition)();
	import_react.useEffect(() => {
		resolveAll();
	}, [location]);
	return (options) => {
		return new Promise((res) => {
			startTransition(() => {
				resolveFunctionsRef.current.push(res);
				res(navigate(options));
			});
		});
	};
};
var pickFromClerkInitState = (clerkInitState) => {
	const { __clerk_ssr_state, __publishableKey, __proxyUrl, __domain, __isSatellite, __signInUrl, __signUpUrl, __clerkJSUrl, __clerkJSVersion, __clerkUIUrl, __clerkUIVersion, __telemetryDisabled, __telemetryDebug, __signInForceRedirectUrl, __signUpForceRedirectUrl, __signInFallbackRedirectUrl, __signUpFallbackRedirectUrl, __keylessClaimUrl, __keylessApiKeysUrl, __prefetchUI } = clerkInitState || {};
	return {
		clerkSsrState: __clerk_ssr_state,
		publishableKey: __publishableKey,
		proxyUrl: __proxyUrl,
		domain: __domain,
		isSatellite: !!__isSatellite,
		signInUrl: __signInUrl,
		signUpUrl: __signUpUrl,
		__internal_clerkJSUrl: __clerkJSUrl,
		__internal_clerkJSVersion: __clerkJSVersion,
		__internal_clerkUIUrl: __clerkUIUrl,
		__internal_clerkUIVersion: __clerkUIVersion,
		prefetchUI: __prefetchUI,
		telemetry: {
			disabled: __telemetryDisabled,
			debug: __telemetryDebug
		},
		signInForceRedirectUrl: __signInForceRedirectUrl,
		signUpForceRedirectUrl: __signUpForceRedirectUrl,
		signInFallbackRedirectUrl: __signInFallbackRedirectUrl,
		signUpFallbackRedirectUrl: __signUpFallbackRedirectUrl,
		__keylessClaimUrl,
		__keylessApiKeysUrl
	};
};
var mergeWithPublicEnvs = (restInitState) => {
	const envVars = getPublicEnvVariables();
	return {
		...restInitState,
		publishableKey: restInitState.publishableKey || envVars.publishableKey,
		domain: restInitState.domain || envVars.domain,
		isSatellite: restInitState.isSatellite || envVars.isSatellite,
		signInUrl: restInitState.signInUrl || envVars.signInUrl,
		signUpUrl: restInitState.signUpUrl || envVars.signUpUrl,
		__internal_clerkJSUrl: restInitState.__internal_clerkJSUrl || envVars.clerkJsUrl,
		__internal_clerkJSVersion: restInitState.__internal_clerkJSVersion || envVars.clerkJsVersion,
		__internal_clerkUIUrl: restInitState.__internal_clerkUIUrl || envVars.clerkUIUrl,
		__internal_clerkUIVersion: restInitState.__internal_clerkUIVersion || envVars.clerkUIVersion,
		signInForceRedirectUrl: restInitState.signInForceRedirectUrl,
		prefetchUI: restInitState.prefetchUI ?? envVars.prefetchUI
	};
};
function parseUrlForNavigation(to, baseUrl) {
	const url = new URL(to, baseUrl);
	const searchParams = Object.fromEntries(url.searchParams);
	return {
		to: url.pathname,
		search: Object.keys(searchParams).length > 0 ? searchParams : void 0,
		hash: url.hash ? url.hash.slice(1) : void 0
	};
}
var ClerkProvider_exports = /* @__PURE__ */ __exportAll({ ClerkProvider: () => ClerkProvider });
__reExport(ClerkProvider_exports, dist_exports$1);
var SDK_METADATA = {
	name: "@clerk/tanstack-react-start",
	version: "1.1.7"
};
var awaitableNavigateRef = { current: void 0 };
function ClerkProvider({ children, ...providerProps }) {
	const awaitableNavigate = useAwaitableNavigate();
	const clerkInitialState = getGlobalStartContext()?.clerkInitialState ?? {};
	(0, import_react.useEffect)(() => {
		awaitableNavigateRef.current = awaitableNavigate;
	}, [awaitableNavigate]);
	const { clerkSsrState, __keylessClaimUrl, __keylessApiKeysUrl, ...restInitState } = pickFromClerkInitState((isClient() ? window.__clerk_init_state : clerkInitialState)?.__internal_clerk_state);
	const mergedProps = {
		...mergeWithPublicEnvs(restInitState),
		...providerProps
	};
	const keylessProps = __keylessClaimUrl ? {
		__internal_keyless_claimKeylessApplicationUrl: __keylessClaimUrl,
		__internal_keyless_copyInstanceKeysUrl: __keylessApiKeysUrl
	} : {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScriptOnce, { children: `window.__clerk_init_state = ${JSON.stringify(clerkInitialState)};` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClerkOptionsProvider, {
		options: mergedProps,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InternalClerkProvider, {
			initialState: clerkSsrState,
			sdkMetadata: SDK_METADATA,
			routerPush: (to) => {
				const { search, hash, ...rest } = parseUrlForNavigation(to, window.location.origin);
				return awaitableNavigateRef.current?.({
					...rest,
					search,
					hash,
					replace: false
				});
			},
			routerReplace: (to) => {
				const { search, hash, ...rest } = parseUrlForNavigation(to, window.location.origin);
				return awaitableNavigateRef.current?.({
					...rest,
					search,
					hash,
					replace: true
				});
			},
			...mergedProps,
			...keylessProps,
			children
		})
	})] });
}
ClerkProvider.displayName = "ClerkProvider";
var usePathnameWithoutSplatRouteParams = () => {
	const { _splat } = useParams({ strict: false });
	const { pathname } = useLocation();
	const splatRouteParam = _splat || "";
	return (0, import_react.useRef)(`/${pathname.replace(splatRouteParam, "").replace(/\/$/, "").replace(/^\//, "").trim()}`).current;
};
var UserProfile$1 = Object.assign((props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserProfile, { ...useRoutingProps("UserProfile", props, { path: usePathnameWithoutSplatRouteParams() }) });
}, { ...UserProfile });
var OrganizationProfile$1 = Object.assign((props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationProfile, { ...useRoutingProps("OrganizationProfile", props, { path: usePathnameWithoutSplatRouteParams() }) });
}, { ...OrganizationProfile });
var OrganizationList$1 = Object.assign((props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationList, { ...useRoutingProps("OrganizationList", props, { path: usePathnameWithoutSplatRouteParams() }) });
}, { ...OrganizationList });
var SignIn$1 = (props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignIn, { ...useRoutingProps("SignIn", props, { path: usePathnameWithoutSplatRouteParams() }) });
};
var SignUp$1 = (props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignUp, { ...useRoutingProps("SignUp", props, { path: usePathnameWithoutSplatRouteParams() }) });
};
var client_exports = /* @__PURE__ */ __exportAll({
	ClerkProvider: () => ClerkProvider,
	OrganizationList: () => OrganizationList$1,
	OrganizationProfile: () => OrganizationProfile$1,
	SignIn: () => SignIn$1,
	SignUp: () => SignUp$1,
	UNSAFE_PortalProvider: () => UNSAFE_PortalProvider,
	UserProfile: () => UserProfile$1
});
__reExport(client_exports, ClerkProvider_exports);
var dist_exports = /* @__PURE__ */ __exportAll({
	ClerkProvider: () => ClerkProvider,
	OrganizationList: () => OrganizationList$1,
	OrganizationProfile: () => OrganizationProfile$1,
	SignIn: () => SignIn$1,
	SignUp: () => SignUp$1,
	UNSAFE_PortalProvider: () => UNSAFE_PortalProvider,
	UserProfile: () => UserProfile$1,
	getToken: () => getToken
});
__reExport(dist_exports, client_exports);
setErrorThrowerOptions({ packageName: "@clerk/tanstack-react-start" });
//#endregion
export { SignIn$1 as n, dist_exports as r, ClerkProvider as t };
