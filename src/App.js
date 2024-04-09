import React, { useCallback, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";

const useShortUrl = ({ url }) => {
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleShortUrl = useCallback(async () => {
    setLoading(true);
    const res = await fetch("http://localhost:4000/shorten-url", {
      method: "POST",
      body: JSON.stringify({ longUrl: url }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      setMessage(await res.text());
      return;
    }
    const { shortUrl } = (await res.json()) || {};
    if (!shortUrl) {
      setMessage("something went wrong.");
      return;
    }
    setLoading(false);
    setShortUrl(shortUrl);
  }, [url]);
  return { shortUrl, loading, message, handleShortUrl };
};

const App = () => {
  const [url, setUrl] = useState("");
  const { shortUrl, loading, message, handleShortUrl } = useShortUrl({ url });
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>
          <span>Shorten your links, lengthen your reach.</span>
        </h1>
        <div>
          <input
            type="text"
            placeholder="Paste a link to shorten it"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
          <button onClick={handleShortUrl}>Shorten</button>
        </div>
        <div>
          {loading ? (
            <p>loading</p>
          ) : (
            <>
              {shortUrl && (
                <p>
                  shortUrl:{" "}
                  <a href={shortUrl} target="_blank" rel="noreferrer">
                    {shortUrl}
                  </a>
                </p>
              )}
              {message && <p>message: {message}</p>}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
