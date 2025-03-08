import { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ setUsers, setLoading, setTotalPages }) => {
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setLoading(true);

      const filters = search ? [{ key: "name", op: "contains", value: search }] : [];

      axios
        .post(
          "http://localhost:5000/api/users",
          { filters }, // Ensure this matches your API's expected format
          { params: { page: 1, per_page: 10, sort_by: "name", order: "asc" } }
        )
        .then((res) => {
          setUsers(res.data.data);
          setTotalPages(res.data.pagination.total_pages);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
        })
        .finally(() => {
          setLoading(false);
        });

    }, 500); // 500ms debounce time

    return () => clearTimeout(delayDebounce); // Cleanup function to cancel previous API calls
  }, [search, setUsers, setLoading, setTotalPages]); // Dependencies

  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
