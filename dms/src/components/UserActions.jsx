import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical, BsPlusCircle, BsPencil, BsTrash } from "react-icons/bs";
import axios from "axios";
import "./UserActions.css";

const UserActions = ({ user, onEdit, onDelete, onAdd }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditUser = () => {
    if (onEdit) {
      // Here you might open a modal to edit the user
      // For now, let's just simulate updating the user
      const updatedUser = { ...user, name: user.name + " (Updated)" };
      onEdit(updatedUser);
    } else {
      console.log("Edit user:", user.id);
    }
    setShowDropdown(false);
  };

  const handleDeleteUser = () => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      if (onDelete) {
        // Call the parent's onDelete function to update local state
        onDelete(user.id);
        
        // Optionally, still call API to delete from backend
        axios.delete(`http://localhost:5000/api/users/${user.id}`)
          .then(() => {
            console.log("User deleted from backend");
          })
          .catch(err => {
            console.error("Error deleting user from backend:", err);
          });
      } else {
        console.log("Delete user functionality not implemented");
      }
    }
    setShowDropdown(false);
  };

  const handleAddUser = () => {
    if (onAdd) {
      // Here you might open a modal to add a new user
      // For now, let's just simulate adding a user
      const newUser = {
        id: Math.floor(Math.random() * 10000),
        name: "New User",
        email: "newuser@example.com",
        department: "New Department",
        position: "New Position"
      };
      onAdd(newUser);
    } else {
      console.log("Add user functionality not implemented");
    }
    setShowDropdown(false);
  };

  return (
    <div className="user-actions-container" ref={dropdownRef}>
      <button 
        className="action-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <BsThreeDotsVertical />
      </button>
      
      {showDropdown && (
        <div className="actions-dropdown">
          {!user && (
            <button className="dropdown-item" onClick={handleAddUser}>
              <BsPlusCircle /> Add User
            </button>
          )}
          {user && (
            <>
              <button className="dropdown-item" onClick={handleEditUser}>
                <BsPencil /> Edit
              </button>
              <button className="dropdown-item delete-action" onClick={handleDeleteUser}>
                <BsTrash /> Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserActions;