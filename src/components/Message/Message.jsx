import MyMessage from "../MyMessage/MyMessage";
import OtherMessage from "../OtherMessage/OtherMessage";

export default function Message(props) {
  const isMine =
    props.message.message.senderId === props.userId;

  return isMine
    ? <MyMessage {...props} />
    : <OtherMessage {...props} />;
}