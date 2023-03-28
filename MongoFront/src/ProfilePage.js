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
  FormLabel,
  Backdrop,
  Fade,
  Box,
  Modal,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Alert,
} from "@mui/material";

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
const Profilepage = () => {
  var userId = getUserId();
  var userRole = getRole();
  var userUsername = getUsername();

  //--------------------------------------------
  const [clan, setClan] = useState({});

  //--------------------------------------------
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openObrisi, setOpenObrisi] = useState(false);
  const handleOpenObrisi = () => setOpenObrisi(true);

  const r = getRole();
  //----------------------------------------------
  const [dataS, setShowDataS] = useState("show", "hide");
  const [dataP, setShowDataP] = useState("show", "hide");
  const showDataS = () => {
    setShowDataP("hide");
    setShowDataS("show");
  };
  const showDataP = () => {
    setShowDataS("hide");
    setShowDataP("show");
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
  const [styleAlert, changeAlert] = useState("sakrij");
  const showAlert = () => {
    changeAlert("prikazi");
  };
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
      .get("https://localhost:7199/Professor/ListAllSubjectsProf/" + userId)
      .then((res) => {
        setPr(res.data);
      });
  };

  const changeProfileData = (e) => {
    var nameUpdate = e.target.nameModal.value;
    var surnameUpdate = e.target.surenameModal.value;

    var city = e.target.gardModal.value;
    var godst = e.target.godStModal.value;
    var tip = e.target.typeStModal.value;
    var usernameUpdate = e.target.usernameModal.value;
    var nastavnoUpdate = e.target.zvanjeModal.value;

    const profUp = {
      id: userId,
      username: usernameUpdate,
      name: nameUpdate,
      surname: surnameUpdate,
      education: nastavnoUpdate,
      subjectProf: predid,
    };

    if (userRole == "Professor") {
      axios
        .put(
          "https://localhost:7199/Professor/UpdateProfessor/",
          profUp,

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setClan({
              id: userId,
              name: nameUpdate,
              surname: surnameUpdate,
              username: usernameUpdate,
              nastavnoZ: nastavnoUpdate,
            });
            handleClose();
          } else {
            showAlert();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (userRole == "Student") {
      const stUp = {
        id: userId,
        username: usernameUpdate,
        name: nameUpdate,
        surname: surnameUpdate,
        city: city,
        yearOfStudies: godst,
        typeOfStudies: tip,
        facultyStudent: faxid,
      };
      console.log(stUp);
      axios
        .put("https://localhost:7199/Student/UpdateStudent/", stUp, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setClan({
            id: userId,
            name: nameUpdate,
            surname: surnameUpdate,
            username: usernameUpdate,
            city: city,
            godSt: godst,
            tip: tip,
            nazivFakulteka: faxid,
          });
          handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const profileData = () => {
    if (userRole == "Student") {
      axios
        .get("https://localhost:7199/Student/GetStudentById/" + userId, {
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
    } else if (userRole == "Professor") {
      axios
        .get("https://localhost:7199/Professor/GetById/" + userId, {
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
    }
  };

  const showGrades = () => {
    axios
      .get(
        "https://localhost:7199/Professor/ListRatingsOfCertainProfessor/" +
          userId
      )
      .then((res) => {
        setGrades(res.data);
      });
  };
  const showComms = () => {
    axios
      .get(
        "https://localhost:7199/Professor/ListCommentsOfCertainProfessor/" +
          userId
      )
      .then((res) => {
        setComms(res.data);
        console.log(res.data);
      });
  };
  useEffect(() => {
    profileData();
    fakulteti();
    if (userRole == "Student") {
      showDataS();
      //   showFax();
      //   postaviPrvi();
    } else {
      showDataP();
      showComms();
      showGrades();
      showPred();
      getPredmeti();
    }
  }, []);
  const deleteProf = (e) => {
    e.preventDefault();
    if (userRole == "Student") {
      axios
        .delete("https://localhost:7199/Student/DeleteStudent/" + userId, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res);
          window.localStorage.removeItem("token");
          console.log(token);
          window.location.reload();

          window.location = "/RegisterAndLoginPage";
        });
    }
    if (userRole == "Professor") {
      axios
        .delete("https://localhost:7199/Professor/DeleteProfessor/" + userId, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res);
          window.localStorage.removeItem("token");
          console.log(token);
          window.location.reload();

          window.location = "/RegisterAndLoginPage";
        });
    }
  };

  const t = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (t === null) navigate("/RegisterAndLoginPage", { replace: true });
  }, [t]);
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
        <div id="centriraj" className="dugmiciProfila">
          <ThemeProvider theme={theme}>
            <Button
              id="ChangeAccount"
              size="small"
              variant="outlined"
              color="neutral"
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                fontSize: 15,
                marginRight: "1rem",
              }}
              onClick={handleOpen}
            >
              Izmeni nalog
            </Button>
            <Button
              id="DeleteAccount"
              size="small"
              variant="outlined"
              color="neutral"
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                fontSize: 15,
                marginRight: "1rem",
              }}
              onClick={handleOpenObrisi}
            >
              Obriši nalog
            </Button>
            {userRole === "Profesor" ? (
              <Button
                id="bPrikaziRaspored"
                size="small"
                variant="outlined"
                color="neutral"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 1,
                  fontSize: 15,
                }}
                onClick={() => (window.location = "/Raspored")}
              >
                Prikazi raspored
              </Button>
            ) : (
              <></>
            )}
          </ThemeProvider>
        </div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <form
                onSubmit={(e) => {
                  changeProfileData(e);
                  window.location.reload(false);
                }}
              >
                <div className="profileModal">
                  <div className="profile-row">
                    <div className="profile-title">Ime</div>
                    <div className="profile-description" id="nameModal">
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="nameModal"
                          defaultValue={clan.name}
                          variant="standard"
                          size="small"
                          fullWidth
                        />
                      </ThemeProvider>
                    </div>
                    <div className="profile-title">Prezime</div>
                    <div className="profile-description" id="surenameModal">
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="surenameModal"
                          defaultValue={clan.surname}
                          variant="standard"
                          size="small"
                          fullWidth
                        />
                      </ThemeProvider>
                    </div>
                  </div>

                  <div className="profile-row">
                    <div className="profile-title">Username</div>
                    <div className="profile-description" id="usernameModal">
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="usernameModal"
                          defaultValue={clan.username}
                          variant="standard"
                          size="small"
                          fullWidth
                          disabled
                        />
                      </ThemeProvider>
                    </div>
                    <div className="profile-title">E-mail</div>
                    <div className="profile-description" id="emailModal">
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="emailModal"
                          defaultValue={clan.email}
                          variant="standard"
                          size="small"
                          fullWidth
                          disabled
                        />
                      </ThemeProvider>
                    </div>
                  </div>

                  <div className={dataS}>
                    <div className="profile-row">
                      <div className="profile-info">
                        <div className="profile-title">Naziv fakulteta</div>
                        <div id="faxModal">
                          <FormControl id="formctrl">
                            <ThemeProvider theme={theme}>
                              <Select
                                id="fakulteti"
                                variant="standard"
                                label="Izaberite fakultet"
                                value={faxid}
                                defaultValue={prvi}
                                onChange={postaviFakultet}
                                fullWidth
                              >
                                {fakultet.map((p) => {
                                  return (
                                    <MenuItem key={p.fid} value={p.fid}>
                                      {p.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </ThemeProvider>
                          </FormControl>
                        </div>
                      </div>

                      <div className="profile-info">
                        <div className="profile-title">Grad</div>
                        <div className="profile-description" id="gardModal">
                          <ThemeProvider theme={theme}>
                            <TextField
                              id="gardModal"
                              defaultValue={clan.city}
                              variant="standard"
                              size="small"
                              fullWidth
                            />
                          </ThemeProvider>
                        </div>
                      </div>
                    </div>

                    <div className="profile-row">
                      <div className="profile-info">
                        <div className="profile-title">Godina studija</div>
                        <div className="profile-description" id="godStModal">
                          <ThemeProvider theme={theme}>
                            <TextField
                              id="godStModal"
                              defaultValue={clan.godSt}
                              variant="standard"
                              size="small"
                              fullWidth
                              type="number"
                            />
                          </ThemeProvider>
                        </div>
                      </div>
                      <div className="profile-info">
                        <div className="profile-title">Tip studija</div>
                        <div className="profile-description">
                          <ThemeProvider theme={theme}>
                            <TextField
                              id="typeStModal"
                              defaultValue={clan.tip}
                              variant="standard"
                              size="small"
                              fullWidth
                            />
                          </ThemeProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={dataP}>
                  <div className="profile-row">
                    <div className="profile-info">
                      <div className="profile-title">Nastavno zvanje</div>
                      <div className="profile-description" id="zvanjeModal">
                        <ThemeProvider theme={theme}>
                          <TextField
                            id="zvanjeModal"
                            defaultValue={clan.nastavnoZ}
                            variant="standard"
                            size="small"
                            fullWidth
                          />
                        </ThemeProvider>
                      </div>
                    </div>
                    <div className="profile-row">
                      <div className="profile-info">
                        <div className="profile-title">Predmet</div>
                        <div className="profile-description" id="predModal">
                          <ThemeProvider theme={theme}>
                            <InputLabel id="filtersb">
                              Izaberite predmet
                            </InputLabel>
                            <Select
                              labelId="filtersb"
                              id="predmeti"
                              variant="standard"
                              label="Izaberite predmet"
                              fullWidth
                              value={predid}
                              onChange={postaviPredmet}
                            >
                              {predmeti.map((p) => {
                                return (
                                  <MenuItem key={p.id} value={p.id}>
                                    {p.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </ThemeProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="srediDugmice">
                  <ThemeProvider theme={theme}>
                    <Button
                      id="SaveChanges"
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
                      Sačuvaj izmene
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="neutral"
                      sx={{
                        fontWeight: "bold",
                        letterSpacing: 1,
                        fontSize: 15,
                      }}
                      onClick={handleClose}
                    >
                      Izađi
                    </Button>
                    <div className={styleAlert} id="nemaOglas">
                      <Alert severity="error">Vec ste uneli taj predmet!</Alert>
                    </div>
                  </ThemeProvider>
                </div>
              </form>
            </Box>
          </Fade>
        </Modal>



        <div id="ocene" className="recenzija">
          {Array.isArray(grades) && grades.length ? (
            grades.map((grade) => {
              return (
                <div className="cardG">
                  <div className="card-headerG">{grade.studentRate}</div>
                  <div className="card-bodyG">
                    <div className="card-titleG">
                      <p>Ocena: {grade.rateValue}</p>
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

      <div className="modal-dodaj-raspored">
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openObrisi}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openObrisi}>
            <Box sx={styleObisi}>
              <ThemeProvider theme={theme}>
                <form onSubmit={(e) => deleteProf(e)}>
                  <FormLabel id="dodaj-raspored">
                    Ocete da se obrisete? Obrisani ste...
                  </FormLabel>
                  {/* 
                  <TextField
                    id="usernameUnos"
                    fullWidth
                    label="Unesite username:"
                    variant="standard"
                    size="small"
                  />

                  <TextField
                    id="passUnos"
                    label="Unesite password:"
                    type="password"
                    variant="standard"
                    size="small"
                    fullWidth
                  />
                  */}
                  <Button
                    id="delete"
                    size="small"
                    variant="outlined"
                    color="neutral"
                    fullWidth
                    sx={{
                      fontWeight: "bold",
                      letterSpacing: 1,
                      fontSize: 15,
                    }}
                    type="submit"
                  >
                    OBRISI ME
                  </Button>
                </form>
              </ThemeProvider>
            </Box>
          </Fade>
        </Modal>
      </div>
    </section>
  );
};

export default Profilepage;
