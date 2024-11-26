import React, { useState } from "react";
import { FaSpotify } from "react-icons/fa6";
import axios from "axios";

function App() {
  const [URL, setURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleURL = (e) => {
    e.preventDefault();
    setURL(e.target.value);
    setStatus("");
  };

  const downloadSong = async (e) => {
    e.preventDefault();

    if (!URL) {
      setStatus("Please enter a valid Spotify URL.");
      return;
    }

    setLoading(true);
    setStatus("Download Started...");

    const options = {
      method: "GET",
      url: "https://spotify-downloader9.p.rapidapi.com/downloadSong",
      params: { songId: `${URL}` },
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_API_KEY,
        "x-rapidapi-host": "spotify-downloader9.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.request(options);
      const downloadLink = response.data?.data?.downloadLink;

      if (downloadLink) {
        setStatus("Download Successful!");
        setTimeout(() => setStatus(""), 3000); // Clear success message after 3 seconds
        setURL(""); // Clear the input box
        window.location.href = downloadLink; // Start the download
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      setStatus("Failed to download. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-black flex flex-col items-center justify-center relative">
      {/* Spotify Icon and Title */}
      <div className="absolute top-10 flex items-center gap-3">
        <div className="animate-bounce">
          <FaSpotify size={60} className="text-green-500" />
        </div>
        <h1 className="text-xl font-bold text-white">Spotify</h1>
      </div>

      {/* Main Box */}
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative">
        <h2 className="text-center text-lg font-semibold text-gray-600 mb-6">
          Enter the URL of Spotify
        </h2>
        <form className="flex flex-col gap-4" onSubmit={downloadSong}>
          <input
            type="url"
            placeholder="Paste Spotify song URL here..."
            className="h-12 px-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            onChange={handleURL}
            value={URL}
          />
          <button
            type="submit"
            className={`h-12 px-6 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Download"}
          </button>
        </form>

        {/* Status Messages */}
        {status && (
          <p
            className={`mt-4 text-center font-semibold ${
              status.includes("Successful")
                ? "text-green-600"
                : status.includes("Started")
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 text-center text-gray-400">
        Built with by Anukalp Pandey
      </footer>
    </div>
  );
}

export default App;
