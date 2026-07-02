import { memo, useCallback } from "react";
import defaultImage from "../../assets/images/user-1.jpg";
import { timeAgo } from "../../Helpers/Methods";
import MessageReactions from "../MessageReaction/MessageReaction";

function OtherMessage({
  message,
  language,
  reactToMessage
}) {

  const sender =
    message.message.sender;

  const senderName =
    (language.startsWith("ar")
      ? sender?.nameAR
      : sender?.name)
      ?.split(" ")
      .slice(0, 2)
      .join(" ");

  const handleReaction = useCallback(
    async reactionId => {

      await reactToMessage(
        message.id || null,
        message.clubId,
        message.messageId,
        reactionId
      );

    },
    [message, reactToMessage]
  );

  return (
    <div className="px-3 mb-3 d-flex justify-content-start">

      <img
        src={sender?.imageName || defaultImage}
        width="45"
        height="45"
        className="rounded-circle me-2 flex-shrink-0"
        alt={senderName}
      />

      <div
        style={{
          maxWidth: "70%",
          minWidth: "40%",
          width: "fit-content"
        }}
      >

        <div className="d-flex justify-content-between gap-2 mb-1">

          <small className="fw-bold text-muted">
            {senderName}
          </small>

          <small className="text-muted pe-3">
            {timeAgo(
              message.sendAt,
              language
            )}
          </small>

        </div>

        <div className="rounded-4 shadow-sm p-3 pb-2 bg-light">

          {message.message.content}

          <div className="small mt-2 text-end text-muted">
            {new Date(
              message.sendAt
            ).toLocaleString()}
          </div>

        </div>

        <div className="mt-2">

          <MessageReactions
            currentReactionId={message.react}
            reactsCount={message.message.reacts}
            onReact={handleReaction}
          />

        </div>

      </div>

    </div>
  );
}

export default memo(OtherMessage);