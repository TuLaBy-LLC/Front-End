import { useContext } from "react";
import UserContext from "../../contexts/UserContextProvider";
import LoginPopUp from "../../components/Auth/LoginPopUp/LoginPopUp";

export default function PageLayout({ children }) {
  const { User } = useContext(UserContext);

  return (
    <>
      {!User?.code && <LoginPopUp />}
      {children}
    </>
  );
}
