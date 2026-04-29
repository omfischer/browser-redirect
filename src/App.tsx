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

const starterAlbum: Album = {
  id: "starter-album",
  title: "North Sea light",
  description: "A small set of images ready to edit, save, and share.",
  ownerName: "Album",
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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim());
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
    album,
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

function AlbumPreview({ album }: { album: Album }) {
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
    </section>
  );
}

function AlbumEditor({
  album,
  onAlbumChange,
  onGenerateInvite,
  inviteStatus,
  generatedInviteUrl,
}: {
  album: Album;
  onAlbumChange: (album: Album) => void;
  onGenerateInvite: (email: string) => void;
  inviteStatus: string;
  generatedInviteUrl: string;
}) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const updateAlbum = (updates: Partial<Album>) => {
    onAlbumChange({
      ...album,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddPhoto = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidImageUrl(photoUrl)) {
      setPhotoError("Use a valid image URL.");
      return;
    }

    setPhotoError("");
    updateAlbum({
      photos: [
        ...album.photos,
        {
          id: createId(),
          url: photoUrl.trim(),
        },
      ],
    });
    setPhotoUrl("");
  };

  const handleRemovePhoto = (id: string) => {
    updateAlbum({
      photos: album.photos.filter((photo) => photo.id !== id),
    });
  };

  const handleGenerateInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onGenerateInvite(inviteEmail);
  };

  return (
    <aside className="workspace-panel" aria-label="Album editor">
      <div className="panel-heading">
        <p>Album</p>
      </div>

      <label>
        Title
        <input
          value={album.title}
          onChange={(event) => updateAlbum({ title: event.target.value })}
          placeholder="Album title"
        />
      </label>

      <label>
        Description
        <textarea
          value={album.description}
          onChange={(event) => updateAlbum({ description: event.target.value })}
          placeholder="A short note for people you share with"
          rows={3}
        />
      </label>

      <form className="photo-form" onSubmit={handleAddPhoto}>
        <label>
          Image URL
          <input
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            placeholder="https://..."
          />
        </label>

        {photoError ? <div className="error-line">{photoError}</div> : null}

        <button type="submit" className="primary-button">
          Add photo
        </button>
      </form>

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

      <div className="photo-list">
        {album.photos.map((photo, index) => (
          <div className="photo-row" key={photo.id}>
            <img src={photo.url} alt="" />
            <div>
              <strong>{`Photo ${index + 1}`}</strong>
              <span>{new URL(photo.url).hostname}</span>
            </div>
            <button type="button" onClick={() => handleRemovePhoto(photo.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
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
  const canSubscribe = signedInEmail === invite.invitedEmail;

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
        <div className="error-line">
          Sign in as {invite.invitedEmail} to subscribe to this album.
        </div>
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

  const subscribedToPendingInvite =
    Boolean(pendingInvite) && subscribedAlbum?.id === pendingInvite?.album.id;
  const shouldShowInviteGate = Boolean(pendingInvite) && !subscribedToPendingInvite;
  const visibleAlbum = shouldShowInviteGate ? null : subscribedAlbum ?? album;
  const canEdit = isLoaded && Boolean(signedInUser);

  useEffect(() => {
    if (!isLoaded || !signedInUser) {
      queueMicrotask(() => {
        setLoadedUserId(null);
        setAlbum(null);
        setSubscribedAlbum(null);
      });
      return;
    }

    const ownedAlbumStorageKey = getOwnedAlbumStorageKey(signedInUser);
    const storedAlbum = localStorage.getItem(ownedAlbumStorageKey);
    let normalizedAlbum: Album | null = null;

    if (storedAlbum) {
      try {
        normalizedAlbum = normalizeAlbum(JSON.parse(storedAlbum));
      } catch {
        localStorage.removeItem(ownedAlbumStorageKey);
      }
    }

    const subscriptionStorageKey = getSubscriptionStorageKey(signedInUser);
    const storedSubscription = localStorage.getItem(subscriptionStorageKey);
    let normalizedSubscription: Album | null = null;

    if (storedSubscription) {
      try {
        normalizedSubscription = normalizeAlbum(JSON.parse(storedSubscription));
      } catch {
        localStorage.removeItem(subscriptionStorageKey);
      }
    }

    queueMicrotask(() => {
      setAlbum(
        normalizedAlbum ?? {
          ...starterAlbum,
          id: `album-${signedInUser.id}`,
          ownerName: displayName,
          ownerEmail: signedInEmail,
          ownerId: signedInUser.id,
          updatedAt: new Date().toISOString(),
        }
      );
      setSubscribedAlbum(normalizedSubscription);
      setLoadedUserId(signedInUser.id);
    });
  }, [displayName, isLoaded, signedInEmail, signedInUser]);

  useEffect(() => {
    if (!album || !signedInUser || loadedUserId !== signedInUser.id) {
      return;
    }

    localStorage.setItem(getOwnedAlbumStorageKey(signedInUser), JSON.stringify(album));
  }, [album, loadedUserId, signedInUser]);

  useEffect(() => {
    const handleHashChange = () => {
      setPendingInvite(getInviteFromHash());
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleGenerateInvite = (email: string) => {
    if (!album) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setInviteStatus("Enter a valid email address.");
      setGeneratedInviteUrl("");
      return;
    }

    const inviteUrl = makeInviteUrl(album, normalizedEmail);
    setGeneratedInviteUrl(inviteUrl);
    setInviteStatus("Invite link generated. Send it manually to the subscriber.");
  };

  const handleSubscribe = () => {
    if (!pendingInvite || !signedInUser || signedInEmail !== pendingInvite.invitedEmail) {
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

  const emptyMessage = useMemo(() => {
    if (!isLoaded) {
      return "Loading album access...";
    }

    if (!signedInUser) {
      return pendingInvite
        ? "Sign in to subscribe to this invite."
        : "Sign in with an invited account to view an album.";
    }

    if (pendingInvite && signedInEmail !== pendingInvite.invitedEmail) {
      return "This invite is not for the signed-in account.";
    }

    if (pendingInvite) {
      return "Subscribe to make this album available.";
    }

    return "You are not subscribed to an album yet.";
  }, [isLoaded, pendingInvite, signedInEmail, signedInUser]);

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
          <AlbumPreview album={visibleAlbum} />
        ) : (
          <NoAlbumAvailable message={emptyMessage} />
        )}

        {!canEdit ? (
          <AuthPanel />
        ) : shouldShowInviteGate && pendingInvite ? (
          <SubscribePanel
            invite={pendingInvite}
            signedInEmail={signedInEmail}
            onSubscribe={handleSubscribe}
            onClearInvite={handleClearInvite}
          />
        ) : subscribedAlbum ? (
          <SubscriptionPanel
            album={subscribedAlbum}
            onReturnToOwnAlbum={handleReturnToOwnAlbum}
          />
        ) : album ? (
          <AlbumEditor
            album={album}
            onAlbumChange={setAlbum}
            onGenerateInvite={handleGenerateInvite}
            inviteStatus={inviteStatus}
            generatedInviteUrl={generatedInviteUrl}
          />
        ) : (
          <AuthPanel />
        )}
      </div>
    </div>
  );
}

export default App;
