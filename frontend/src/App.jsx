import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import Analytics from "./pages/Analytics";
import TicketsPage from "./pages/TicketsPage";
import CalendarPage from "./pages/CalendarPage";
import CreateEventPage from "./pages/CreateEventPage";
import Admins from "./components/Settings/Admins";
import Embed from "./components/Settings/Embed";
import Options from "./components/Settings/Options";
import Payment from "./components/Settings/Payment";
import EvntiqPlus from "./components/Settings/EvntiqPlus";
import DiscoverPage from "./pages/DiscoverPage";
import AccountSettings from "./components/Settings/AccountSettings";
import CreateEventButton from "./components/CreateEventButton";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  return (
    <Box position={"relative"} w={"full"}>
      <Container maxW={"full"}>
        <Header />
        {user.soloOrganizer === true && <CreateEventButton />}

        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  {/* <CreatePost /> */}
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/settings/*"
            element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
          >
            <Route path="account" element={<AccountSettings />} />
            <Route path="options" element={<Options />} />
            <Route path="embed" element={<Embed />} />
            <Route path="evntiq-plus" element={<EvntiqPlus />} />
            <Route path="payment" element={<Payment />} />
            <Route path="admins" element={<Admins />} />
          </Route>
          <Route
            path="/analytics"
            element={user ? <Analytics /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/tickets"
            element={user ? <TicketsPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/calendar"
            element={user ? <CalendarPage /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/discover"
            element={user ? <DiscoverPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/create"
            element={
              user?.soloOrganizer ? (
                <CreateEventPage />
              ) : (
                <Navigate to={"/auth"} />
              )
            }
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
