import { IconTrash } from "@tabler/icons-react";
import { AvailableSearchPropertiesToSortWith } from "../FiltrationPanel/FiltrationPanel";

export default function SortObject({
  property,
  ascending,
  priority,
  handleChange, // Function to handle changes
  index, // Extra attribute (number or index of this sort),
  removeSort,
}) {
  return (
    <div className="d-flex align-items-center gap-3">
      {/* property Select with Floating Label */}
      <div className="form-floating">
        <select
          name={`property-${index}`}
          id={`property-${index}`}
          className="form-select"
          value={property} // Value is linked to the passed prop
          onChange={(e) => handleChange(index, "property", e.target.value)} // Pass index to identify this sort object
          placeholder="Sort By property"
        >
          <option value={null}>property</option>
          {Object.keys(AvailableSearchPropertiesToSortWith).map((key) => (
            <option value={key} key={key}>
              {key}
            </option>
          ))}
        </select>
        <label htmlFor={`property-${index}`}>Sort By property</label>
      </div>

      {/* priority Input with Floating Label */}
      <div className="form-floating">
        <input
          type="number"
          name={`priority-${index}`}
          id={`priority-${index}`}
          min={1}
          max={Object.keys(AvailableSearchPropertiesToSortWith).length} // Max value is the number of properties
          className="form-control"
          placeholder="priority"
          value={priority} // Value is linked to the passed prop
          onChange={(e) => handleChange(index, "priority", e.target.value)} // Pass index to identify this sort object
        />
        <label htmlFor={`priority-${index}`}>priority</label>
      </div>

      {/* ascending Checkbox */}
      <div className="form-check">
        <input
          type="checkbox"
          name={`ascending-${index}`}
          id={`ascending-${index}`}
          className="form-check-input"
          checked={ascending} // Checked is linked to the passed prop
          onChange={(e) => handleChange(index, "ascending", e.target.checked)} // Pass index to identify this sort object
        />
        <label htmlFor={`ascending-${index}`} className="form-check-label">
          ascending
        </label>
      </div>

      {/* Remove Sort Button */}
      <button
        className="btn btn-outline-danger"
        onClick={(_) => removeSort(index)}
      >
        <IconTrash />
      </button>
    </div>
  );
}
