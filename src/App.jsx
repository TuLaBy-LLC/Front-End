import { QueryClient, QueryClientProvider } from "react-query";
import Routes from "./Routes";
import { UserContextProvider } from "./contexts/UserContextProvider";
import { ReactQueryDevtools } from "react-query/devtools";
import SideBarProvider from "./contexts/SideBarProvider";
import "keen-slider/keen-slider.min.css"

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SideBarProvider>
        <UserContextProvider>
          <Routes />
        </UserContextProvider>
      </SideBarProvider>

      <ReactQueryDevtools initialIsOpen="false" position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
