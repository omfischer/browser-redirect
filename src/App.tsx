import reactLogo from "./assets/react.svg";
import "./App.css";
// import { useEffect, useState } from "react";

// ✅ In-App Browser Detection & Redirection Hook
// export const useInAppBrowser = () => {
//   useEffect(() => {
//     const userAgent = navigator.userAgent || navigator.vendor;
//     const isInAppBrowser =
//       /Instagram|FBAN|FBAV|Messenger|Line|Snapchat|Twitter|WeChat|TikTok/.test(
//         userAgent
//       );

//     const shareLink =
//       "browser-redirect-git-main-omfischers-projects.vercel.app/";
//     const iOSLink = `x-safari-https://${shareLink}?source=ios_redirect`;
//     const androidLink = `intent://${shareLink}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
//     const fallbackLink = `https://${shareLink}`;

//     const isAndroid = /android/i.test(userAgent);
//     const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window);
//     const redirectUrl = isIOS ? iOSLink : isAndroid ? androidLink : fallbackLink;

//     const urlParams = new URLSearchParams(window.location.search);
//     const isIOSRedirect = urlParams.get("source") === "ios_redirect";

//     if (isIOSRedirect) {
//       window.location.href = "jotta://files/share/3gp6ac5asmf5"
//     } else if (isInAppBrowser) {
//       window.location.href = redirectUrl;
//     }
//   }, []);

//   return null;
// };

// // ✅ Image Sharing Hook with Improved Handling
// export const useImageShare = () => {
//   const [isSharing, setIsSharing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const shareImages = async (imageUrls: string[]) => {
//     setIsSharing(true);
//     setError(null);

//     try {
//       const baseUrl = window.location.origin; // Ensure full URLs
//       const files = await Promise.all(
//         imageUrls.map(async (url, index) => {
//           const fullUrl = url.startsWith("/")
//             ? `${baseUrl}${url}`
//             : url;

//           const response = await fetch(fullUrl, { mode: "cors" });
//           if (!response.ok)
//             throw new Error(`Failed to fetch image ${index + 1}`);

//           const blob = await response.blob();
//           return new File([blob], `image${index + 1}.jpg`, {
//             type: blob.type,
//           });
//         })
//       );

//       if (navigator.canShare && navigator.canShare({ files })) {
//         await navigator.share({
//           files,
//           title: "Save Images",
//           text: "Download these images to your Photos app!",
//         });
//       } else {
//         throw new Error("Sharing multiple files is not supported on this browser.");
//       }
//     } catch (err) {
//       setError((err as Error).message);
//       console.error("Error sharing images:", err);
//     } finally {
//       setIsSharing(false);
//     }
//   };

//   return { shareImages, isSharing, error };
// };

// ✅ Image Share Button Component
// const ImageShareButton = () => {
//   const { shareImages, isSharing, error } = useImageShare();

//   const handleShare = () => {
//     shareImages([
//       "/images/image1.jpg",
//       "/images/image2.jpg",
//       "/images/image3.jpg",
//     ]);
//   };

//   return (
//     <div>
//       <button onClick={handleShare} disabled={isSharing}>
//         {isSharing ? "Sharing..." : "Share Images"}
//       </button>
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//     </div>
//   );
// };

// ✅ Main App Component
function App() {
  const handleCopy = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevents default anchor behavior
    const textToCopy = 'Text to be copied';

    // Use the Clipboard API if available
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log('Copied to clipboard successfully!');
        // Optionally, display a success message to the user
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        // Optionally, handle the error (e.g., show an error message)
      });
  };

  return (
    <>
      {/* <ImageShareButton /> */}

      <div>
        <a href="#" onClick={handleCopy}>
          Click to copy
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <a href="https://www.jottacloud.com/share/3gp6ac5asmf5">
          Gå til appen
        </a>
      </div>
    </>
  );
}

export default App;