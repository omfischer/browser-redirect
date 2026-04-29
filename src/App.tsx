import { SignIn, UserButton, useUser } from "@clerk/tanstack-react-start";
import { FormEvent, useEffect, useMemo, useState } from "react";
import "./App.css";

type Photo = {
  id: string;
  url: string;
};

type Album = {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  ownerEmail?: string;
  ownerId?: string;
  subscribers: string[];
  photos: Photo[];
  updatedAt: string;
};

type AlbumInvite = {
  album: Album;
  invitedEmail: string;
  createdAt: string;
};

type AlbumUser = {
  id: string;
  fullName?: string | null;
  firstName?: string | null;
  primaryEmailAddress?: {
    emailAddress?: string | null;
  } | null;
};

const DEFAULT_ALBUM_OWNER_EMAIL = "ole-martin@jottagroup.no";
const DEFAULT_ALBUM_OWNER_NAME = "Ole-Martin";

const starterAlbum: Album = {
  id: "starter-album",
  title: "North Sea light",
  description: "A small set of images ready to edit, save, and share.",
  ownerName: DEFAULT_ALBUM_OWNER_NAME,
  ownerEmail: DEFAULT_ALBUM_OWNER_EMAIL,
  subscribers: [],
  updatedAt: new Date().toISOString(),
  photos: [
    {
      id: "seed-1",
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    },
    {
      id: "seed-2",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "seed-3",
      url: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDisplayName(user: AlbumUser | null | undefined) {
  return (
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "My album"
  );
}

function getPrimaryEmail(user: AlbumUser | null | undefined) {
  return user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
}

function isDefaultAlbumOwnerEmail(email: string) {
  return email.trim().toLowerCase() === DEFAULT_ALBUM_OWNER_EMAIL;
}

function isDefaultOwnerAlbum(album: Album) {
  return album.ownerEmail?.trim().toLowerCase() === DEFAULT_ALBUM_OWNER_EMAIL;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim());
}

function normalizeEmailList(input: unknown) {
  if (!Array.isArray(input)) {
    return [];
  }

  return Array.from(
    new Set(
      input
        .filter((email): email is string => typeof email === "string")
        .map((email) => email.trim().toLowerCase())
        .filter(isValidEmail)
    )
  );
}

function normalizeAlbum(input: unknown): Album | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as Partial<Album>;

  if (!Array.isArray(candidate.photos)) {
    return null;
  }

  const photos = candidate.photos
    .filter((photo): photo is Photo => {
      return (
        Boolean(photo) &&
        typeof photo.id === "string" &&
        typeof photo.url === "string" &&
        isValidImageUrl(photo.url)
      );
    })
    .slice(0, 24);

  return {
    id: typeof candidate.id === "string" ? candidate.id : createId(),
    title: typeof candidate.title === "string" ? candidate.title : "Untitled album",
    description:
      typeof candidate.description === "string" ? candidate.description : "",
    ownerName:
      typeof candidate.ownerName === "string" ? candidate.ownerName : "Album",
    ownerEmail:
      typeof candidate.ownerEmail === "string"
        ? candidate.ownerEmail.toLowerCase()
        : undefined,
    ownerId: typeof candidate.ownerId === "string" ? candidate.ownerId : undefined,
    subscribers: normalizeEmailList(candidate.subscribers),
    photos,
    updatedAt:
      typeof candidate.updatedAt === "string"
        ? candidate.updatedAt
        : new Date().toISOString(),
  };
}

function normalizeInvite(input: unknown): AlbumInvite | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as Partial<AlbumInvite>;
  const invitedEmail =
    typeof candidate.invitedEmail === "string"
      ? candidate.invitedEmail.trim().toLowerCase()
      : "";
  const album = normalizeAlbum(candidate.album);

  if (!album || !isValidEmail(invitedEmail)) {
    return null;
  }

  return {
    album: {
      ...album,
      subscribers: Array.from(new Set([...album.subscribers, invitedEmail])),
    },
    invitedEmail,
    createdAt:
      typeof candidate.createdAt === "string"
        ? candidate.createdAt
        : new Date().toISOString(),
  };
}

function encodePayload(payload: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function decodePayload(payload: string) {
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return JSON.parse(new TextDecoder().decode(bytes));
}

function createInvitePayload(album: Album, invitedEmail: string): AlbumInvite {
  const compactAlbum: Album = {
    ...album,
    title: album.title.trim(),
    description: album.description.trim(),
    ownerName: album.ownerName.trim(),
    ownerEmail: album.ownerEmail?.trim().toLowerCase(),
    updatedAt: new Date().toISOString(),
    subscribers: album.subscribers.map((email) => email.trim().toLowerCase()),
    photos: album.photos.map((photo) => ({
      id: photo.id,
      url: photo.url.trim(),
    })),
  };

  return {
    album: compactAlbum,
    invitedEmail: invitedEmail.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  };
}

function decodeInvite(payload: string) {
  try {
    return normalizeInvite(decodePayload(payload));
  } catch {
    return null;
  }
}

function getInviteFromHash() {
  if (typeof window === "undefined") {
    return null;
  }

  const hash = window.location.hash.replace(/^#/u, "");
  const params = new URLSearchParams(hash);
  const payload = params.get("invite");

  return payload ? decodeInvite(payload) : null;
}

function makeInviteUrl(album: Album, invitedEmail: string) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = `invite=${encodePayload(createInvitePayload(album, invitedEmail))}`;

  return url.toString();
}

function isValidImageUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function getOwnedAlbumStorageKey(user: AlbumUser) {
  return `minimal-album:owned:${user.id}`;
}

function getSubscriptionStorageKey(user: AlbumUser) {
  return `minimal-album:subscription:${user.id}`;
}

function getRevokedSubscriberStorageKey(albumId: string, email: string) {
  return `minimal-album:revoked:${albumId}:${email}`;
}

function isAlbumSharedWithEmail(album: Album, email: string) {
  return album.subscribers.includes(email.trim().toLowerCase());
}

function isSubscriberRevoked(albumId: string, email: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    localStorage.getItem(
      getRevokedSubscriberStorageKey(albumId, email.trim().toLowerCase())
    ) === "true"
  );
}

function AlbumPreview({
  album,
  showSubscribers = false,
}: {
  album: Album;
  showSubscribers?: boolean;
}) {
  const heroPhoto = album.photos[0];
  const remainingPhotos = album.photos.slice(1);

  return (
    <section className="album-preview" aria-label="Album preview">
      <div className="album-header">
        <p>{album.ownerName}</p>
        <h1>{album.title || "Untitled album"}</h1>
        {album.description ? <span>{album.description}</span> : null}
      </div>

      {heroPhoto ? (
        <figure className="hero-photo">
          <img src={heroPhoto.url} alt={album.title} />
        </figure>
      ) : (
        <div className="empty-album">No photos yet</div>
      )}

      {remainingPhotos.length > 0 ? (
        <div className="photo-grid">
          {remainingPhotos.map((photo) => (
            <figure key={photo.id} className="photo-tile">
              <img src={photo.url} alt={album.title} />
            </figure>
          ))}
        </div>
      ) : null}

      {showSubscribers ? (
        <section className="album-subscribers" aria-label="Album subscribers">
          <div>
            <p>Subscribers</p>
            <span>{album.subscribers.length} members</span>
          </div>

          {album.subscribers.length > 0 ? (
            <ul>
              {album.subscribers.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          ) : (
            <span>No subscribers yet.</span>
          )}
        </section>
      ) : null}
    </section>
  );
}

function AlbumEditor({
  album,
  onGenerateInvite,
  onRemoveSubscriber,
  inviteStatus,
  generatedInviteUrl,
}: {
  album: Album;
  onGenerateInvite: (email: string) => void;
  onRemoveSubscriber: (email: string) => void;
  inviteStatus: string;
  generatedInviteUrl: string;
}) {
  const [inviteEmail, setInviteEmail] = useState("");

  const handleGenerateInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onGenerateInvite(inviteEmail);
  };

  return (
    <aside className="workspace-panel" aria-label="Album editor">
      <div className="panel-heading">
        <p>Album</p>
      </div>

      <form className="invite-form" onSubmit={handleGenerateInvite}>
        <div>
          <p>Invite subscriber</p>
          <span>Type an email address, generate a link, then send it manually.</span>
        </div>

        <label>
          Subscriber email
          <input
            type="email"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="friend@example.com"
          />
        </label>

        {inviteStatus ? <div className="status-line">{inviteStatus}</div> : null}

        {generatedInviteUrl ? (
          <label>
            Invite link
            <textarea readOnly rows={4} value={generatedInviteUrl} />
          </label>
        ) : null}

        <button type="submit" className="secondary-button">
          Generate invite link
        </button>
      </form>

      <section className="subscriber-list" aria-label="Subscribers">
        <div>
          <p>Subscribers</p>
          <span>Members who can open this album from an invite.</span>
        </div>

        {album.subscribers.length > 0 ? (
          album.subscribers.map((email) => (
            <div className="subscriber-row" key={email}>
              <span>{email}</span>
              <button type="button" onClick={() => onRemoveSubscriber(email)}>
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="empty-subscribers">No subscribers yet.</div>
        )}
      </section>
    </aside>
  );
}

function AuthPanel() {
  return (
    <aside className="workspace-panel" aria-label="Authentication">
      <div className="panel-heading">
        <p>Sign in</p>
      </div>

      <div className="clerk-panel">
        <SignIn routing="hash" />
      </div>
    </aside>
  );
}

function NoAlbumAvailable({ message }: { message: string }) {
  return (
    <section className="empty-state" aria-label="No album available">
      <div>
        <p>No album available</p>
        <h1>{message}</h1>
        <span>
          Open an invite link and subscribe with the invited email address to
          view this album.
        </span>
      </div>
    </section>
  );
}

function AccessPanel() {
  return (
    <aside className="workspace-panel" aria-label="Album access">
      <div className="panel-heading">
        <p>Access</p>
      </div>

      <div className="invite-card">
        <span>Private album</span>
        <h2>Invite required</h2>
        <p>
          This album is owned by {DEFAULT_ALBUM_OWNER_EMAIL}. Open an invite
          from the owner to subscribe.
        </p>
      </div>
    </aside>
  );
}

function SubscribePanel({
  invite,
  signedInEmail,
  onSubscribe,
  onClearInvite,
}: {
  invite: AlbumInvite;
  signedInEmail: string;
  onSubscribe: () => void;
  onClearInvite: () => void;
}) {
  const canSubscribe =
    signedInEmail === invite.invitedEmail &&
    isDefaultOwnerAlbum(invite.album) &&
    isAlbumSharedWithEmail(invite.album, signedInEmail) &&
    !isSubscriberRevoked(invite.album.id, signedInEmail);
  const blockedMessage =
    signedInEmail === invite.invitedEmail
      ? "This invite is no longer active for your account."
      : `Sign in as ${invite.invitedEmail} to subscribe to this album.`;

  return (
    <aside className="workspace-panel" aria-label="Album invite">
      <div className="panel-heading">
        <p>Invite</p>
      </div>

      <div className="invite-card">
        <span>Album invitation</span>
        <h2>{invite.album.title || "Untitled album"}</h2>
        <p>
          This invite is for <strong>{invite.invitedEmail}</strong>.
        </p>
      </div>

      {canSubscribe ? (
        <>
          <div className="status-line">
            You are signed in with the invited email address.
          </div>
          <button type="button" className="primary-button" onClick={onSubscribe}>
            Subscribe to album
          </button>
        </>
      ) : (
        <div className="error-line">{blockedMessage}</div>
      )}

      <button type="button" className="ghost-button" onClick={onClearInvite}>
        Dismiss invite
      </button>
    </aside>
  );
}

function SubscriptionPanel({
  album,
  onReturnToOwnAlbum,
}: {
  album: Album;
  onReturnToOwnAlbum: () => void;
}) {
  return (
    <aside className="workspace-panel" aria-label="Subscription">
      <div className="panel-heading">
        <p>Subscribed</p>
      </div>

      <div className="invite-card">
        <span>Available album</span>
        <h2>{album.title || "Untitled album"}</h2>
        <p>Subscribed albums are read-only in this local demo.</p>
      </div>

      <button type="button" className="ghost-button" onClick={onReturnToOwnAlbum}>
        Return to my album
      </button>
    </aside>
  );
}

function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [album, setAlbum] = useState<Album | null>(null);
  const [subscribedAlbum, setSubscribedAlbum] = useState<Album | null>(null);
  const [pendingInvite, setPendingInvite] = useState<AlbumInvite | null>(null);
  const [inviteStatus, setInviteStatus] = useState("");
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState("");
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const signedInUser = isSignedIn ? user : null;
  const displayName = getDisplayName(signedInUser);
  const signedInEmail = getPrimaryEmail(signedInUser);
  const isDefaultAlbumOwner = isDefaultAlbumOwnerEmail(signedInEmail);
  const hasLoadedSignedInUser =
    Boolean(signedInUser) && loadedUserId === signedInUser?.id;
  const activeSubscribedAlbum =
    hasLoadedSignedInUser &&
      !isDefaultAlbumOwner &&
      subscribedAlbum &&
      isDefaultOwnerAlbum(subscribedAlbum) &&
      isAlbumSharedWithEmail(subscribedAlbum, signedInEmail) &&
      !isSubscriberRevoked(subscribedAlbum.id, signedInEmail)
      ? subscribedAlbum
      : null;

  const subscribedToPendingInvite =
    hasLoadedSignedInUser &&
    Boolean(pendingInvite) &&
    activeSubscribedAlbum?.id === pendingInvite?.album.id;
  const shouldShowInviteGate = Boolean(pendingInvite) && !subscribedToPendingInvite;
  const visibleAlbum =
    hasLoadedSignedInUser && !shouldShowInviteGate
      ? activeSubscribedAlbum ?? (isDefaultAlbumOwner ? album : null)
      : null;
  const canEdit = isLoaded && hasLoadedSignedInUser && isDefaultAlbumOwner;

  useEffect(() => {
    if (!isLoaded || !signedInUser) {
      queueMicrotask(() => {
        setLoadedUserId(null);
        setAlbum(null);
        setSubscribedAlbum(null);
      });
      return;
    }

    let normalizedAlbum: Album | null = null;

    if (isDefaultAlbumOwner) {
      const ownedAlbumStorageKey = getOwnedAlbumStorageKey(signedInUser);
      const storedAlbum = localStorage.getItem(ownedAlbumStorageKey);

      if (storedAlbum) {
        try {
          normalizedAlbum = normalizeAlbum(JSON.parse(storedAlbum));
        } catch {
          localStorage.removeItem(ownedAlbumStorageKey);
        }
      }
    }

    const subscriptionStorageKey = getSubscriptionStorageKey(signedInUser);
    const storedSubscription = localStorage.getItem(subscriptionStorageKey);
    let normalizedSubscription: Album | null = null;

    if (storedSubscription) {
      try {
        normalizedSubscription = normalizeAlbum(JSON.parse(storedSubscription));
        if (
          normalizedSubscription &&
          (!isDefaultOwnerAlbum(normalizedSubscription) ||
            !isAlbumSharedWithEmail(normalizedSubscription, signedInEmail) ||
            isSubscriberRevoked(normalizedSubscription.id, signedInEmail))
        ) {
          normalizedSubscription = null;
          localStorage.removeItem(subscriptionStorageKey);
        }
      } catch {
        localStorage.removeItem(subscriptionStorageKey);
      }
    }

    queueMicrotask(() => {
      setAlbum(
        isDefaultAlbumOwner
          ? normalizedAlbum ?? {
            ...starterAlbum,
            id: `album-${signedInUser.id}`,
            ownerName: displayName,
            ownerEmail: DEFAULT_ALBUM_OWNER_EMAIL,
            ownerId: signedInUser.id,
            updatedAt: new Date().toISOString(),
          }
          : null
      );
      setSubscribedAlbum(normalizedSubscription);
      setLoadedUserId(signedInUser.id);
    });
  }, [displayName, isDefaultAlbumOwner, isLoaded, signedInEmail, signedInUser]);

  useEffect(() => {
    if (
      !album ||
      !signedInUser ||
      loadedUserId !== signedInUser.id ||
      !isDefaultAlbumOwner
    ) {
      return;
    }

    localStorage.setItem(getOwnedAlbumStorageKey(signedInUser), JSON.stringify(album));
  }, [album, isDefaultAlbumOwner, loadedUserId, signedInUser]);

  useEffect(() => {
    const handleHashChange = () => {
      setPendingInvite(getInviteFromHash());
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleGenerateInvite = (email: string) => {
    if (!album || !isDefaultAlbumOwner) {
      return;
    }

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
      updatedAt: new Date().toISOString(),
    };
    const inviteUrl = makeInviteUrl(nextAlbum, normalizedEmail);
    setAlbum(nextAlbum);
    setGeneratedInviteUrl(inviteUrl);
    setInviteStatus("Invite link generated. Send it manually to the subscriber.");
  };

  const handleSubscribe = () => {
    if (
      !pendingInvite ||
      !signedInUser ||
      signedInEmail !== pendingInvite.invitedEmail ||
      !isDefaultOwnerAlbum(pendingInvite.album) ||
      !isAlbumSharedWithEmail(pendingInvite.album, signedInEmail) ||
      isSubscriberRevoked(pendingInvite.album.id, signedInEmail)
    ) {
      return;
    }

    const subscribed = {
      ...pendingInvite.album,
      updatedAt: new Date().toISOString(),
    };

    setSubscribedAlbum(subscribed);
    localStorage.setItem(
      getSubscriptionStorageKey(signedInUser),
      JSON.stringify(subscribed)
    );
    setPendingInvite(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const handleClearInvite = () => {
    setPendingInvite(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const handleReturnToOwnAlbum = () => {
    setSubscribedAlbum(null);

    if (signedInUser) {
      localStorage.removeItem(getSubscriptionStorageKey(signedInUser));
    }
  };

  const handleRemoveSubscriber = (email: string) => {
    if (!album || !isDefaultAlbumOwner) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    localStorage.setItem(
      getRevokedSubscriberStorageKey(album.id, normalizedEmail),
      "true"
    );
    setAlbum({
      ...album,
      subscribers: album.subscribers.filter(
        (subscriberEmail) => subscriberEmail !== normalizedEmail
      ),
      updatedAt: new Date().toISOString(),
    });
    setInviteStatus(`${normalizedEmail} was removed from this album.`);
    setGeneratedInviteUrl("");
  };

  const emptyMessage = useMemo(() => {
    if (!isLoaded) {
      return "Loading album access...";
    }

    if (!signedInUser) {
      return pendingInvite
        ? "Sign in to subscribe to this invite."
        : `Sign in as ${DEFAULT_ALBUM_OWNER_EMAIL} or with an invited account.`;
    }

    if (!isDefaultAlbumOwner && !pendingInvite) {
      return `This private album is only visible to ${DEFAULT_ALBUM_OWNER_EMAIL} and invited subscribers.`;
    }

    if (pendingInvite && signedInEmail !== pendingInvite.invitedEmail) {
      return "This invite is not for the signed-in account.";
    }

    if (pendingInvite) {
      return "Subscribe to make this album available.";
    }

    return "You are not subscribed to an album yet.";
  }, [isDefaultAlbumOwner, isLoaded, pendingInvite, signedInEmail, signedInUser]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p>Album</p>
          <strong>Shareable gallery</strong>
        </div>

        {signedInUser ? (
          <div className="user-button">
            <UserButton />
          </div>
        ) : null}
      </header>

      {pendingInvite ? (
        <div className="shared-strip">
          <span>Invite for {pendingInvite.invitedEmail}</span>
          <button type="button" onClick={handleClearInvite}>
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="workspace">
        {visibleAlbum ? (
          <AlbumPreview
            album={visibleAlbum}
            showSubscribers={isDefaultAlbumOwner}
          />
        ) : (
          <NoAlbumAvailable message={emptyMessage} />
        )}

        {!isLoaded || !signedInUser ? (
          <AuthPanel />
        ) : shouldShowInviteGate && pendingInvite ? (
          <SubscribePanel
            invite={pendingInvite}
            signedInEmail={signedInEmail}
            onSubscribe={handleSubscribe}
            onClearInvite={handleClearInvite}
          />
        ) : activeSubscribedAlbum ? (
          <SubscriptionPanel
            album={activeSubscribedAlbum}
            onReturnToOwnAlbum={handleReturnToOwnAlbum}
          />
        ) : canEdit && album ? (
          <AlbumEditor
            album={album}
            onGenerateInvite={handleGenerateInvite}
            onRemoveSubscriber={handleRemoveSubscriber}
            inviteStatus={inviteStatus}
            generatedInviteUrl={generatedInviteUrl}
          />
        ) : (
          <AccessPanel />
        )}
      </div>
    </div>
  );
}

export default App;
