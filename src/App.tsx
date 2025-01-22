import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const iOSLink = 'x-safari-https://www.jottacloud.com/share/3gp6ac5asmf5'
  const androidLink = 'intent://www.jottacloud.com/share/3gp6ac5asmf5#Intent;scheme=https;action=android.intent.action.VIEW;end'
  const falbackLink = 'https://www.jottacloud.com/share/3gp6ac5asmf5'

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

  console.log(isInAppBrowser());

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
      {/* <OpenInBrowser /> */}
      {/* <button
        onClick={() => (window.location.href = "http://www.jottacloud.com/share/3gp6ac5asmf5")}
      >
        Open in Safari
      </button>
      <a href="http://www.jottacloud.com/share/3gp6ac5asmf5" target="_self" rel="noopener noreferrer">
        Open in Safari
      </a> */}
      {/* <button onClick={() => window.open('https://www.jottacloud.com/share/3gp6ac5asmf5', '_blank')}>Open in Safari</button> */}
      <div className="flex flex-col gap-2">
        <a href={link} target="_blank">1: Device agnostisk</a>
        <a href={iOSLink} target="_blank">2: hva skjer med denne? iOs prefix</a>
        <a href={androidLink} target="_blank">3: hva skjer med denne? Android prefix</a>
        <a href={falbackLink} target="_blank">4: hva skjer med denne? Standard link</a>
      </div>

      {/* Test mobilesafari prefix:
      <a href="com-apple-mobilesafari-tab:x-safari-https://www.jottacloud.com/share/3gp6ac5asmf5" target="_blank">Open in Safari</a>
      <a href="javascript:window.location='https://www.jottacloud.com/share/3gp6ac5asmf5'">Open in Safari</a > */}
    </>
  )
}

export default App
