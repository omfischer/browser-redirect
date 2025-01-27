import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react'

function App() {
  const shareLink = 'www.jottacloud.com/share/3gp6ac5asmf5' // TODO: use query param
  const iOSLink = `x-safari-https://${shareLink}`
  const androidLink = `intent://${shareLink}#Intent;scheme=https;action=android.intent.action.VIEW;end`
  const falbackLink = `https://${shareLink}`

  const userAgent = navigator.userAgent || navigator.vendor;
  const getPlatform = () => {

    if (/iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window)) {
      return 'ios';
    }
    if (/android/i.test(userAgent)) {
      return 'android';
    }
    return 'other';
  };

  const isInAppBrowser = () => {
    // Detect Instagram
    if (/Instagram/.test(userAgent)) return 'Instagram';

    // Detect Facebook or Messenger
    if (/FBAN|FBAV|Messenger/.test(userAgent)) return 'Facebook or Messenger';

    // Detect other common in-app browsers (customize as needed)
    if (/Line|Snapchat|Twitter|WeChat|TikTok/.test(userAgent)) return 'Other In-App Browser';

    return 'Default Browser';
  };

  const link = (() => {
    switch (getPlatform()) {
      case 'ios':
        return iOSLink;
      case 'android':
        return androidLink;
      default:
        return falbackLink;
    }
  })();

  // Add useEffect for automatic redirect
  React.useEffect(() => {
    const targetLink = (() => {
      switch (getPlatform()) {
        case 'ios':
          return iOSLink;
        case 'android':
          return androidLink;
        default:
          return falbackLink;
      }
    })();

    window.location.href = targetLink;
  }, []);

  return (
    <>
      <div>
        <p>Hi Jan! You are using {isInAppBrowser()}</p>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>
        This is the {isInAppBrowser()}
      </p>
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
        <a href={falbackLink} target="_blank" className="block">
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
