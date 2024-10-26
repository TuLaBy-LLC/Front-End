import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout/Layout";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import PageGuard from "./pages/PageGuard";
import News from "./pages/News/News";
import Attendance from "./pages/Attendance/Attendance";
import PageLayout from "./layout/PageLayout/PageLayout";
import Lecture from "./pages/Lecture/Lecture";
import Session from "./pages/Session/Session";
import NotFound from "./pages/NotFound/NotFound";
import NewsDetails from "./pages/News/NewsDetails";
import NewsFeed from "./pages/News/News";

const routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <PageLayout>
            <Home />
          </PageLayout>
        ),
      },
      {
        path: "profile",
        element: (
          <PageGuard>
            <Profile />
          </PageGuard>
        ),
      },
      {
        path: "news/:id",
        element: (
          <PageLayout>
            <NewsDetails />
          </PageLayout>
        ),
      },
      {
        path: "news",
        element: (
          <PageLayout>
            <NewsFeed />
          </PageLayout>
        ),
      },
      {
        path: "attendance",
        element: (
          <PageGuard>
            <Attendance />
          </PageGuard>
        ),
      },
      {
        path: "attendance/lecture/:code",
        element: (
          <PageGuard>
            <Lecture />
          </PageGuard>
        ),
      },
      {
        path: "attendance/session/:code",
        element: (
          <PageGuard>
            <Session />
          </PageGuard>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function Routes() {
  return <RouterProvider router={routes}></RouterProvider>;
}
