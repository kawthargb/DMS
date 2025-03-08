import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import "./UsersTable.css";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi"; 

const UsersTable = ({ 
  onSelectUser, 
  onCreateSingle, 
  onImportFile, 
  onEditUser = (user) => console.log("Default edit:", user) 
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    lastName: false,
    city: false,
    state: false,
    dob: false,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    position: "",
    department: ""
  });

  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch users from the API
  useEffect(() => {
    setLoading(true);

    axios
      .get("http://localhost:5000/api/users", {
        params: { page, per_page: 10, sort_by: sortBy, order },
      })
      .then((res) => {
        setUsers(res.data.data);
        setTotalPages(res.data.pagination.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, [search, statusFilter, page, sortBy, order]);

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) => {
      const newSelected = prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId];

      onSelectUser(newSelected);
      return newSelected;
    });
  };

  // Open edit modal with user data
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      position: user.position || "",
      department: user.department || ""
    });
    setShowEditModal(true);
  };

  // Handle input changes in the edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for editing user
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedUser = {
        ...editingUser,
        name: editFormData.name,
        email: editFormData.email,
        position: editFormData.position,
        department: editFormData.department
      };

      const response = await axios.put(
        `http://localhost:5000/api/users/${editingUser.id}`, 
        updatedUser
      );

      if (response.status === 200) {
        setUsers(prevUsers =>
          prevUsers.map(user => 
            user.id === editingUser.id ? { ...user, ...updatedUser } : user
          )
        );

        if (typeof onEditUser === "function") {
          onEditUser(updatedUser);
        }

        setShowEditModal(false);
      } else {
        console.error("Error updating user:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle Delete functionality
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Close dropdown and modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      if (showEditModal && modalRef.current && !modalRef.current.contains(event.target)) {
        setShowEditModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEditModal]);

  return (
    <div className="users-table-container">
      {/* Header Section */}
      <div className="users-table-header">
        <h2 className="text-xl font-semibold">Users List</h2>
      </div>

      {/* Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Select</th>
            <th onClick={() => setSortBy("name")}>
              Name {sortBy === "name" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            {visibleColumns.lastName && <th>Last Name</th>}
            <th onClick={() => setSortBy("email")}>
              Email {sortBy === "email" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            {visibleColumns.city && <th>City</th>}
            {visibleColumns.state && <th>State</th>}
            <th>Department</th>
            <th>Position</th>
            {visibleColumns.dob && <th>Date of Birth</th>}
            <th>Actions</th>
            <th className="dropdown-header">
              <div ref={dropdownRef}>
                <BsThreeDotsVertical
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="dots-icon"
                />
                {showDropdown && (
                  <div className="dropdown-menu">
                    <label>
                      <input type="checkbox" onChange={() => toggleColumn("lastName")} /> Last Name
                    </label>
                    <label>
                      <input type="checkbox" onChange={() => toggleColumn("city")} /> City
                    </label>
                    <label>
                      <input type="checkbox" onChange={() => toggleColumn("state")} /> State
                    </label>
                    <label>
                      <input type="checkbox" onChange={() => toggleColumn("dob")} /> Date of Birth
                    </label>
                  </div>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className="loading">Loading...</td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                {visibleColumns.lastName && <td>{user.lastName || "-"}</td>}
                <td>{user.email}</td>
                {visibleColumns.city && <td>{user.city || "-"}</td>}
                {visibleColumns.state && <td>{user.state || "-"}</td>}
                <td>{user.department || "-"}</td>
                <td>{user.position}</td>
                {visibleColumns.dob && <td>{user.dob || "-"}</td>}
                <td>
                  <FiEdit className="edit-icon" onClick={() => openEditModal(user)} />
                  <FiTrash2 className="delete-icon" onClick={() => handleDelete(user.id)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-users">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="pagination-btn">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="pagination-btn">Next</button>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal" ref={modalRef}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <FiX className="close-icon" onClick={() => setShowEditModal(false)} />
            </div>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={editFormData.position}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={editFormData.department}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;