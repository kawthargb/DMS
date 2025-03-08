import DocumentsTable from "../components/DocumentsTable";
import "./UserDashboard.css"; // Import the CSS file

const UserDashboard = () => {
  // Functions for handling actions
  const handleEdit = (document) => {
    console.log("Editing:", document);
  };

  const handleDelete = (document) => {
    console.log("Deleting:", document);
  };

  const handleView = (document) => {
    console.log("Viewing:", document);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1>User Dashboard</h1>
       
      </nav>

      {/* Content Section */}
      <div className="p-6">
        <DocumentsTable onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
      </div>
    </div>
  );
};

export default UserDashboard;
