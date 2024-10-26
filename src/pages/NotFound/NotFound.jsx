import { Helmet } from "react-helmet";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>NotFound</title>
        <link rel="icon" href="../../assets/icons/notFound.ico" />
      </Helmet>
      <div>NotFound</div>
    </>
  );
}
