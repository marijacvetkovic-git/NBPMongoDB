import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { getUserId, getRole, getUsername } from "./utils";
import axios from "axios";

import {
  MenuItem,
  InputLabel,
  Select,
  ThemeProvider,
  TextField,
  RadioGroup,
  Radio,
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Modal,
  Backdrop,
  Fade,
  Box,
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

const HomePage = () => {
  const token = localStorage.getItem("token");
  const username = getUsername();
  const [idSB, setIdSB] = useState(null);
  const [idT, setIdT] = useState(null);
  const [stRoomate, changeAdRoomate] = useState("sakrij", "prikazi");
  const [stStuddyBuddy, changeAdSB] = useState("sakrij", "prikazi");
  const [stTutor, changeAdTutor] = useState("sakrij", "prikazi");
  //----------------------------
  const [open, setOpen] = useState(false);
  const [openSB, setOpenSB] = useState(false);
  const [openT, setOpenT] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenSB = () => setOpenSB(true);
  const handleOpenT = () => setOpenT(true);
  const handleClose = () => setOpen(false);
  const handleCloseSB = () => setOpenSB(false);
  const handleCloseT = () => setOpenT(false);
  //-------------------------------
  const [ads, setAds] = useState([]);
  const [predmet, setPredmet] = useState([]);
  const [styleAlert, changeAlert] = useState("sakrij");

  const showAlert = () => {
    changeAlert("prikazi");
  };
  const hideAlert = () => {
    changeAlert("sakrij");
  };

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
  const [fakulteti, setFakulteti] = useState([]);
  const getPredmeti = () => {
    axios.get("https://localhost:7199/Subject/GetSubjects/").then((res) => {
      console.log(res.data);

      setPredmet(res.data);
    });
  };
  const getFakulteti = () => {
    axios.get("https://localhost:7199/Faculty/GetFaculties").then((res) => {
      setFakulteti(res.data);
    });
  };
  const [predid, setPredid] = useState("");
  const [pnaziv, setPnaziv] = useState("");
  const postaviPredmet = (e) => {
    setPredid(e.target.value);
    setPnaziv(predmet.find((p) => p.id === e.target.value));
  };
  const [fakultetid, setFakultetid] = useState("");
  const [fnaziv, setFnaziv] = useState("");
  const postaviFakultet = (e) => {
    setFakultetid(e.target.value);
    console.log(e.target.value);

    // const imeF = fakulteti.find(
    //   (p) => p.fakultetId === e.target.value
    // ).fakultetNaziv;
    // getPredmeti(imeF);
    // setFnaziv(imeF);
  };
  const [id, setId] = useState(null);
  useEffect(() => {
    getFakulteti();
    getPredmeti();
  }, []);

  const showRoomate = () => {
    changeAdRoomate("prikazi");
    changeAdSB("sakrij");
    changeAdTutor("sakrij");
  };
  const showSB = () => {
    changeAdSB("prikazi");
    changeAdRoomate("sakrij");
    changeAdTutor("sakrij");
  };
  const showTutor = () => {
    changeAdTutor("prikazi");
    changeAdSB("sakrij");
    changeAdRoomate("sakrij");
  };
  const postAd = (e) => {
    e.preventDefault();
    var cimerr = e.target.rbHomeC;
    var sb = e.target.rbHomeSB;
    var tut = e.target.rbHomeT;
    var grad = e.target.fadcity.value;
    var cimer = parseInt(e.target.fadcim.value);
    var stan = e.target.fadstan;
    var stanic;
    var godstsb = e.target.fadgodstudija.value.toString();
    var opissb = e.target.placeForAdSB.value;
    var predmettut = e.target.fadpredmettut;
    var gossttut = e.target.fadgodstudtut.value.toString();
    var opistut = e.target.placeForAdTut.value;
    var ts = e.target.tStudies.value;
    var tstut = e.target.tStudiestut.value;
    var datum = new Date();
    var iduser = getUserId();

    if (stan.checked) {
      stanic = true;
    } else {
      stanic = false;
    }
    var opis = e.target.placeForAd.value;
    const coglas = {
      summary: opis,
      flat: stanic,
      city: grad,
      numberOfRoommates: cimer,
      studentId: iduser,
    };
    console.log(coglas);
    if (cimerr.checked) {
      axios
        .post("https://localhost:7199/AdRoommate/CreateNewAdRoommate", coglas, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((resp) => {
          console.log("Getting from:", resp.coglas);
          hideAlert();
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else if (sb.checked) {
      const sboglas = {
        summary: opissb,
        studentAd: iduser,
        yearOfStudies: godstsb,
        typeOfStudies: ts,
        subjectAdStudyBuddy: predid,
      };

      console.log(sboglas);
      axios
        .post("https://localhost:7199/AdSB/CreateAdStudyBuddy", sboglas, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((resp) => {
          console.log("Getting from:", resp.sboglas);
          hideAlert();
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else if (tut.checked) {
      const tutoglas = {
        summary: opistut,
        studentAd: iduser,
        yearOfStudies: gossttut,
        typeOfStudies: tstut,
        subjectAdTutor: predid,
      };
      console.log(iduser, opistut, datum, predmettut, gossttut);

      axios
        .post("https://localhost:7199/AdTutor/CreateAdTutor", tutoglas, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((resp) => {
          console.log("Getting from:", resp.tutoglas);
          hideAlert();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };
  var iduser = getUserId();

  const getAdRoom = (e) => {
    e.preventDefault();
    axios
      .get(
        "https://localhost:7199/Student/ListAllAdRoomatesByStudent/" + iduser
      )
      .then((res) => {
        console.log(res.status);
        console.log(res.data);
        if (res.status === 200) {
          setAds(
            res.data.map((ad) => {
              return {
                aid: ad.aid,
                city: ad.city,
                numberOfRoommates: ad.numberOfRoommates,
                summary: ad.summary,
                flat: ad.flat,
                date: ad.date,
              };
            })
          );

          hideAlert();
        } else {
          showAlert();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAdSB = (e) => {
    e.preventDefault();
    axios
      .get("https://localhost:7199/Student/ListAllAdSBByStudent/" + iduser)
      // {
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      .then((res) => {
        console.log(res.data);

        setAds(
          res.data.map((ad) => {
            return {
              aid: ad.aid,
              buddyStudije: ad.typeOfStudies,
              godinaStudija: ad.yearOfStudies,
              //predmetId: ad.predmetId,
              predmetBuddy: ad.subjectAdStudyBuddy,
              summary: ad.summary,
              date: ad.date,
            };
          })
        );
        hideAlert();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAdTut = (e) => {
    var st;
    axios
      .get("https://localhost:7199/Student/ListAllAdTutorByStudent/" + iduser)
      .then((res) => {
        console.log(res);

        setAds(
          res.data.map((ad) => {
            return {
              aid: ad.aid,
              tutorStudije: ad.typeOfStudies,
              godinaStudija: ad.yearOfStudies,
              predmetTutor: ad.subjectAdTutor,
              summary: ad.summary,
              date: ad.date,
            };
          })
        );

        hideAlert();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteAdRoom = (idOglasa) => {
    axios
      .delete(
        "https://localhost:7199/AdRoommate/DeleteAdRoommate/" + idOglasa,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res);

        setAds((ads) => ads.filter((ad) => ad.aid !== idOglasa));
      });
  };

  const deleteAdST = (idOglasa) => {
    axios
      .delete(
        "https://localhost:7199/AdSB/DeleteAdStudyBuddy/" + idOglasa
        // {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
      )
      .then((res) => {
        console.log(res);

        setAds((ads) => ads.filter((ad) => ad.aid !== idOglasa));
      });
  };

  const deleteAdT = (idOglasa) => {
    axios
      .delete("https://localhost:7199/AdTutor/DeleteAdTutor/" + idOglasa, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);

        setAds((ads) => ads.filter((ad) => ad.aid !== idOglasa));
      });
  };
  //--------------------------------
  const changeAd = (e) => {
    e.preventDefault();
    var brojCimeraUpdate = parseInt(e.target.brcUpdate.value);
    var opisUpdate = e.target.opUpdate.value;
    console.log(brojCimeraUpdate, opisUpdate, id);
    var gradUpdate = e.target.gradUpdate.value;
    var stanUpdate = e.target.stanUpdate;
    console.log(stanUpdate.value);
    var su;
    if (stanUpdate.checked) {
      su = true;
    } else {
      su = false;
    }
    console.log(su, gradUpdate);
    const ad = {
      aid: id,
      summary: opisUpdate,
      flat: su,
      city: gradUpdate,
      numberOfRoommates: brojCimeraUpdate,
      studentId: iduser,
    };
    console.log(ad);
    axios
      .put("https://localhost:7199/AdRoommate/UpdateAdRoommate/", ad, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        const index = ads.findIndex((ad) => ad.aid === id);
        const updatedAds = [...ads];
        updatedAds[index] = ad;
        setAds(updatedAds);
        console.log(ads);
        handleClose();

        getAdRoom();
      });
  };

  const changeAdStuddy = (e) => {
    e.preventDefault();
    var ts = e.target.tStudiesUpdate.value;
    var godinaStudijaSBUpdate = e.target.godinaStudijaSBUpdate.value;
    var opisUpdate = e.target.opisUpdate.value;

    const ad = {
      aid: idSB,
      summary: opisUpdate,
      studentAd: iduser,
      yearOfStudies: godinaStudijaSBUpdate,
      typeOfStudies: ts,
    };
    console.log(ad);
    axios
      .put("https://localhost:7199/AdSB/UpdateAdStudyBuddy/", ad, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        const index = ads.findIndex((ad) => ad.aid === idSB);
        const updatedAds = [...ads];
        updatedAds[index] = ad;
        setAds(updatedAds);
        handleClose();
        getAdSB();
      });
  };
  const changeAdT = (e) => {
    console.log(idT);
    e.preventDefault();

    var godinaStudijaTUpdate = e.target.godinaStudijaTUpdate.value;
    var ts = e.target.tstutUpdate.value;
    var opisUpdate = e.target.opUpdate.value;

    const ad = {
      aid: idT,
      summary: opisUpdate,
      yearOfStudies: godinaStudijaTUpdate,
      typeOfStudies: ts,
    };

    console.log(ad);

    axios
      .put("https://localhost:7199/AdTutor/UpdateAdTutor/", ad, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        const index = ads.findIndex((ad) => ad.aid === idT);
        const updatedAds = [...ads];
        updatedAds[index] = ad;
        setAds(updatedAds);
        console.log(ads);
        handleClose();
        getAdTut();
      });
  };

  //--------------------------------------------

  return (
    <>
      <section className="HomePage">
        <div id="boxBig">
          <div id="barBig">
            <span className="bartitleBig"></span>
          </div>
          <div className="divad" id="centriraj">
            <form id="publishRoomateAd" onSubmit={(e) => postAd(e)}>
              <div id="izaberiAd">
                <ThemeProvider theme={theme}>
                  <FormLabel id="hp-demo-radio-buttons-group-label">
                    Izaberite tip oglasa koji želite da postavite
                  </FormLabel>
                  <RadioGroup
                    id="izboroglasa"
                    row
                    aria-labelledby="hp-access-demo-row-radio-buttons-group-label"
                    name="hp-access-row-radio-buttons-group"
                  >
                    <FormControlLabel
                      control={
                        <Radio
                          value="cimer"
                          onClick={showRoomate}
                          id="rbHomeC"
                          sx={{
                            color: grey[800],
                            "&.Mui-checked": {
                              color: grey[600],
                            },
                          }}
                        />
                      }
                      label="Cimer"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          value="sb"
                          id="rbHomeSB"
                          onClick={showSB}
                          sx={{
                            color: grey[800],
                            "&.Mui-checked": {
                              color: grey[600],
                            },
                          }}
                        />
                      }
                      label="Study Buddy"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          value="tutor"
                          id="rbHomeT"
                          onClick={showTutor}
                          sx={{
                            color: grey[800],
                            "&.Mui-checked": {
                              color: grey[600],
                            },
                          }}
                        />
                      }
                      label="Tutor"
                    />
                  </RadioGroup>
                </ThemeProvider>
              </div>
              <div className={stRoomate}>
                <ThemeProvider theme={theme}>
                  <TextField
                    id="fadcity"
                    fullWidth
                    label="Unesite grad"
                    variant="standard"
                    size="small"
                  />
                  <br />
                  <TextField
                    id="fadcim"
                    label="Unesite koliko cimera tražite"
                    type="number"
                    fullWidth
                    InputProps={{
                      inputProps: { min: 0, max: 10 },
                    }}
                    variant="standard"
                  />
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox id="fadstan" size="small" color="default" />
                    }
                    label="Imam stan"
                  />
                  <br />
                  <TextField
                    multiline
                    id="placeForAd"
                    label="Unesite opis oglasa"
                    size="small"
                    fullWidth
                    variant="outlined"
                    minRows={5}
                  />
                  <br />
                  <br />
                  <Button
                    id="bobjavi"
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
                    Objavi
                  </Button>
                </ThemeProvider>
              </div>
              <div className={stStuddyBuddy}>
                <ThemeProvider theme={theme}>
                  <FormLabel id="sbstudies-row-radio-buttons-group-label">
                    Tip studija
                  </FormLabel>
                  <TextField
                    id="tStudies"
                    fullWidth
                    label="Unesite tip studija"
                    variant="standard"
                    size="small"
                  />
                  <InputLabel id="addadsb">Izaberite fakultet</InputLabel>
                  <Select
                    labelId="addadsb"
                    id="fadpredmetsb"
                    variant="standard"
                    label="Izaberite predmet"
                    fullWidth
                    value={fakultetid}
                    onChange={postaviFakultet}
                  >
                    {Array.isArray(fakulteti) && fakulteti.length ? (
                      fakulteti.map((p) => {
                        return (
                          <MenuItem key={p.fid} value={p.fid}>
                            {p.name}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Select>
                  <InputLabel id="addadsb">Izaberite predmet</InputLabel>
                  <Select
                    labelId="addadsb"
                    id="fadpredmetsb"
                    variant="standard"
                    label="Izaberite predmet"
                    fullWidth
                    value={predid}
                    onChange={postaviPredmet}
                  >
                    {predmet.map((p) => {
                      return (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      );
                    })}
                  </Select>

                  <TextField
                    id="fadgodstudija"
                    label="Godina studija"
                    type="number"
                    fullWidth
                    InputProps={{
                      inputProps: { min: 1, max: 5 },
                    }}
                    variant="standard"
                  />
                  <br />
                  <br />
                  <TextField
                    multiline
                    id="placeForAdSB"
                    label="Unesite opis oglasa"
                    size="small"
                    fullWidth
                    variant="outlined"
                    minRows={5}
                  />
                  <br />
                  <br />
                  <Button
                    id="bobjavi"
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
                    Objavi
                  </Button>
                </ThemeProvider>
              </div>
              <div className={stTutor}>
                <ThemeProvider theme={theme}>
                  <FormLabel id="tstudies-row-radio-buttons-group-label">
                    Tip studija
                  </FormLabel>
                  <TextField
                    id="tStudiestut"
                    fullWidth
                    label="Unesite tip studija"
                    variant="standard"
                    size="small"
                  />
                  <InputLabel id="addadsb">Izaberite fakultet</InputLabel>
                  <Select
                    labelId="addadsb"
                    id="fadpredmetsb"
                    variant="standard"
                    label="Izaberite predmet"
                    fullWidth
                    value={fakultetid}
                    onChange={postaviFakultet}
                  >
                    {Array.isArray(fakulteti) && fakulteti.length ? (
                      fakulteti.map((p) => {
                        return (
                          <MenuItem key={p.fid} value={p.fid}>
                            {p.name}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Select>
                  <InputLabel id="addadsb">Izaberite predmet</InputLabel>
                  <Select
                    labelId="addadsb"
                    id="fadpredmetsb"
                    variant="standard"
                    label="Izaberite predmet"
                    fullWidth
                    value={predid}
                    onChange={postaviPredmet}
                  >
                    {predmet.map((p) => {
                      return (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <TextField
                    id="fadgodstudtut"
                    label="Godina studija"
                    type="number"
                    fullWidth
                    InputProps={{
                      inputProps: { min: 1, max: 5 },
                    }}
                    variant="standard"
                  />
                  <br />
                  <br />
                  <TextField
                    multiline
                    fullWidth
                    id="placeForAdTut"
                    label="Unesite opis oglasa"
                    size="small"
                    variant="outlined"
                    minRows={5}
                  />
                  <br />
                  <br />
                  <Button
                    id="bobjavi"
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
                    Objavi
                  </Button>
                </ThemeProvider>
              </div>
            </form>
          </div>
          <div id="centriraj" className="AdNavi">
            <ThemeProvider theme={theme}>
              <FormLabel id="og-demo-radio-buttons-group-label">
                Odaberite Vaše oglase koje želite da vidite:
              </FormLabel>
              <br />
              <br />
              <div id="oglasiprikazdugmici">
                <Button
                  id="showurads1"
                  size="small"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    fontWeight: "bold",
                    fontSize: 11,
                  }}
                  onClick={(e) => getAdRoom(e)}
                >
                  cimer
                </Button>

                <Button
                  id="showurads2"
                  size="small"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    fontWeight: "bold",
                    fontSize: 11,
                  }}
                  onClick={(e) => getAdSB(e)}
                >
                  study buddy
                </Button>

                <Button
                  id="showurads3"
                  size="small"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    fontWeight: "bold",
                    fontSize: 11,
                  }}
                  onClick={(e) => getAdTut(e)}
                >
                  tutor
                </Button>
              </div>
            </ThemeProvider>
          </div>
          <div className={styleAlert} id="nemaOglas">
            <Alert severity="error">Niste objavili ovakve oglase!</Alert>
          </div>

          {ads.map((ad) => {
            var datumic = new Date(ad.date);
            const velikiDatum = `${datumic.getDate()}/${
              datumic.getMonth() + 1
            }/${datumic.getFullYear()}  ${datumic.getHours()}:${datumic.getMinutes()}`;
            return (
              <div className="nekiDiv" key={ad.aid}>
                <div className="card">
                  <div className="card-header">{velikiDatum}</div>
                  <div className="card-body">
                    <div className="card-title">
                      {ad.city ? (
                        <>
                          <p>Grad:{ad.city},</p>
                          <p>
                            Imam stan:
                            {ad.flat ? <span>Da</span> : <span>Ne</span>}
                          </p>
                          <p>Broj cimera: {ad.numberOfRoommates}</p>
                        </>
                      ) : (
                        <></>
                      )}
                      {ad.buddyStudije ? (
                        <>
                          <p>Tip studija: {ad.buddyStudije}</p>
                          <p>Godina studija: {ad.godinaStudija}</p>
                          <p>Predmet: {ad.predmetBuddy}</p>
                        </>
                      ) : (
                        <></>
                      )}
                      {ad.tutorStudije ? (
                        <>
                          <p>Tip studija : {ad.tutorStudije}</p>
                          <p>Godina studija: {ad.godinaStudija}</p>
                          <p>Predmet: {ad.predmetTutor}</p>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>

                    <br />
                    <p>{ad.summary}</p>
                  </div>
                </div>
                {ad.city ? (
                  <div className="dugmad">
                    <ThemeProvider theme={theme}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="neutral"
                        sx={{
                          fontWeight: "bold",
                          fontSize: 11,
                        }}
                        onClick={() => {
                          setId(ad.aid);

                          handleOpen();
                        }}
                        type="submit"
                      >
                        Izmeni
                      </Button>

                      <br />
                      <br />
                      <Button
                        size="small"
                        fillAdsSB
                        variant="outlined"
                        color="neutral"
                        sx={{
                          fontWeight: "bold",
                          fontSize: 11,
                        }}
                        onClick={() => deleteAdRoom(ad.aid)}
                      >
                        Obriši
                      </Button>
                    </ThemeProvider>
                  </div>
                ) : (
                  <></>
                )}
                {ad.buddyStudije ? (
                  <div className="dugmad">
                    <ThemeProvider theme={theme}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="neutral"
                        sx={{
                          fontWeight: "bold",
                          fontSize: 11,
                        }}
                        onClick={() => {
                          setIdSB(ad.aid);

                          handleOpenSB();
                        }}
                        type="submit"
                      >
                        Izmeni
                      </Button>

                      <br />
                      <br />
                      <Button
                        size="small"
                        variant="outlined"
                        color="neutral"
                        sx={{
                          fontWeight: "bold",
                          fontSize: 11,
                        }}
                        onClick={() => deleteAdST(ad.aid)}
                      >
                        Obriši
                      </Button>
                    </ThemeProvider>
                  </div>
                ) : (
                  <></>
                )}
                {ad.tutorStudije ? (
                  <div className="dugmad">
                    <ThemeProvider theme={theme}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="neutral"
                        sx={{
                          fontWeight: "bold",
                          fontSize: 11,
                        }}
                        onClick={() => {
                          setIdT(ad.aid);

                          handleOpenT();
                        }}
                        type="submit"
                      >
                        Izmeni
                      </Button>

                      <br />
                      <br />
                      <Button
                        size="small"
                        variant="outlined"
                        color="neutral"
                        sx={{
                          fontWeight: "bold",
                          fontSize: 11,
                        }}
                        onClick={() => deleteAdT(ad.aid)}
                      >
                        Obriši
                      </Button>
                    </ThemeProvider>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>

        <div className="modal-izmena">
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
                    changeAd(e);
                  }}
                >
                  <ThemeProvider theme={theme}>
                    <br />

                    <TextField
                      id="gradUpdate"
                      fullWidth
                      label="Unesite grad"
                      variant="standard"
                      size="small"
                    />
                    <br />
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="stanUpdate"
                          size="small"
                          color="default"
                        />
                      }
                      label="Imam stan"
                    />
                    <br />
                    <TextField
                      id="brcUpdate"
                      label="Unesite koliko cimera tražite"
                      type="number"
                      fullWidth
                      InputProps={{
                        inputProps: { min: 0, max: 10 },
                      }}
                      variant="standard"
                    />
                    <br />

                    <br />
                    <TextField
                      multiline
                      id="opUpdate"
                      label="Unesite opis oglasa"
                      size="small"
                      fullWidth
                      variant="outlined"
                      minRows={5}
                    />
                    <br />
                    <br />
                    <Button
                      id="bobjavi"
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
                      value={id}
                    >
                      Objavi
                    </Button>
                    <Button
                      id="izadji"
                      size="small"
                      variant="outlined"
                      color="neutral"
                      fullWidth
                      sx={{
                        fontWeight: "bold",
                        letterSpacing: 1,
                        fontSize: 15,
                      }}
                      onClick={handleClose}
                    >
                      Otkazi
                    </Button>
                  </ThemeProvider>
                </form>
              </Box>
            </Fade>
          </Modal>
        </div>
        <div className="modal-izmena-study">
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openSB}
            onClose={handleCloseSB}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openSB}>
              <Box sx={style}>
                <form
                  onSubmit={(e) => {
                    changeAdStuddy(e);
                  }}
                >
                  <ThemeProvider theme={theme}>
                    <br />
                    <TextField
                      multiline
                      id="tStudiesUpdate"
                      label="Unesite tip studija"
                      size="small"
                      fullWidth
                      variant="outlined"
                    />

                    <TextField
                      id="godinaStudijaSBUpdate"
                      label="Godina studija"
                      type="number"
                      fullWidth
                      InputProps={{
                        inputProps: { min: 1, max: 5 },
                      }}
                      variant="standard"
                    />
                    <br />
                    <br />
                    <TextField
                      multiline
                      id="opisUpdate"
                      label="Unesite opis oglasa"
                      size="small"
                      fullWidth
                      variant="outlined"
                      minRows={5}
                    />
                    <br />
                    <br />
                    <Button
                      id="bobjavi"
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
                      onClick={handleCloseSB}
                      value={idSB}
                    >
                      Objavi
                    </Button>
                  </ThemeProvider>
                </form>
              </Box>
            </Fade>
          </Modal>
        </div>
        <div className="modal-izmena-tutor">
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openT}
            onClose={handleCloseT}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openT}>
              <Box sx={style}>
                <form
                  onSubmit={(e) => {
                    changeAdT(e);
                  }}
                >
                  <ThemeProvider theme={theme}>
                    <br />

                    <FormLabel id="sbstudies-row-radio-buttons-group-label">
                      Tip studija tutora
                    </FormLabel>
                    <TextField
                      multiline
                      id="tstutUpdate"
                      label="Unesite tip studija"
                      size="small"
                      fullWidth
                      variant="outlined"
                    />

                    <TextField
                      id="godinaStudijaTUpdate"
                      label="Godina studija"
                      type="number"
                      fullWidth
                      InputProps={{
                        inputProps: { min: 1, max: 5 },
                      }}
                      variant="standard"
                    />
                    <br />
                    <br />
                    <TextField
                      multiline
                      id="opUpdate"
                      label="Unesite opis oglasa"
                      size="small"
                      fullWidth
                      variant="outlined"
                      minRows={5}
                    />
                    <br />
                    <br />
                    <Button
                      id="bobjavi"
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
                      value={idT}
                      onClick={handleCloseT}
                    >
                      Objavi
                    </Button>
                  </ThemeProvider>
                </form>
              </Box>
            </Fade>
          </Modal>
        </div>
      </section>
    </>
  );
};
export default HomePage;
