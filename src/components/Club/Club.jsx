import defaultImage from "./../../assets/images/user-1.jpg";


export default function Club({ club , onSelect}) {

  
  return (
    <button
      className="getChatBtn list-group-item rounded-0 reset-btn-outline"
      id={`club-${club.clubId}`}
      data-club-id={club.clubId}
      data-user-id={club.userId}
      onClick={() => onSelect?.(club.club)}
    >
      <div className="d-flex">
        <div className="d-flex align-items-center">
          <div className="user-avatar">
            <div className="nav-icon-hover">
              <img
                src={ defaultImage}
                width="40"
                height="40"
                className="rounded-circle border border-white"
                alt="Profile"
              />
            </div>
          </div>
        </div>

        <div className="chatBox-Details flex-grow-1 ms-2 pt-2 ps-2 overflow-hidden">
          <div className="overflow-hidden text-start">
            <h6
              className="mb-0 chat-title text-ellipsis fw-bolder"
              title={club.club.name}
            >
              {club.club.name}
            </h6>
          </div>

          {club.club.lastMessage ? (
            <div className="last-message">
              <p
                className="message-content mb-0 text-ellipsis text-start"
                title={club.club.lastMessage.content}
              >
                {club.club.lastMessage.content}
              </p>

              <p
                className="message-time chat-time text-muted m-0 fs-3 text-end"
                title="Sent At"
              >
                {new Date(club.club.lastMessage.createdAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="club-description">
              <p
                className="mb-0 text-ellipsis text-start"
                title={club.club.description}
              >
                {club.club.description}
              </p>

              <p
                className="chat-time text-muted m-0 fs-3 text-end"
                title="Joined At"
              >
                {new Date(club.joinedDate).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}