import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 24;

const App = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg("");
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      setErrorMsg("Error fetching images. Try again later.");
      console.log("Error Message:", error.message);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchInput.current.value);
    resetSearch();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  return (
    <div className="container">
      <h1 className="title">Image Search</h1>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <div className="search-section">
        <form action="" onSubmit={handleSearch}>
          <input
            type="search"
            className="search-input"
            placeholder="Type something to search..."
            ref={searchInput}
          ></input>
        </form>
      </div>
      <div className="filters">
        <div onClick={() => handleSelection("nature")}>Nature</div>
        <div onClick={() => handleSelection("birds")}>Birds</div>
        <div onClick={() => handleSelection("cars")}>Cars</div>
        <div onClick={() => handleSelection("dogs")}>Dogs</div>
      </div>

      <div className="images">
        {images.map((image) => {
          return (
            <img
              src={image.urls.small}
              key={image.id}
              alt={image.alt_description}
              className="image"
            />
          );
        })}
      </div>

      <div className="buttons">
        {page > 1 && (
          <button
            type="button"
            className="btn"
            onClick={() => setPage(page - 1)}
          >
            Previous{" "}
          </button>
        )}
        {page < totalPages && (
          <button
            type="button"
            className="btn"
            onClick={() => setPage(page + 1)}
          >
            Next{" "}
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
