import axios from "axios";
import Apis from "./../../../Api.json";
import { useContext, useState, useEffect } from "react";
import UserContext from "../../../contexts/UserContextProvider";

const EventApiUrl = {
  lecture: `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
    Apis.getLecture
  }`,
  session: `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
    Apis.getSession
  }`,
};

export default function EventRelativeData({
  code,
  loadData,
  setDataIsLoading,
  isLecture,
  language,
}) {
  const [event, setEvent] = useState({
    data: {},
    errors: {},
  });
  const { User } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = `${
          isLecture
            ? EventApiUrl.lecture + "?Navigations.EnableProfessor=true"
            : EventApiUrl.session +
              "?Navigations.EnableInstructor=true&Navigations.EnableGroup=true"
        }&Navigations.EnableSubject=true&Navigations.EnablePlace=true&search.code=${code}`;

        const response = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${User.token}`,
          },
        });

        setEvent({ data: response.data, errors: {} });
        setDataIsLoading(null);
        // console.log(response);
      } catch (error) {
        setEvent({ data: {}, errors: error.response.data });
        setDataIsLoading(null);
        // console.error(error);
      }
    };

    loadData && fetchData();
  }, [code, isLecture, loadData, User.token]);

  // Render important event data
  const { instructor, professor, place, subject } = event.data;

  return (
    <div className="d-flex flex-column text-start gap-2">
      {subject && (
        <div>
          <strong className="me-2">
            {language === "en" ? "Subject" : "الموضوع"}:
          </strong>
          {language === "en" ? subject.title : subject.titleAR}
        </div>
      )}

      {instructor && (
        <div>
          <strong className="me-2">
            {language === "en" ? "Instructor" : "المُعيد"}:
          </strong>
          {language === "en" ? instructor.name : instructor.nameAR}
        </div>
      )}
      {professor && (
        <div>
          <strong className="me-2">
            {language === "en" ? "Professor" : "الدكتور"}:
          </strong>
          {language === "en" ? professor.name : professor.nameAR}
        </div>
      )}

      {place && (
        <div>
          <strong className="me-2">
            {language === "en" ? "Place" : "المكان"}:
          </strong>
          {place.name}
        </div>
      )}

      {/* You can add more data rendering here based on what's important */}
    </div>
  );
}
