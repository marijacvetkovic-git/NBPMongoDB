import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInPage from "./LoginPage";
import RegisterAndLogin from "./RegisterAndLoginPage";
import NavBar from "./NavBar";
import Profilepage from "./ProfilePage";
import StudyBuddyAdPage from "./Ads/StudyBuddyAdPage";
import RoomateAdPage from "./Ads/RoomatesAdPage";
import TutorAdPage from "./Ads/TutorAdPage";
import ProfessorPage from "./Ads/ProfessorPage";
import ProfileView from "./ProfileView";
import StudentProfileView from "./StudentProfileView";
import HomePage from "./HomePage";

function App() {
  return (
    <section className="glavno">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/RegisterAndLoginPage" element={<RegisterAndLogin />} />
          <Route path="/LogInPage" element={<LogInPage />}></Route>
          <Route path="/ProfilePage" element={<Profilepage />}></Route>
          <Route path="/RoomateAdPage" element={<RoomateAdPage />} />
          <Route path="/TutorAdPage" element={<TutorAdPage />} />
          <Route path="/StudyBuddyAdPage" element={<StudyBuddyAdPage />} />
          <Route path="/ProfessorPage" element={<ProfessorPage />} />
          <Route path="/ProfilePage/:id" element={<ProfileView />} />
          <Route
            path="/StudentProfilePage/:id"
            element={<StudentProfileView />}
          />
          <Route path="/HomePage" element={<HomePage />} />
        </Routes>
      </Router>
    </section>
  );
}

export default App;
