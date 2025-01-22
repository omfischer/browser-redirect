import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const isInAppBrowser = () => {
    const userAgent = navigator.userAgent || navigator.vendor;

    // Detect Instagram
    if (/Instagram/.test(userAgent)) return 'Instagram';

    // Detect Facebook or Messenger
    if (/FBAN|FBAV|Messenger/.test(userAgent)) return 'Facebook or Messenger';

    // Detect other common in-app browsers (customize as needed)
    if (/Line|Snapchat|Twitter|WeChat|TikTok/.test(userAgent)) return 'Other In-App Browser';

    return 'Default Browser';
  };

  console.log(isInAppBrowser());

  return (
    <>
      <div>
        <p>yay... you are using {isInAppBrowser()}</p>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
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
      <a href="https://www.jottacloud.com/share/3gp6ac5asmf5" target="_blank">Open in Safari</a>

      Test mobilesafari prefix:
      <a href="com-apple-mobilesafari-tab:https://www.jottacloud.com/share/3gp6ac5asmf5" target="_blank">Open in Safari</a>
      {/* <a href="javascript:window.location='https://www.jottacloud.com/share/3gp6ac5asmf5'">Open in Safari</a > */}
    </>
  )
}

export default App
