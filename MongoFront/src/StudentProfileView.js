import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import axios from "axios";
import "./Register&LoginPage.css";

import { getRole, getUserId, getUsername } from "./utils";
import { Link, useNavigate } from "react-router-dom";

import {
  FormControl,
  ThemeProvider,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Backdrop,
  Fade,
  Input,
  IconButton,
  Box,
  Modal,
  Button,
  Select,
  MenuItem,
  getCardActionsUtilityClass,
  InputLabel,
  Alert,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["consolas"].join(","),
    fontSize: 12,
  },
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  borderRadius: "4px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const styleObisi = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  borderRadius: "4px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const StudentProfileView = () => {
  var userId = getUserId();
  var userRole = getRole();
  var userUsername = getUsername();

  //const token = localStorage.getItem("token");
  const usernam = window.location.href.split("/")[4];

  //--------------------------------------------
  const [clan, setClan] = useState({});

  //--------------------------------------------
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openObrisi, setOpenObrisi] = useState(false);
  const handleOpenObrisi = () => setOpenObrisi(true);
  const handleCloseObrisi = () => setOpenObrisi(false);
  const r = getRole();
  //----------------------------------------------
  const [dataS, setShowDataS] = useState("show", "hide");
  const [dataP, setShowDataP] = useState("show", "hide");
  const showDataS = () => {
    setShowDataP("hide");
    setShowDataS("show");
  };

  //-----------------------------------------------
  const token = localStorage.getItem("token");
  //-------------------UTISCI---------------------

  const profileData = () => {
    axios
      .get("https://localhost:7199/Student/GetStudentById/" + usernam, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        console.log(userId);

        setClan({
          name: res.data.name,
          surname: res.data.surname,
          email: res.data.email,
          username: res.data.username,
          faculty: res.data.facultyStudent.nameOfFaculty,
          city: res.data.city,
          godSt: res.data.yearOfStudies,
          tip: res.data.typeOfStudies,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    profileData();

    showDataS();
  }, []);
  const t = localStorage.getItem("token");
  return (
    <section className="ProfilePage">
      <div id="boxProfile">
        <div id="barProfile">
          <span className="bartitle"></span>
        </div>

        <div className="profile">
          <div className="osnovni">
            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Ime</div>
                <div className="profile-description" id="name">
                  {clan.name}
                </div>
              </div>
              <div className="profile-info">
                <div className="profile-title">Prezime</div>
                <div className="profile-description" id="surename">
                  {clan.surname}
                </div>
              </div>
            </div>

            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Korisničko ime</div>
                <div className="profile-description" id="username">
                  {clan.username}
                </div>
              </div>

              <div className="profile-info">
                <div className="profile-title">E-mail</div>
                <div className="profile-description" id="email">
                  {clan.email}
                </div>
              </div>
            </div>
          </div>
          <div className={dataS}>
            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Naziv fakulteta</div>
                <div className="profile-description">{clan.faculty}</div>
              </div>
              <div className="profile-info">
                <div className="profile-title">Grad</div>
                <div className="profile-description" id="city">
                  {clan.city}
                </div>
              </div>
            </div>
            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Godina studija</div>
                <div className="profile-description" id="godSt">
                  {clan.godSt}
                </div>
              </div>
              <div className="profile-info">
                <div className="profile-title">Tip studija</div>
                <div className="profile-description" id="tipS">
                  {clan.tip}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentProfileView;
