import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'
import { useState } from "react";

export const useInAppBrowser = () => {
  const userAgent = navigator.userAgent || navigator.vendor;

  const isInAppBrowser = /Instagram|FBAN|FBAV|Messenger|Line|Snapchat|Twitter|WeChat|TikTok/.test(userAgent);

  // const shareLink = 'jottacloud.com/share/3gp6ac5asmf5' // TODO: use query param
  const shareLink = 'browser-redirect-git-main-omfischers-projects.vercel.app/' // TODO: use query param
  const iOSLink = `x-safari-https://${shareLink}?source=ios_redirect`
  const androidLink = `intent://${shareLink}#Intent;scheme=https;action=android.intent.action.VIEW;end`
  const fallbackLink = `https://${shareLink}`

  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window);
  const redirectUrl = isIOS ? iOSLink : isAndroid ? androidLink : fallbackLink;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isIOSRedirect = urlParams.get('source') === 'ios_redirect';

    if (isIOSRedirect) {
      window.location.replace('https://www.jottacloud.com/share/3gp6ac5asmf5');
    }

    if (isInAppBrowser) {
      window.location.href = redirectUrl;
    }
  }, []);

  return null;
};


export const useImageShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareImages = async (imageUrls: string[]) => {
    setIsSharing(true);
    setError(null);

    try {
      const files = await Promise.all(
        imageUrls.map(async (url, index) => {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch image ${index + 1}`);
          const blob = await response.blob();
          return new File([blob], `image${index + 1}.jpg`, { type: blob.type });
        })
      );

      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({
          files,
          title: "Save Images",
          text: "Download these images to your Photos app!"
        });
      } else {
        throw new Error("Sharing multiple files is not supported on this browser.");
      }
    } catch (err) {
      setError((err as Error).message);
      console.error("Error sharing images:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return { shareImages, isSharing, error };
};


function App() {
  const navigatorProps = {}
  for (const prop in window.navigator) {
    // @ts-ignore
    navigatorProps[prop] = window.navigator[prop]
  }

  useInAppBrowser();
  return (
    <>
      <h1>Navigator</h1>
      <pre>{JSON.stringify(navigatorProps, undefined, 2)}</pre>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="flex flex-col gap-2">

        <a href="https://www.jottacloud.com/share/3gp6ac5asmf5">
          gå til appen
        </a>
      </div>
    </>
  )
}

export default App
