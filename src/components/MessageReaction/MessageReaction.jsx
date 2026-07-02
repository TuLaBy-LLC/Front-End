// MessageReactions.jsx

import { useState } from "react";
import {
  IconThumbUp,
  IconThumbDown,
  IconMoodSmileFilled,
  IconMoodHappyFilled,
  IconMoodSadFilled,
  IconMoodAngry,
  IconHeartFilled,
  IconMoodNeutralFilled
} from "@tabler/icons-react";

export const REACTIONS = [
  {
    id: 1,
    label: "Like",
    icon: IconThumbUp,
    className: "text-primary",
  },
  {
    id: 2,
    label: "Dislike",
    icon: IconThumbDown,
    className: "text-danger",
  },
  {
    id: 3,
    label: "Smile",
    icon: IconMoodSmileFilled,
    className: "text-warning",
  },
  {
    id: 4,
    label: "Happy",
    icon: IconMoodHappyFilled,
    className: "text-success",
  },
  {
    id: 5,
    label: "Sad",
    icon: IconMoodSadFilled,
    className: "text-secondary",
  },
  {
    id: 6,
    label: "Angry",
    icon: IconMoodAngry,
    className: "text-danger",
  },
  {
    id: 7,
    label: "Love",
    icon: IconHeartFilled,
    className: "text-danger",
  },
];


export default function MessageReactions({
  currentReactionId = null,
  reactsCount = 0,
  onReact,
  disabled = false,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectReact, setSelectReact] = useState(REACTIONS[currentReactionId - 1]);

  const handleReaction = (reaction) => {
    setShowPicker(false);
    setSelectReact(reaction);
    onReact?.(reaction.id);
  };

  return (
    <div className="position-relative d-inline-block">
      {/* Reaction Picker */}
      {showPicker && (
        <div
          className="position-absolute bottom-100 start-100 translate-middle-x mb-2
                     d-flex align-items-center gap-1 bg-white border rounded-pill
                     shadow-sm px-2 py-1"
          style={{ zIndex: 1050 }}
        >
          {REACTIONS.map((reaction) => {
            const Icon = reaction.icon;

            return (
              <button
                key={reaction.id}
                type="button"
                className="btn btn-light border-0 rounded-circle p-2 d-flex
                           align-items-center justify-content-center"
                title={reaction.label}
                disabled={disabled}
                onClick={() => handleReaction(reaction)}
              >
                <Icon
                  size={22}
                  className={`${reaction.className} transition`}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Toggle Button */}
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-sm btn-light rounded-circle border shadow-sm"
          disabled={disabled}
          onClick={() => setShowPicker((prev) => !prev)}
        >
          {
            selectReact != null ? (
              <selectReact.icon
                size={18}
                className={selectReact.className}
              />
            ) : (
              <IconMoodSmileFilled size={18} />
            )
          }
        </button>


        <span
          className="px-2 py-1 fw-bolder rounded-pill fw-semibold"
          style={{
            backgroundColor: "#f1f3f5",
            color: "#495057",
            fontSize: "0.75rem",
            minWidth: "32px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          +{reactsCount}
        </span>

      </div>
    </div>
  );
}