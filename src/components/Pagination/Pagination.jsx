export const GetPaginationValues = (form, query)=>{
  
  const formData = new FormData(form); // Extract form data
  const pageSize = formData.get("pagination.pagesize");
  const pageIndex = formData.get("pagination.pageindex");

  // Parse the existing query state
  const queryParams = new URLSearchParams(query);

  // Update or add pagination parameters
  if (pageSize) {
    queryParams.set("pagination.pagesize", pageSize);
  }

  if (pageIndex) {
    queryParams.set("pagination.pageindex", pageIndex);
  }

  // Generate the updated query string
  const updatedQueryString = queryParams.toString();

  return updatedQueryString;
}

export default function Pagination({size,page,totalPages, handlePagination}) {
  return (
    <div className="row justify-content-center">
    <form className="col-md-6" onSubmit={handlePagination}>
      <div className="input-group mb-3">
        <input
          type="number"
          className="form-control"
          name="pagination.pagesize"
          placeholder="Page Size"
          title="Page Size"
          aria-label="Page Size"
          data-translate="PageSize"
          min="1"
          defaultValue={size}
          max="10"
        />
        <input
          type="number"
          className="form-control"
          name="pagination.pageindex"
          placeholder="Page Index"
          title={`Page Index, Max ${totalPages}`}
          aria-label="Page Index"
          data-translate="PageIndex"
          min="1"
          defaultValue={page}
          max={totalPages}
        />
        <button
          className="btn btn-dark"
          type="submit"
          data-translate="go"
        >
          Go
        </button>
      </div>
    </form>
  </div>

  )
}
