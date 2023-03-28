import React, { useState, useEffect } from "react";
import "./NavBar.css";
import { getUserId, getRole, getUsername } from "./utils";

const NavBar = () => {
  const token = localStorage.getItem("token");
  var r = getRole();
  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/RegisterAndLoginPage";
  };
  return (
    <div className="navbar">
      <div className="navbrand">
        <a href="/" id="navhome">
          Student 2.0
        </a>
      </div>
      {token !== null && r === "Student" ? (
        <>
          <div className="dd">
            <button className="ddbtn">Oglasi</button>
            <div className="ddoglasi">
              <a href="/RoomateAdPage">Cimer</a>
              <a href="/StudyBuddyAdPage">Studdy Buddy</a>
              <a href="/TutorAdPage">Tutor</a>
              <a href="/ProfessorPage">Profesor</a>
            </div>
          </div>
          <a href="/HomePage" id="homp">
            Home page
          </a>
        </>
      ) : (
        <></>
      )}

      {token !== null && r === "Professor" ? (
        <a href="/ProfessorPage" id="homp">
          Profesori
        </a>
      ) : (
        <></>
      )}
      {token !== null ? (
        <>
          <a href="/Profilepage" id="homp">
            Profile
          </a>
          <a onClick={logout} id="randl">
            LogOut
          </a>
        </>
      ) : (
        <a href="/RegisterAndLoginPage" id="randl">
          Registrujte se/ Prijavite se
        </a>
      )}
    </div>
  );
};
export default NavBar;
