import { Link } from "react-router-dom";
import { convertDate } from "../../../Helpers/Methods";



export default function SingleNews({
  publisher = null,
  images = [],
  id = "b07cfd61-a633-4349-802a-3224fcc6c5b4",
  title = "Business-focused",
  titleAR = "مرجع ولايزال الخارجي تعطي من.",
  content = "Sit quia sed sed illo optio. Aut nam porro. Autem qui ea nihil sit rerum magni.",
  contentAR = "ليتراسيت المقروء ببساطة انتشر طريقة. تقضي لتكوّن كبير صناعات مجموعة حقيقة الخارجي. هو المحتوى الأصلي برامج مثل هي هي برامج مطبعة ولايزال. النشر تعطي الطباعة المحتوى بمثابة. القرن قامت مطبعة يقرأها إصدار أن ودور ستينيّات مع مايكر. المعيار وبشكله قرون حقيقة.",
  publicationDate = "2024-04-15T00:47:01.2205724",
  isBreakingNews = false,
  language = "deposit",
  category = "Glens",
  coverImage = "https://localhost:7018/images/articles/http://lorempixel.com/640/480/cats",
  source = "http://elisha.biz",
  tags = "Awesome Frozen Towels",
  views = 244,
  likes = 36,
  lastUpdated = "2024-05-09T01:29:07.806828",
  publisherId = "7e2c17cf-9433-40c4-8bc1-364ddddf7f49"
}) {
  return (
    <Link
      to={`/news/${id}`}
      className="single-news shadow-sm row align-items-center placeholder-glow"
    >
      <div className="col-4 p-0">
        <div
          className={`blog-thumbnail  rounded-1 ${
            coverImage ? "" : "placeholder"
          }`}
        >
          <div className="image-holder" style={{ cursor: "pointer" }}>
            <img src={coverImage} className="w-100" alt={`Picture ${title}`} />
          </div>
        </div>
      </div>
      <div className="col-8 blog-content ps-4 pe-3">
        <span className="post-date">{convertDate(publicationDate)}</span>

        {/* add toaltip here */}
        <p className="post-title text-ellipsis mt-2" title={title}>
          {title}
        </p>
        <span className="tooltip">{title}</span>
      </div>
    </Link>
  );
}
