import logo from "./../../../assets/images/logo-light-slim.png";
import Security from "../Security/Security";

export default function LoginPopUp() {
  return (
    <>
      {/* Modal */}
      <div
        className="modal fade"
        id="login-modal"
        tabIndex={-1}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="login-modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-1">
            <div className="modal-header">
              <img src={logo} alt="TulaBy Logo" className="pt-2" width={150} />
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="modal-close"
              />
            </div>
            <div className="modal-body pb-4 px-5">
              <Security unique={1} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
