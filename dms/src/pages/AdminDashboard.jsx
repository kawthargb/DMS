import { useState, useEffect } from "react";
import UsersTable from "../components/UsersTable";
import FilterButton from "../components/FilterButton";
import ActionsButton from "../components/UserActions";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtering users by search query, department, and position
  const filteredUsers = users.filter((user) => 
    (!departmentFilter || user.department === departmentFilter) &&
    (!positionFilter || user.position === positionFilter) &&
    (!searchQuery || user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="admin-dashboard">
      <div className="navbar">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <FilterButton 
          setDepartmentFilter={setDepartmentFilter} 
          setPositionFilter={setPositionFilter} 
        />
      </div>

      {/* Actions Button */}
      <ActionsButton 
        onEditUser={() => console.log("Edit User clicked")} 
        onAddUser={() => console.log("Add User clicked")} 
        onDeleteUser={() => console.log("Delete User clicked", selectedUsers)} 
      />

      {/* Users Table */}
      {loading ? <p>Loading users...</p> : <UsersTable 
  users={filteredUsers} 
  onSelectUser={setSelectedUsers} 
  searchQuery={searchQuery} // Pass search query to UsersTable
/>}
    </div>
  );
};

export default AdminDashboard;
