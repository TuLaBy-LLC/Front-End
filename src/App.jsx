import { QueryClient, QueryClientProvider } from "react-query";
import Routes from "./Routes";
import { UserContextProvider } from "./contexts/UserContextProvider";
import { ReactQueryDevtools } from "react-query/devtools";
import SideBarProvider from "./contexts/SideBarProvider";
import "keen-slider/keen-slider.min.css";
import NotificationProvider from "./contexts/NotificationProvider";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <SideBarProvider>
          <UserContextProvider>
            <Routes />
          </UserContextProvider>
        </SideBarProvider>
      </NotificationProvider>

      <ReactQueryDevtools initialIsOpen="false" position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
