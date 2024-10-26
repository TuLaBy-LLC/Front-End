// import React from "react";
// import Slider from "react-slick";
// import LoadingComponent from "../../loading/Loading";
// import SingleNews from "../SingleNews/SingleNews";
// import { useQuery } from "react-query";
// import { getAllNewsAPI } from "../../../layout/News/News";
// import Apis from "./../../../Api.json";
// import NewsHeader from "../NewsHeader/NewsHeader";
// import { Link } from "react-router-dom";

// const ApiUrl_Public = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
//   Apis.getAllNewsPublic
// }`;
// function NewsSlider({i18n,t}) {
//   const { data, isLoading } = useQuery(
//     "publicNews",
//     () => getAllNewsAPI(ApiUrl_Public),
//     {
//       staleTime: 60 * 60 * 60,
//     }
//   );

//   const settings = {
//     dots: false,
//     arrows: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     // autoplay: true,
//     autoplaySpeed: 3000,
//     cssEase: "linear",
//     pauseOnHover: true,
//   };

//   return (
//     <>
//       {isLoading ? (
//         <LoadingComponent />
//       ) : (
//         <div className="news-slider pb-5 pt-4 px-4">
//           <Link to={`/news`} className="h5 mb-3 d-block">
//             {t("news.news")}... 
//           </Link>
//           <Slider {...settings}>
//             {data?.items.map((news) => (
//               <NewsHeader t={t} i18n={i18n} key={news.id} {...news} />
//             ))}
//           </Slider>
//         </div>
//       )}
//     </>
//   );
// }

// export default NewsSlider;
