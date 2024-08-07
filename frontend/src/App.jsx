import { Box, Container, Grid, useMediaQuery } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
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
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");
  return (
    <GoogleOAuthProvider
      clientId={
        "15341200802-g06se7feje9do51deoqftv4ua7tq9l7s.apps.googleusercontent.com"
      }
    >
      <Box position={"relative"} w={"full"}>
        <Container maxW={"full"} p={0}>
          {/* <Header /> */}
          {user?.soloOrganizer && pathname !== "/chat" && <CreateEventButton />}

          <Grid
            gridTemplateColumns={{ md: "50px 1fr", lg: "200px 1fr" }}
            h={"fit-content"}
            display={{ base: "block", md: "grid", lg: "grid" }}
            width={isSmallScreen && "100vw"}
          >
            <Box borderRight={"1px solid"} borderColor={"gray.400"}>
              <Navbar />
            </Box>

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
          </Grid>
        </Container>
      </Box>
    </GoogleOAuthProvider>
  );
}

export default App;
