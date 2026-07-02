import { memo } from "react";
import defaultImage from "../../assets/images/user-1.jpg";

import {
  IconUsers,
  IconCalendar,
  IconClock,
  IconSchool,
  IconBriefcase,
  IconUser,
  IconX,
  IconVolumeOff,
  IconInfoCircle
} from "@tabler/icons-react";

function ChatUsersModal({
  show,
  club,
  onClose,
  users = { items: [], count: 0 }
}) {
  // console.log(club);

  if (!show) return null;

  const getUserType = type => {

    switch (type) {
      case 0:
        return {
          label: "Student",
          icon: IconSchool,
          className: "bg-primary-subtle text-primary"
        };

      case 1:
        return {
          label: "Student",
          icon: IconSchool,
          className: "bg-primary-subtle text-primary"
        };

      case 2:
        return {
          label: "Teacher",
          icon: IconBriefcase,
          className: "bg-success-subtle text-success"
        };

      case 3:
        return {
          label: "Staff",
          icon: IconUser,
          className: "bg-warning-subtle text-warning"
        };

      default:
        return {
          label: "User",
          icon: IconUser,
          className: "bg-secondary-subtle text-secondary"
        };
    }
  };

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">

          <div className="modal-content border-0 shadow-lg rounded-4">

            {/* Header */}
            <div className="modal-header border-0 p-4">

              <div className="d-flex align-items-start gap-3 flex-grow-1">

                <div className="members-header-icon">
                  <IconUsers size={28} />
                </div>

                <div className="flex-grow-1">

                  <div className="d-flex align-items-center gap-2 flex-wrap">

                    <h3 className="fw-bold mb-0">
                      {club?.name}
                    </h3>

                    <span className="badge bg-primary-subtle text-primary">
                      {club?.clubType}
                    </span>

                    {club?.isMuted && (
                      <span className="badge bg-warning-subtle text-warning">
                        Muted
                      </span>
                    )}

                  </div>

                  <p className="text-muted mb-2 mt-2">
                    {club?.description || "No description available"}
                  </p>

                  <div className="d-flex gap-3 small text-muted">

                    <span>
                      <IconUsers
                        size={15}
                        className="me-1"
                      />
                      {users?.count || 0} members
                    </span>

                    <span>
                      ID: {club?.id}
                    </span>

                  </div>

                </div>

              </div>

              <button
                className="btn-close"
                onClick={onClose}
              />

            </div>

            {/* Body */}
            <div className="modal-body px-4 pt-0 pb-4">

              <div className="members-list">

                {users.items.map(member => {

                  const user = member.user;

                  const userType =
                    getUserType(user.userType);

                  const UserTypeIcon =
                    userType.icon;

                  return (
                    <div
                      className="member-card"
                      key={member.id}
                    >

                      {/* Left */}
                      <div className="d-flex align-items-center gap-3">

                        <div className="position-relative">

                          <img
                            src={
                              user.imageName ||
                              defaultImage
                            }
                            alt={user.name}
                            className="member-avatar"
                          />

                          <span
                            className={`member-status-dot ${user.isActive
                                ? "online"
                                : "offline"
                              }`}
                          />

                        </div>

                        <div>

                          <h5 className="mb-1 fw-bold">
                            {user.name}
                          </h5>

                          <div className="text-primary small fw-semibold">
                            @{user.userName}
                          </div>

                          <div className="text-muted small">
                            {user.email}
                          </div>

                        </div>

                      </div>

                      {/* Center */}
                      <div className="member-meta">

                        <span
                          className={`badge rounded-pill px-3 py-2 ${userType.className}`}
                        >

                          <UserTypeIcon
                            size={14}
                            className="me-1"
                          />

                          {userType.label}

                        </span>

                        <div className="small text-muted mt-3">

                          <div className="mb-1">

                            <IconCalendar
                              size={14}
                              className="me-2"
                            />

                            Joined {" "}
                            {
                              new Date(
                                member.joinedDate
                              ).toLocaleDateString()
                            }

                          </div>

                          <div>

                            <IconClock
                              size={14}
                              className="me-2"
                            />

                            {
                              new Date(
                                member.joinedDate
                              ).toLocaleTimeString()
                            }

                          </div>

                        </div>

                      </div>

                      {/* Right */}
                      <div>

                        <span
                          className={`badge rounded-pill px-3 py-2 ${user.isActive
                              ? "bg-success-subtle text-success"
                              : "bg-danger-subtle text-danger"
                            }`}
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default memo(ChatUsersModal);