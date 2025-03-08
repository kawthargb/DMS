import { useState } from "react";
import "./FilterButton.css";

const FilterButton = ({ setDepartmentFilter, setPositionFilter }) => {
  const [filterType, setFilterType] = useState(""); // "department" or "position"
  const [selectedValue, setSelectedValue] = useState(""); // Selected value

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setSelectedValue(""); // Reset value when changing filter type
    setDepartmentFilter("");
    setPositionFilter("");
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);

    if (filterType === "department") {
      setDepartmentFilter(value);
      setPositionFilter(""); // Clear position filter
    } else if (filterType === "position") {
      setPositionFilter(value);
      setDepartmentFilter(""); // Clear department filter
    }
  };

  return (
    <div className="filter-button-container">
      {/* First Dropdown - Choose Filter Type */}
      <select className="filter-select" value={filterType} onChange={handleFilterTypeChange}>
        <option value="">Filter By</option>
        <option value="department">Department</option>
        <option value="position">Position</option>
      </select>

      {/* Second Dropdown - Choose Specific Value */}
      {filterType && (
        <select className="filter-select" value={selectedValue} onChange={handleValueChange}>
          <option value="">Select {filterType === "department" ? "Department" : "Position"}</option>
          {filterType === "department" ? (
            <>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
            </>
          ) : (
            <>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Analyst">Analyst</option>
            </>
          )}
        </select>
      )}
    </div>
  );
};

export default FilterButton;
