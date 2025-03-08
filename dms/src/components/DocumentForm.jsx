import { useState, useEffect } from "react";
import "./DocumentForm.css";
const DocumentForm = ({ documentData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    owner: "",
    category: "",
    status: "Draft",
  });

  useEffect(() => {
    if (documentData) {
      setFormData(documentData);
    }
  }, [documentData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="document-form-container">
      <h2 className="text-xl font-semibold">{documentData ? "Edit Document" : "Create Document"}</h2>
      <form onSubmit={handleSubmit} className="document-form">
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>

        <label>
          Owner:
          <input type="text" name="owner" value={formData.owner} onChange={handleChange} required />
        </label>

        <label>
          Category:
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </label>

        <label>
          Status:
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </label>

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
