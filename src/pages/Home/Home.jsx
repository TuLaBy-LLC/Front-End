import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import UserContext from "../../contexts/UserContextProvider";
import News from "../../layout/News/News";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import LoadingComponent from "../../components/loading/Loading";
import { useTranslation } from "react-i18next";
import Security from "../../components/Auth/Security/Security";

export default function Home() {
  const { User } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Helmet>
        <title>Home</title>
        <link rel="icon" href="../../assets/icons/home.svg" />
      </Helmet>

      {loading ? (
        <LoadingComponent active={User.isLoading} />
      ) : (
        <>
          <section className="intro-news-area position-relative">
            <div className="container">
              <div className="row justify-content-center g-4 pt-4">
                <div className="col-12 col-lg-8 position-relative">
                  <News t={t} i18n={i18n} User={User} />
                </div>

                <div className="d-lg-none text-primary px-5">
                  <hr />
                </div>

                <div className="col-12 col-lg-4">
                  <div className="rounded-1">
                    {!User.token? (
                      <div className="bg-white shadow-sm rounded-1 p-4">
                        <Security unique={2}/>

                        <p className="text-muted mt-3 mb-0" style={{fontSize:".9rem"}}>
                          <span className="fw-bolder px-1 text-primary">
                            {t("TuLaBy")}
                          </span>
                          {t("misc.speech")}
                        </p>
                      </div>
                    ) : (
                      <ProfileCard t={t} i18n={i18n}  token={User.token} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
