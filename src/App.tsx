import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'

const useInAppBrowser = () => {
  const userAgent = navigator.userAgent || navigator.vendor;

  const isInAppBrowser = /Instagram|FBAN|FBAV|Messenger|Line|Snapchat|Twitter|WeChat|TikTok/.test(userAgent);

  const shareLink = 'www.jottacloud.com/share/3gp6ac5asmf5' // TODO: use query param
  const iOSLink = `x-safari-https://${shareLink}`
  const androidLink = `intent://${shareLink}#Intent;scheme=https;action=android.intent.action.VIEW;end`
  const fallbackLink = `https://${shareLink}`

  return { isInAppBrowser, iOSLink, androidLink, fallbackLink };
};

function App() {
  // Add URL params check
  // const urlParams = new URLSearchParams(window.location.search);
  // const tryNativeBrowser = urlParams.get('openInNative') === 'true';
  const { isInAppBrowser, iOSLink, androidLink, fallbackLink } = useInAppBrowser();

  // const getPlatform = () => {

  //   if (/iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window)) {
  //     return 'ios';
  //   }
  //   if (/android/i.test(userAgent)) {
  //     return 'android';
  //   }
  //   return 'other';
  // };

  useEffect(() => {

    if (isInAppBrowser) {
      window.location.href = iOSLink; // Forces Safari to open
    }
  }, []);

  // return null; // No UI, just redirects

  // useEffect(() => {

  //   if (isInAppBrowser() === 'Facebook or Messenger') {
  //     window.open(iOSLink, '_blank');
  //   } else {
  //     window.location.href = fallbackLink;
  //   }
  // }, []);




  // // Update useEffect for automatic redirect
  // useEffect(() => {
  //   const targetLink = (() => {
  //     if (tryNativeBrowser) {
  //       // If we're trying to break out to native browser
  //       switch (getPlatform()) {
  //         case 'ios':
  //           return iOSLink;
  //         case 'android':
  //           return androidLink;
  //         default:
  //           return fallbackLink;
  //       }
  //     }
  //     // First attempt always uses the fallback link
  //     return fallbackLink;
  //   })();

  // Add timeout to ensure the UI is rendered before redirect
  //   setTimeout(() => {
  //     window.location.href = targetLink;
  //   }, 100);
  // }, [tryNativeBrowser]);

  // Update the link generation for manual clicks
  const link = (() => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('openInNative', 'true');
    return currentUrl.toString();
  })();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="flex flex-col gap-2">
        <a href={link} target="_blank" className="block">
          1: Device agnostisk
        </a>
        <br />
        <a href={iOSLink} target="_blank" className="block">
          2: hva skjer med denne? iOs prefix
        </a>
        <br />
        <a href={androidLink} target="_blank" className="block">
          3: hva skjer med denne? Android prefix
        </a>
        <br />
        <a href={fallbackLink}>
          4: hva skjer med denne? Standard link
        </a>
      </div>

      {/* Test mobilesafari prefix:
      start med redirect til samme location, men med et query param
      hvis query param er x-safari, så skal den redirect til samme location, men med x-safari prefix
      */}
    </>
  )
}

export default App
