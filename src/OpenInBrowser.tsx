const OpenInBrowser = () => {
  const handleOpenInNewTab = () => {
    const url = 'browser-redirect-git-main-omfischers-projects.vercel.app'; // Replace with your link
    const newTab = window.open(url, '_blank', 'noopener,noreferrer');

    if (!newTab) {
      alert('Unable to open the link. Please open it manually in your browser.');
    }
  };

  return (
    <div>
      <p>
        You are using an in-app browser. For the best experience, open the link in your default browser.
      </p>
      <button onClick={handleOpenInNewTab}>
        Open in Browser
      </button>
    </div>
  );
};

export default OpenInBrowser;