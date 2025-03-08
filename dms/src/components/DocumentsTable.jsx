import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import DocumentForm from "./DocumentForm"; // Import the form
import "./DocumentsTable.css";

const DocumentsTable = ({ onSave, onDelete }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState("asc");
  const [activeDropdown, setActiveDropdown] = useState(null);

  // New state to control form visibility
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Dummy document data
    const dummyData = [
      { id: 1, title: "Project Plan", owner: "Alice", category: "Business", created_at: "2025-02-01", status: "Draft" },
      { id: 2, title: "Design Document", owner: "Bob", category: "Engineering", created_at: "2025-01-15", status: "Published" },
      { id: 3, title: "Financial Report", owner: "Charlie", category: "Finance", created_at: "2024-12-20", status: "Archived" },
      { id: 4, title: "Marketing Strategy", owner: "David", category: "Marketing", created_at: "2025-02-10", status: "Draft" },
      { id: 5, title: "Security Guidelines", owner: "Eve", category: "IT", created_at: "2025-01-25", status: "Published" },
    ];

    // Apply search filter
    let filteredData = dummyData.filter(
      (doc) =>
        doc.title.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter ? doc.status === statusFilter : true)
    );

    // Sorting logic
    filteredData.sort((a, b) => {
      if (order === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

    // Simulate pagination
    const perPage = 3;
    setTotalPages(Math.ceil(filteredData.length / perPage));
    const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage);

    setDocuments(paginatedData);
    setLoading(false);
  }, [search, statusFilter, page, sortBy, order]);

  // Toggle dropdown menu
  const toggleDropdown = (docId) => {
    setActiveDropdown(activeDropdown === docId ? null : docId);
  };

  // Open form for editing
  const handleEdit = (document) => {
    setCurrentDocument(document);
    setIsFormOpen(true);
  };

  // Open form for creating a new document
  const handleCreate = () => {
    setCurrentDocument(null); // No existing data
    setIsFormOpen(true);
  };

  // Handle form save
  const handleSave = (newDocument) => {
    if (currentDocument) {
      // Update existing document
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => (doc.id === newDocument.id ? newDocument : doc))
      );
    } else {
      // Add new document
      setDocuments((prevDocs) => [...prevDocs, { ...newDocument, id: prevDocs.length + 1 }]);
    }
    setIsFormOpen(false);
  };

  // Handle form cancel
  const handleCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="documents-table-container">
      {isFormOpen ? (
        <DocumentForm documentData={currentDocument} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <>
          {/* Header Section */}
          <div className="documents-table-header">
            <h2 className="text-xl font-semibold">Documents List</h2>
            <button className="create-btn" onClick={handleCreate}>+ Create Document</button>
          </div>

          {/* Search and Filters */}
          <div className="table-controls">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Table */}
          <table className="documents-table">
            <thead>
              <tr>
                <th onClick={() => setSortBy("title")}>
                  Title {sortBy === "title" ? (order === "asc" ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => setSortBy("owner")}>
                  Owner {sortBy === "owner" ? (order === "asc" ? "↑" : "↓") : ""}
                </th>
                <th>Category</th>
                <th onClick={() => setSortBy("created_at")}>
                  Created {sortBy === "created_at" ? (order === "asc" ? "↑" : "↓") : ""}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="loading">Loading...</td></tr>
              ) : documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.title}</td>
                    <td>{doc.owner}</td>
                    <td>{doc.category}</td>
                    <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td>{doc.status}</td>
                    <td className="actions">
                      <div className="dropdown-container">
                        <BsThreeDotsVertical
                          className="dropdown-icon"
                          onClick={() => toggleDropdown(doc.id)}
                        />
                        {activeDropdown === doc.id && (
                          <div className="dropdown-menu">
                            <button onClick={() => handleEdit(doc)}>Edit</button>
                            <button onClick={() => onDelete(doc)}>Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="no-documents">No documents found</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="pagination-btn"
            >
              Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentsTable;
