import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./SearchBar.module.css";

function SearchBar({ onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/filtered/all?search=${encodeURIComponent(query)}`);

    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <button
          type="button"
          onClick={handleSearch}
          className={styles.searchButton}
          aria-label="Search"
        >
          <FiSearch />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;