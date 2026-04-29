import { i as __toESM } from "../_runtime.mjs";
import { _ as require_react, g as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { n as SignIn$1, r as dist_exports } from "./dist-DgnZ9HRO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BHDMmMpF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var DEFAULT_ALBUM_OWNER_EMAIL = "ole-martin@jotta.no";
var starterAlbum = {
	id: "starter-album",
	title: "North Sea light",
	description: "A small set of images ready to edit, save, and share.",
	ownerName: "Ole-Martin",
	ownerEmail: DEFAULT_ALBUM_OWNER_EMAIL,
	subscribers: [],
	updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
	photos: [
		{
			id: "seed-1",
			url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
		},
		{
			id: "seed-2",
			url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
		},
		{
			id: "seed-3",
			url: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80"
		}
	]
};
function createId() {
	if (crypto.randomUUID) return crypto.randomUUID();
	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function getDisplayName(user) {
	return user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || "My album";
}
function getPrimaryEmail(user) {
	return user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
}
function isDefaultAlbumOwnerEmail(email) {
	return email.trim().toLowerCase() === DEFAULT_ALBUM_OWNER_EMAIL;
}
function isDefaultOwnerAlbum(album) {
	return album.ownerEmail?.trim().toLowerCase() === DEFAULT_ALBUM_OWNER_EMAIL;
}
function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim());
}
function normalizeEmailList(input) {
	if (!Array.isArray(input)) return [];
	return Array.from(new Set(input.filter((email) => typeof email === "string").map((email) => email.trim().toLowerCase()).filter(isValidEmail)));
}
function normalizeAlbum(input) {
	if (!input || typeof input !== "object") return null;
	const candidate = input;
	if (!Array.isArray(candidate.photos)) return null;
	const photos = candidate.photos.filter((photo) => {
		return Boolean(photo) && typeof photo.id === "string" && typeof photo.url === "string" && isValidImageUrl(photo.url);
	}).slice(0, 24);
	return {
		id: typeof candidate.id === "string" ? candidate.id : createId(),
		title: typeof candidate.title === "string" ? candidate.title : "Untitled album",
		description: typeof candidate.description === "string" ? candidate.description : "",
		ownerName: typeof candidate.ownerName === "string" ? candidate.ownerName : "Album",
		ownerEmail: typeof candidate.ownerEmail === "string" ? candidate.ownerEmail.toLowerCase() : void 0,
		ownerId: typeof candidate.ownerId === "string" ? candidate.ownerId : void 0,
		subscribers: normalizeEmailList(candidate.subscribers),
		photos,
		updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : (/* @__PURE__ */ new Date()).toISOString()
	};
}
function normalizeInvite(input) {
	if (!input || typeof input !== "object") return null;
	const candidate = input;
	const invitedEmail = typeof candidate.invitedEmail === "string" ? candidate.invitedEmail.trim().toLowerCase() : "";
	const album = normalizeAlbum(candidate.album);
	if (!album || !isValidEmail(invitedEmail)) return null;
	return {
		album: {
			...album,
			subscribers: Array.from(new Set([...album.subscribers, invitedEmail]))
		},
		invitedEmail,
		createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : (/* @__PURE__ */ new Date()).toISOString()
	};
}
function encodePayload(payload) {
	const bytes = new TextEncoder().encode(JSON.stringify(payload));
	let binary = "";
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}
function decodePayload(payload) {
	const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
	const binary = atob(padded);
	const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
	return JSON.parse(new TextDecoder().decode(bytes));
}
function createInvitePayload(album, invitedEmail) {
	return {
		album: {
			...album,
			title: album.title.trim(),
			description: album.description.trim(),
			ownerName: album.ownerName.trim(),
			ownerEmail: album.ownerEmail?.trim().toLowerCase(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			subscribers: album.subscribers.map((email) => email.trim().toLowerCase()),
			photos: album.photos.map((photo) => ({
				id: photo.id,
				url: photo.url.trim()
			}))
		},
		invitedEmail: invitedEmail.trim().toLowerCase(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function decodeInvite(payload) {
	try {
		return normalizeInvite(decodePayload(payload));
	} catch {
		return null;
	}
}
function getInviteFromHash() {
	if (typeof window === "undefined") return null;
	const hash = window.location.hash.replace(/^#/u, "");
	const payload = new URLSearchParams(hash).get("invite");
	return payload ? decodeInvite(payload) : null;
}
function makeInviteUrl(album, invitedEmail) {
	const url = new URL(window.location.href);
	url.search = "";
	url.hash = `invite=${encodePayload(createInvitePayload(album, invitedEmail))}`;
	return url.toString();
}
function isValidImageUrl(url) {
	try {
		const parsed = new URL(url);
		return parsed.protocol === "https:" || parsed.protocol === "http:";
	} catch {
		return false;
	}
}
function getOwnedAlbumStorageKey(user) {
	return `minimal-album:owned:${user.id}`;
}
function getSubscriptionStorageKey(user) {
	return `minimal-album:subscription:${user.id}`;
}
function getRevokedSubscriberStorageKey(albumId, email) {
	return `minimal-album:revoked:${albumId}:${email}`;
}
function isAlbumSharedWithEmail(album, email) {
	return album.subscribers.includes(email.trim().toLowerCase());
}
function isSubscriberRevoked(albumId, email) {
	if (typeof window === "undefined") return false;
	return localStorage.getItem(getRevokedSubscriberStorageKey(albumId, email.trim().toLowerCase())) === "true";
}
function AlbumPreview({ album }) {
	const heroPhoto = album.photos[0];
	const remainingPhotos = album.photos.slice(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "album-preview",
		"aria-label": "Album preview",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "album-header",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: album.ownerName }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: album.title || "Untitled album" }),
					album.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: album.description }) : null
				]
			}),
			heroPhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: "hero-photo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: heroPhoto.url,
					alt: album.title
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "empty-album",
				children: "No photos yet"
			}),
			remainingPhotos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "photo-grid",
				children: remainingPhotos.map((photo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
					className: "photo-tile",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: photo.url,
						alt: album.title
					})
				}, photo.id))
			}) : null
		]
	});
}
function AlbumEditor({ album, onAlbumChange, onGenerateInvite, onRemoveSubscriber, inviteStatus, generatedInviteUrl }) {
	const [photoUrl, setPhotoUrl] = (0, import_react.useState)("");
	const [photoError, setPhotoError] = (0, import_react.useState)("");
	const [inviteEmail, setInviteEmail] = (0, import_react.useState)("");
	const updateAlbum = (updates) => {
		onAlbumChange({
			...album,
			...updates,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	};
	const handleAddPhoto = (event) => {
		event.preventDefault();
		if (!isValidImageUrl(photoUrl)) {
			setPhotoError("Use a valid image URL.");
			return;
		}
		setPhotoError("");
		updateAlbum({ photos: [...album.photos, {
			id: createId(),
			url: photoUrl.trim()
		}] });
		setPhotoUrl("");
	};
	const handleRemovePhoto = (id) => {
		updateAlbum({ photos: album.photos.filter((photo) => photo.id !== id) });
	};
	const handleGenerateInvite = (event) => {
		event.preventDefault();
		onGenerateInvite(inviteEmail);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "workspace-panel",
		"aria-label": "Album editor",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Album" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: album.title,
				onChange: (event) => updateAlbum({ title: event.target.value }),
				placeholder: "Album title"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Description", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: album.description,
				onChange: (event) => updateAlbum({ description: event.target.value }),
				placeholder: "A short note for people you share with",
				rows: 3
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "photo-form",
				onSubmit: handleAddPhoto,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Image URL", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: photoUrl,
						onChange: (event) => setPhotoUrl(event.target.value),
						placeholder: "https://..."
					})] }),
					photoError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "error-line",
						children: photoError
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "primary-button",
						children: "Add photo"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "invite-form",
				onSubmit: handleGenerateInvite,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Invite subscriber" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Type an email address, generate a link, then send it manually." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Subscriber email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						value: inviteEmail,
						onChange: (event) => setInviteEmail(event.target.value),
						placeholder: "friend@example.com"
					})] }),
					inviteStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "status-line",
						children: inviteStatus
					}) : null,
					generatedInviteUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Invite link", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						readOnly: true,
						rows: 4,
						value: generatedInviteUrl
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "secondary-button",
						children: "Generate invite link"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "subscriber-list",
				"aria-label": "Subscribers",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Subscribers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Members who can open this album from an invite." })] }), album.subscribers.length > 0 ? album.subscribers.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "subscriber-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: email }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onRemoveSubscriber(email),
						children: "Remove"
					})]
				}, email)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "empty-subscribers",
					children: "No subscribers yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "photo-list",
				children: album.photos.map((photo, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "photo-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: photo.url,
							alt: ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: `Photo ${index + 1}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new URL(photo.url).hostname })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleRemovePhoto(photo.id),
							children: "Remove"
						})
					]
				}, photo.id))
			})
		]
	});
}
function AuthPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "workspace-panel",
		"aria-label": "Authentication",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "panel-heading",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sign in" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "clerk-panel",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignIn$1, { routing: "hash" })
		})]
	});
}
function NoAlbumAvailable({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "empty-state",
		"aria-label": "No album available",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No album available" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: message }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open an invite link and subscribe with the invited email address to view this album." })
		] })
	});
}
function AccessPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "workspace-panel",
		"aria-label": "Album access",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "panel-heading",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Access" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "invite-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Private album" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Invite required" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"This album is owned by ",
					DEFAULT_ALBUM_OWNER_EMAIL,
					". Open an invite from the owner to subscribe."
				] })
			]
		})]
	});
}
function SubscribePanel({ invite, signedInEmail, onSubscribe, onClearInvite }) {
	const canSubscribe = signedInEmail === invite.invitedEmail && isDefaultOwnerAlbum(invite.album) && isAlbumSharedWithEmail(invite.album, signedInEmail) && !isSubscriberRevoked(invite.album.id, signedInEmail);
	const blockedMessage = signedInEmail === invite.invitedEmail ? "This invite is no longer active for your account." : `Sign in as ${invite.invitedEmail} to subscribe to this album.`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "workspace-panel",
		"aria-label": "Album invite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Invite" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "invite-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Album invitation" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: invite.album.title || "Untitled album" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"This invite is for ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: invite.invitedEmail }),
						"."
					] })
				]
			}),
			canSubscribe ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "status-line",
				children: "You are signed in with the invited email address."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "primary-button",
				onClick: onSubscribe,
				children: "Subscribe to album"
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "error-line",
				children: blockedMessage
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "ghost-button",
				onClick: onClearInvite,
				children: "Dismiss invite"
			})
		]
	});
}
function SubscriptionPanel({ album, onReturnToOwnAlbum }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "workspace-panel",
		"aria-label": "Subscription",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Subscribed" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "invite-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Available album" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: album.title || "Untitled album" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Subscribed albums are read-only in this local demo." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "ghost-button",
				onClick: onReturnToOwnAlbum,
				children: "Return to my album"
			})
		]
	});
}
function App() {
	const { isLoaded, isSignedIn, user } = (0, dist_exports.useUser)();
	const [album, setAlbum] = (0, import_react.useState)(null);
	const [subscribedAlbum, setSubscribedAlbum] = (0, import_react.useState)(null);
	const [pendingInvite, setPendingInvite] = (0, import_react.useState)(null);
	const [inviteStatus, setInviteStatus] = (0, import_react.useState)("");
	const [generatedInviteUrl, setGeneratedInviteUrl] = (0, import_react.useState)("");
	const [loadedUserId, setLoadedUserId] = (0, import_react.useState)(null);
	const signedInUser = isSignedIn ? user : null;
	const displayName = getDisplayName(signedInUser);
	const signedInEmail = getPrimaryEmail(signedInUser);
	const isDefaultAlbumOwner = isDefaultAlbumOwnerEmail(signedInEmail);
	const hasLoadedSignedInUser = Boolean(signedInUser) && loadedUserId === signedInUser?.id;
	const activeSubscribedAlbum = hasLoadedSignedInUser && !isDefaultAlbumOwner && subscribedAlbum && isDefaultOwnerAlbum(subscribedAlbum) && isAlbumSharedWithEmail(subscribedAlbum, signedInEmail) && !isSubscriberRevoked(subscribedAlbum.id, signedInEmail) ? subscribedAlbum : null;
	const subscribedToPendingInvite = hasLoadedSignedInUser && Boolean(pendingInvite) && activeSubscribedAlbum?.id === pendingInvite?.album.id;
	const shouldShowInviteGate = Boolean(pendingInvite) && !subscribedToPendingInvite;
	const visibleAlbum = hasLoadedSignedInUser && !shouldShowInviteGate ? activeSubscribedAlbum ?? (isDefaultAlbumOwner ? album : null) : null;
	const canEdit = isLoaded && hasLoadedSignedInUser && isDefaultAlbumOwner;
	(0, import_react.useEffect)(() => {
		if (!isLoaded || !signedInUser) {
			queueMicrotask(() => {
				setLoadedUserId(null);
				setAlbum(null);
				setSubscribedAlbum(null);
			});
			return;
		}
		let normalizedAlbum = null;
		if (isDefaultAlbumOwner) {
			const ownedAlbumStorageKey = getOwnedAlbumStorageKey(signedInUser);
			const storedAlbum = localStorage.getItem(ownedAlbumStorageKey);
			if (storedAlbum) try {
				normalizedAlbum = normalizeAlbum(JSON.parse(storedAlbum));
			} catch {
				localStorage.removeItem(ownedAlbumStorageKey);
			}
		}
		const subscriptionStorageKey = getSubscriptionStorageKey(signedInUser);
		const storedSubscription = localStorage.getItem(subscriptionStorageKey);
		let normalizedSubscription = null;
		if (storedSubscription) try {
			normalizedSubscription = normalizeAlbum(JSON.parse(storedSubscription));
			if (normalizedSubscription && (!isDefaultOwnerAlbum(normalizedSubscription) || !isAlbumSharedWithEmail(normalizedSubscription, signedInEmail) || isSubscriberRevoked(normalizedSubscription.id, signedInEmail))) {
				normalizedSubscription = null;
				localStorage.removeItem(subscriptionStorageKey);
			}
		} catch {
			localStorage.removeItem(subscriptionStorageKey);
		}
		queueMicrotask(() => {
			setAlbum(isDefaultAlbumOwner ? normalizedAlbum ?? {
				...starterAlbum,
				id: `album-${signedInUser.id}`,
				ownerName: displayName,
				ownerEmail: DEFAULT_ALBUM_OWNER_EMAIL,
				ownerId: signedInUser.id,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : null);
			setSubscribedAlbum(normalizedSubscription);
			setLoadedUserId(signedInUser.id);
		});
	}, [
		displayName,
		isDefaultAlbumOwner,
		isLoaded,
		signedInEmail,
		signedInUser
	]);
	(0, import_react.useEffect)(() => {
		if (!album || !signedInUser || loadedUserId !== signedInUser.id || !isDefaultAlbumOwner) return;
		localStorage.setItem(getOwnedAlbumStorageKey(signedInUser), JSON.stringify(album));
	}, [
		album,
		isDefaultAlbumOwner,
		loadedUserId,
		signedInUser
	]);
	(0, import_react.useEffect)(() => {
		const handleHashChange = () => {
			setPendingInvite(getInviteFromHash());
		};
		handleHashChange();
		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);
	const handleGenerateInvite = (email) => {
		if (!album || !isDefaultAlbumOwner) return;
		const normalizedEmail = email.trim().toLowerCase();
		if (!isValidEmail(normalizedEmail)) {
			setInviteStatus("Enter a valid email address.");
			setGeneratedInviteUrl("");
			return;
		}
		localStorage.removeItem(getRevokedSubscriberStorageKey(album.id, normalizedEmail));
		const nextAlbum = {
			...album,
			subscribers: Array.from(new Set([...album.subscribers, normalizedEmail])),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const inviteUrl = makeInviteUrl(nextAlbum, normalizedEmail);
		setAlbum(nextAlbum);
		setGeneratedInviteUrl(inviteUrl);
		setInviteStatus("Invite link generated. Send it manually to the subscriber.");
	};
	const handleSubscribe = () => {
		if (!pendingInvite || !signedInUser || signedInEmail !== pendingInvite.invitedEmail || !isDefaultOwnerAlbum(pendingInvite.album) || !isAlbumSharedWithEmail(pendingInvite.album, signedInEmail) || isSubscriberRevoked(pendingInvite.album.id, signedInEmail)) return;
		const subscribed = {
			...pendingInvite.album,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		setSubscribedAlbum(subscribed);
		localStorage.setItem(getSubscriptionStorageKey(signedInUser), JSON.stringify(subscribed));
		setPendingInvite(null);
		window.history.replaceState(null, "", window.location.pathname);
	};
	const handleClearInvite = () => {
		setPendingInvite(null);
		window.history.replaceState(null, "", window.location.pathname);
	};
	const handleReturnToOwnAlbum = () => {
		setSubscribedAlbum(null);
		if (signedInUser) localStorage.removeItem(getSubscriptionStorageKey(signedInUser));
	};
	const handleRemoveSubscriber = (email) => {
		if (!album || !isDefaultAlbumOwner) return;
		const normalizedEmail = email.trim().toLowerCase();
		localStorage.setItem(getRevokedSubscriberStorageKey(album.id, normalizedEmail), "true");
		setAlbum({
			...album,
			subscribers: album.subscribers.filter((subscriberEmail) => subscriberEmail !== normalizedEmail),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		setInviteStatus(`${normalizedEmail} was removed from this album.`);
		setGeneratedInviteUrl("");
	};
	const emptyMessage = (0, import_react.useMemo)(() => {
		if (!isLoaded) return "Loading album access...";
		if (!signedInUser) return pendingInvite ? "Sign in to subscribe to this invite." : `Sign in as ${DEFAULT_ALBUM_OWNER_EMAIL} or with an invited account.`;
		if (!isDefaultAlbumOwner && !pendingInvite) return `This private album is only visible to ${DEFAULT_ALBUM_OWNER_EMAIL} and invited subscribers.`;
		if (pendingInvite && signedInEmail !== pendingInvite.invitedEmail) return "This invite is not for the signed-in account.";
		if (pendingInvite) return "Subscribe to make this album available.";
		return "You are not subscribed to an album yet.";
	}, [
		isDefaultAlbumOwner,
		isLoaded,
		pendingInvite,
		signedInEmail,
		signedInUser
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Album" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Shareable gallery" })] }), signedInUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "user-button",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(dist_exports.UserButton, {})
				}) : null]
			}),
			pendingInvite ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shared-strip",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Invite for ", pendingInvite.invitedEmail] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleClearInvite,
					children: "Dismiss"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "workspace",
				children: [visibleAlbum ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlbumPreview, { album: visibleAlbum }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoAlbumAvailable, { message: emptyMessage }), !isLoaded || !signedInUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthPanel, {}) : shouldShowInviteGate && pendingInvite ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubscribePanel, {
					invite: pendingInvite,
					signedInEmail,
					onSubscribe: handleSubscribe,
					onClearInvite: handleClearInvite
				}) : activeSubscribedAlbum ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubscriptionPanel, {
					album: activeSubscribedAlbum,
					onReturnToOwnAlbum: handleReturnToOwnAlbum
				}) : canEdit && album ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlbumEditor, {
					album,
					onAlbumChange: setAlbum,
					onGenerateInvite: handleGenerateInvite,
					onRemoveSubscriber: handleRemoveSubscriber,
					inviteStatus,
					generatedInviteUrl
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessPanel, {})]
			})
		]
	});
}
var SplitComponent = App;
//#endregion
export { SplitComponent as component };
