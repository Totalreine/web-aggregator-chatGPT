import "./App.css";
import React, { useState } from "react";

const App = () => {
  const [url, setURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setURL("");
    sendURL();
  };

  async function sendURL() {
    try {
      const request = await fetch("http://localhost:8080/api/url", {
        method: "POST",
        body: JSON.stringify({
          url,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await request.json();
      if (data.message) {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="home">
      <form className="home__form">
        <h2>Website Aggregator</h2>
        <label htmlFor="url">Provide the website URL</label>
        <input
          type="url"
          name="url"
          id="url"
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
        <button onClick={handleSubmit}>ADD WEBSITE</button>
      </form>
    </div>
  );
};

export default App;
