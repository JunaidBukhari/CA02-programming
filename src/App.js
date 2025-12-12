import React, { useState, useEffect } from "react";
import "./App.css";

const SHEET_ID = "1wdwoWiDgu9InMSTDgNShzuVlDQjUx6Je5TgeLZhOb4Y";
const API_KEY = "AIzaSyCidNWu2iy0BdcLFvZOyrkYQDjgMse-k8I";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSheetData();
  }, []);

  const fetchSheetData = async () => {
    try {
      setLoading(true);
      setError(null);

      let url;

      url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      let result;
      let values;

      result = await response.json();
      values = result.values;

      if (values && values.length > 0) {
        const headers = values[0];
        const rows = values.slice(1);

        const formattedData = rows.map((row) => {
          const obj = {};
          headers.forEach((header, index) => {
            const key = header.toLowerCase().replace(/\s+/g, "_");
            obj[key] = row[index] || "";
          });
          return obj;
        });

        setData(formattedData);
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching sheet data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchSheetData();
  };

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">Loading data from Google Sheets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="container">
          <div className="error">
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <p className="error-hint">
              Please make sure:
              <br />
              1. Your Google Sheet is public (or you have a valid API key)
              <br />
              2. The Sheet ID is correct in App.js
              <br />
              3. The sheet name is "Sheet1"
            </p>
            <button
              onClick={handleRefresh}
              className="refresh-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>CA02 Programming - Data Viewer</h1>
          <button
            onClick={handleRefresh}
            className="refresh-btn"
          >
            Refresh
          </button>
        </header>

        {data.length === 0 ? (
          <div className="no-data">
            <p>No data found in the sheet.</p>
            <p>
              Make sure your sheet has data and the configuration is correct.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Title</th>
                  <th>Matched Para</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>
                      {row.url ? (
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="url-link"
                        >
                          Go to link
                        </a>
                      ) : (
                        <span className="empty">-</span>
                      )}
                    </td>
                    <td className="title">{row.title || <span className="empty">-</span>}</td>
                    <td className="matched-para">
                      {row.matched_para || row.matched_paragraphs || (
                        <span className="empty">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="data-count">Total rows: {data.length}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
