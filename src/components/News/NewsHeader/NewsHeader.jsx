import { Link } from "react-router-dom";
import { convertDate } from "../../../Helpers/Methods";
import {
  IconArrowNarrowRight,
  IconClock,
  IconEye,
  IconThumbUpFilled,
} from "@tabler/icons-react";

export default function NewsHeader({
  id = "b07cfd61-a633-4349-802a-3224fcc6c5b4",
  title = "Business-focused",
  titleAR = "",
  coverImage = "https://localhost:7018/images/articles/http://lorempixel.com/640/480/cats",
  publicationDate = "2024-04-15T00:47:01.2205724",
  views = 244,
  publisherId,
  likes = 36,
  tags = "xcv vggv ecc",
  publisher,
  i18n,
  t,
}) {
  const tagsJsx = (
    <>
      <div className="position-absolute d-flex align-items-center bottom-0 start-0 fs-3 bg-primary-subtle p-1 text-dark">
        <span className="fs-4 text-primary ps-1">#</span>
        {tags
          .split(" ")
          .slice(0, 3)
          .map((tag, i, arr) => (
            <Link key={tag} to={`/news?search.tags=${tag}`}>
              <span className="text-dark-emphasis fw-bolder">{tag}</span>
              <span className="text-primary">{arr.length - 1 != i && "_"}</span>
            </Link>
          ))}
      </div>
    </>
  );
  // console.log(publisher);

  return (
    <div className="card single-news header-news shadow-sm rounded-1 overflow-hidden position-relative">
      <div className={`position-relative ${coverImage ? "" : "placeholder"}`}>
        <div
          className="image-holder overflow-hidden"
          style={{ cursor: "pointer" }}
        >
          <img
            src={coverImage}
            className="card-img-top w-100 object-fit-cover"
            alt={`Picture ${title}`}
          />
        </div>
        {tagsJsx}
      </div>
      <div className="card-body p-3">
        {/* add toaltip here */}
        <div className="d-flex">
          <Link
            to={`/news/${id}`}
            className="title text-ellipsis fs-5"
            title={i18n.language == "en" ? title : titleAR}
          >
            {i18n.language == "en" ? title : titleAR}
          </Link>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex align-items-center text-muted gap-1">
            <div className="d-flex align-items-center gap-1 border-2 border-end border-light-subtle pe-1">
              <span className="fs-3">{likes}</span>
              <IconThumbUpFilled size={15} />
            </div>

            <div className="d-flex align-items-center gap-1">
              <span className="fs-3">{views}</span>
              <IconEye size={15} />
            </div>
          </div>

          <Link to={`/news/${id}`} className="fs-3">
            {t("misc.readMore")}

            <div className="bounce-right">
              <IconArrowNarrowRight size={15} />
            </div>
          </Link>
        </div>
      </div>
      <div className="card-footer p-3 fs-3 text-muted d-flex justify-content-between align-items-center">
        {publisher != null ? (
          <div className="user-info d-flex gap-2 align-items-center">
            <img
              src={publisher?.imageName}
              className="rounded-circle"
              style={{ width: "1.8rem", height: "1.8rem" }}
              alt={`${publisher?.name} Image`}
            />
            <Link
              to={`/news?Search.PublisherId=${publisherId}`}
              className="text-muted m-0"
            >
              {i18n.language == "en" ? publisher?.name : publisher?.nameAR}
            </Link>
          </div>
        ) : (
          <>
          </>
        )}

        <div className="time d-flex gap-2 align-items-center">
          <IconClock size={16} />
          <p className="m-0">{convertDate(publicationDate)}</p>
        </div>
      </div>
    </div>
  );
}
