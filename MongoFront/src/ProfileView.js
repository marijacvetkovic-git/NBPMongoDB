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
const ProfileView = () => {
  var userId = getUserId();
  var userRole = getRole();
  var userUsername = getUsername();

  //const token = localStorage.getItem("token");
  const usernam = window.location.href.split("/")[4];

  //--------------------------------------------
  const [clan, setClan] = useState({});
  const [path, setPath] = useState(`https://localhost:7048/Images/`);
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
  const [styleAlert, changeAlert] = useState("hide");
  const [hideR, setHideR] = useState(true);

  const [getRate, setIdRate] = useState("");

  const showDataS = () => {
    setShowDataP("hide");
    setShowDataS("show");
  };
  const showDataP = () => {
    setShowDataS("hide");
    setShowDataP("show");
  };
  const showAlert = () => {
    changeAlert("show");
  };
  const hideAlert = () => {
    changeAlert("hide");
  };
  //----------------------------------------------
  const [fakultet, setFakultet] = useState([]);
  const fakulteti = () => {
    axios.get("https://localhost:7199/Faculty/GetFaculties/").then((res) => {
      setFakultet(res.data);
    });
  };
  //----------------------------------------------
  const [predid, setPredid] = useState("");
  const [pnaziv, setPnaziv] = useState("");
  const [faxnaziv, setFaxNaziv] = useState("");
  const [predmeti, setPredmeti] = useState([]);

  const postaviPredmet = (e) => {
    setPredid(e.target.value);
    setPnaziv(predmeti.find((p) => p.id === e.target.value));
  };
  const getPredmeti = () => {
    axios.get("https://localhost:7199/Subject/GetSubjects/").then((res) => {
      console.log(res.data);
      setPredmeti(res.data);
    });
  };
  //----------------------------------------------
  const [fax, setFax] = useState("");
  const [faxid, setFaxid] = useState("");
  const postaviFakultet = (e) => {
    setFaxid(e.target.value);
    setFax(fakultet.find((p) => p.fid === e.target.value));
  };

  const showCertCoures = (e) => {
    setFaxid(e.target.value);
    var fid = e.target.value;
    axios
      .get("https://localhost:7048/api/DataView/FiltersProfCours/" + fid)
      .then((res) => {
        console.log(res.data);
        setPredmeti(res.data);
      });
  };

  //-----------------------------------------------
  const token = localStorage.getItem("token");
  //-------------------UTISCI---------------------
  const [grades, setGrades] = useState([]);
  const [comms, setComms] = useState([]);
  //----------------------------------------------
  const [f, setF] = useState([]);
  const [prvi, setPrvi] = useState([]);

  const [p, setPr] = useState([]);
  const showPred = () => {
    axios
      .get("https://localhost:7199/Professor/ListAllSubjectsProf/" + usernam)
      .then((res) => {
        setPr(res.data);
      });
  };

  const profileData = () => {
    axios
      .get("https://localhost:7199/Professor/GetById/" + usernam, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setClan({
          name: res.data.name,
          surname: res.data.surname,
          email: res.data.email,
          ocenaProsek: res.data.avgRate,
          username: res.data.username,
          nastavnoZ: res.data.education,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showGrades = () => {
    axios
      .get(
        "https://localhost:7199/Professor/ListRatingsOfCertainProfessor/" +
          usernam
      )
      .then((res) => {
        setGrades(res.data);
      });
  };
  const showComms = () => {
    axios
      .get(
        "https://localhost:7199/Professor/ListCommentsOfCertainProfessor/" +
          usernam
      )
      .then((res) => {
        setComms(res.data);
        console.log(res.data);
      });
  };
  const rateProfessor = (e) => {
    e.preventDefault();
    var r = e.target.ocena.value;
    const rate = {
      rateValue: r,
      studentRate: userId,
      professorRate: usernam,
    };

    axios
      .post("https://localhost:7199/Rate/CreateRate", rate)
      .then((res) => {
        setHideR(false);
        window.location.reload();
      })
      .catch((err) => console.log(err.message));
  };
  const updateRateProfessor = (e) => {
    //e.preventDefault();
    console.log(getRate);
    var r = e.target.upocena.value;
    // const rate = {
    //   rateValue: r,
    //   studentRate: userId,
    //   professorRate: usernam,
    // };
    console.log(r);
    axios
      .put("https://localhost:7199/Rate/UpdateRate/" + getRate + "/" + r)
      .then((res) => {
        console.log("Promenjeno");
      })
      .catch((err) => console.log(err.message));
  };
  const deleteComment = (idComm) => {
    axios
      .delete("https://localhost:7199/Comment/DeleteComment/" + idComm)
      .then((res) => {
        console.log("Obrisano");
        window.location.reload();
      })
      .catch((err) => console.log(err.message));
  };

  const commentProfessor = (e) => {
    e.preventDefault();
    var komentar = e.target.comm.value;
    const upitnik = usernam.charAt(usernam.length - 1);
    console.log(upitnik);
    var p = usernam;
    var id = usernam.substring(0, usernam.length - 1);
    if (upitnik == "?") {
      p = id;
    }
    const comment = {
      text: komentar,
      commentStudent: userId,
      commentProfessor: p,
    };
    console.log(comment);
    axios
      .post("https://localhost:7199/Comment/CreateNewComment", comment)
      .then((res) => {
        console.log(res.data);

        window.location.reload();
      });
  };

  const alreadyRated = (u, s) => {
    axios
      .get("https://localhost:7199/Rate/AlreadyRated/" + s + "/" + u)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          //vec ocenjen
          setHideR(false);
        } else setHideR(true);
      });
  };
  useEffect(() => {
    alreadyRated(usernam, userId);
    profileData();
    fakulteti();
    showDataP();
    showComms();
    showGrades();
    showPred();
  }, []);
  const t = localStorage.getItem("token");
  return (
    <section className="ProfilePage">
      <div id="boxProfile">
        <div id="barProfile">
          <span className="bartitle"></span>
        </div>
        {hideR === true ? (
          <>
            <form onSubmit={(e) => rateProfessor(e)}>
              <FormControl id="formctrl">
                <ThemeProvider theme={theme}>
                  <TextField
                    id="ocena"
                    label="Ocena"
                    type="number"
                    fullWidth
                    InputProps={{
                      inputProps: { min: 0, max: 5 },
                    }}
                    variant="standard"
                  />
                  <br />

                  <Button
                    size="small"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      fontWeight: "bold",
                      letterSpacing: 1,
                      fontSize: 15,
                    }}
                    type="submit"
                  >
                    Oceni
                  </Button>
                </ThemeProvider>
              </FormControl>
              <br />
              <br />
            </form>
          </>
        ) : (
          <></>
        )}

        <div className={styleAlert} id="nemaOglas">
          <Alert severity="error">Nema oglasa koje zahtevate!</Alert>
        </div>
        <form onSubmit={(e) => commentProfessor(e)}>
          <FormControl id="formctrl">
            <ThemeProvider theme={theme}>
              <TextField
                id="comm"
                multiline
                fullWidth
                label="Unesite komentar"
                size="small"
                variant="outlined"
                minRows={5}
              />
              <br />

              <Button
                size="small"
                variant="outlined"
                color="neutral"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 1,
                  fontSize: 15,
                }}
                type="submit"
              >
                Postavi komentar
              </Button>
            </ThemeProvider>
          </FormControl>
          <br />
          <br />
        </form>
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
          <div className={dataP}>
            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Obrazovanje</div>
                <div className="profile-description" id="nastavnoZ">
                  {clan.nastavnoZ}
                </div>
              </div>
            </div>
            <div className="profile-row-desc">
              <div className="profile-title">Predmeti</div>
              <div className="profile-description" id="predmet">
                {p.map((jovan) => {
                  return <div>{jovan.name}</div>;
                })}
              </div>
            </div>
            <div className="profile-row-desc">
              <div className="profile-title">Prosečna ocena predavača</div>
              <div className="profile-description" id="predmet">
                {clan.ocenaProsek}
              </div>
            </div>
          </div>
        </div>
        <div className={dataP} id="centriraj"></div>
        <div id="skrol">
          <div id="ocene" className="recenzija">
            {Array.isArray(grades) && grades.length ? (
              grades.map((grade) => {
                return (
                  <div className="cardG" key={grade.idRate}>
                    <div className="card-headerG">{grade.studentRate}</div>
                    <div className="card-bodyG">
                      <div className="card-titleG">
                        <p>Ocena: {grade.rateValue}</p>
                        {userUsername === grade.studentRate ? (
                          <>
                            <form onSubmit={(e) => updateRateProfessor(e)}>
                              <FormControl id="formctrl">
                                <ThemeProvider theme={theme}>
                                  <TextField
                                    id="upocena"
                                    label="Ocena"
                                    type="number"
                                    fullWidth
                                    InputProps={{
                                      inputProps: { min: 0, max: 5 },
                                    }}
                                    variant="standard"
                                  />
                                  <br />
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="neutral"
                                    sx={{
                                      fontWeight: "bold",
                                      letterSpacing: 1,
                                      fontSize: 15,
                                    }}
                                    onClick={() => setIdRate(grade.idRate)}
                                    type="submit"
                                  >
                                    Promeni ocenu
                                  </Button>
                                </ThemeProvider>
                              </FormControl>
                              <br />
                              <br />
                            </form>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>

          <div id="komentari" className="recenzija">
            {Array.isArray(comms) && comms.length ? (
              comms.map((comm) => {
                var datumKom = new Date(comm.dateOfCreation).toLocaleString();
                // const velikiKom = `${datumKom.getDate()}/${datumKom.getMonth()}/${datumKom.getFullYear()}  ${datumKom.getHours()}:${datumKom.getMinutes()}`;
                return (
                  <div className="card" key={comm.komentarId}>
                    <div className="card-header">
                      <p>
                        {comm.commentStudent}, {datumKom}
                      </p>
                      {userUsername === comm.commentStudent ? (
                        <ThemeProvider theme={theme}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="neutral"
                            sx={{
                              fontWeight: "bold",
                              letterSpacing: 1,
                              fontSize: 15,
                            }}
                            onClick={() => deleteComment(comm.idComm)}
                            type="submit"
                          >
                            X
                          </Button>
                        </ThemeProvider>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="card-title">
                        <p>{comm.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileView;
