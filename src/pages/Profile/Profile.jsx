import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Apis from "./../../Api.json";
import LoadingComponent from "../../components/loading/Loading";
import axios from "axios";
import { useTranslation } from "react-i18next";
import EditProfile from "../../components/EditProfile/EditProfile";
import ProfileCard, {
  getProfileData,
} from "../../components/ProfileCard/ProfileCard";
import UserContext from "../../contexts/UserContextProvider";
import { useQuery } from "react-query";
import Error from "../../components/Error/Error";

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.profile.profile
}`;

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { User, updateUser } = useContext(UserContext);
  // console.log(token);

  const { data, isLoading, error, isError, refetch } = useQuery(
    `profileData:${User.token}`,
    (_) => getProfileData(ApiUrl, User.token),
    {
      staleTime: 60 * 60 * 60,
      onSuccess: (data) => {
        updateUser({ ...User, imageName: data.user.imageName });
      },
    }
  );
  const RefetchStudent = (_) => refetch();

  // console.log(data);
  return (
    <>
      <Helmet>
        <title>Profile {data?.Name ? `- ${data?.Name}` : ""}</title>
        <link rel="icon" type="image/svg+xml" href={data?.picture} />
      </Helmet>

      {isLoading ? (
        <LoadingComponent />
      ) : isError ? (
        <Error {...error} />
      ) : data == null ? (
        <Error message="Some Thing Went Wrong..!" />
      ) : (
        <div className="user-details py-0 py-xl-4">
          <div className="content">
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <EditProfile
                    t={t}
                    i18n={i18n}
                    token={User.token}
                    userData={data}
                    handleStudentData={RefetchStudent}
                  />
                </div>

                <div className="col-md-8 col-lg-4 mt-5 mt-lg-4">
                  <ProfileCard
                    token={User.token}
                    profilePage={true}
                    t={t}
                    i18n={i18n}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
