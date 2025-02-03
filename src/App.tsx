import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'

export const useInAppBrowser = () => {
  const userAgent = navigator.userAgent || navigator.vendor;

  const isInAppBrowser = /Instagram|FBAN|FBAV|Messenger|Line|Snapchat|Twitter|WeChat|TikTok/.test(userAgent);

  // const shareLink = 'www.jottacloud.com/share/3gp6ac5asmf5' // TODO: use query param
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

export const useInAppBrowserBreakout = () => {

  useEffect(() => {

    const userAgent = navigator.userAgent || navigator.vendor
    const isAndroid = /android/i.test(userAgent)
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window)

    if (isIOS) {
      const url = new URL(window.location.href)
      const isInAppBrowser =
        /Instagram|FBAN|FBAV|Messenger|Line|Snapchat|Twitter|WeChat|TikTok/.test(
          userAgent,
        )
      const action = url.searchParams.get('action')
      if (!action && isInAppBrowser) {
        url.protocol = 'x-safari-https'
        url.searchParams.set('action', 'ios-breakout')
        window.location.href = url.toString()
      } else if (!action || action === 'ios-breakout') {
        url.searchParams.set('action', 'ios-replace')
        window.location.replace(url) // Should open app if installed
      }
    } else if (isAndroid) {
      const androidLink = new URL(window.location.href)
      androidLink.protocol = 'intent'
      androidLink.hash =
        'Intent;scheme=https;action=android.intent.action.VIEW;end'
      window.location.href = androidLink.toString()
    }
  }, [])
}

function App() {
  useInAppBrowser();
  // useInAppBrowserBreakout();
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

        <a href="https://www.jottacloud.com/share/3gp6ac5asmf5">
          gå til appen
        </a>
      </div>
    </>
  )
}

export default App
