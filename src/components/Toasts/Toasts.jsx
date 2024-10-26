import { useEffect, useState } from "react";
import logo from './../../assets/images/logo-light_flat.png'

export default function Toast_Default({message,statusIsSuccess = true,time=7000}) {
  
  const [Status, setStatus] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setStatus(false);
    }, time);
  }, [])
  
  return (
    <>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="liveToast"
          className={`toast fade  ${!statusIsSuccess && " bg-danger"} ${Status ? "show" : "hide"}`} 
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className={`toast-header d-flex align-items-center ${!statusIsSuccess && "bg-white"} justify-content-between`}>
            <img src={logo} className="rounded" width={100} alt="..." />
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className={`toast-body ${!statusIsSuccess && " text-white"}`}>{message}</div>
        </div>
      </div>
    </>
  );
}
