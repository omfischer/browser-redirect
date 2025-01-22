const OpenInBrowser = () => {
  const handleOpenInNewTab = () => {
    const bridgeUrl = '/bridge-page.html'; // Path to your bridge page
    const newTab = window.open(bridgeUrl, '_blank', 'noopener,noreferrer');

    if (!newTab) {
      alert('Unable to open the link. Please manually open it in your browser.');
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