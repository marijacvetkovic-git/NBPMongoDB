import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdPage.css";
import {
  createTheme,
  Button,
  Select,
  ThemeProvider,
  InputLabel,
  MenuItem,
  Alert,
} from "@mui/material";

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
const token = localStorage.getItem("token");

const TutorAdPage = () => {
  const [ads, setAds] = useState([]);
  const [fads, setFAds] = useState([]);

  const [pr, setPredmet] = useState([]);
  const [styleAlert, changeAlert] = useState("sakrij");

  const [showAsd, setShowAds] = useState("show");
  const [showFAsd, setShowFAds] = useState("hide");

  const showAds = () => {
    setShowAds("show");
    setShowFAds("hide");
  };
  const showFAds = () => {
    setShowAds("hide");
    setShowFAds("show");
  };
  const showAlert = () => {
    changeAlert("prikazi");
  };
  const hideAlert = () => {
    changeAlert("sakrij");
  };
  const [predid, setPredid] = useState("");
  const postaviPredmet = (e) => {
    setPredid(e.target.value);
  };
  const getPredmeti = () => {
    axios.get("https://localhost:7199/Subject/GetSubjects/").then((res) => {
      setPredmet(res.data);
    });
  };

  const filter = (e) => {
    e.preventDefault();
    axios
      .get("https://localhost:7199/Filters/FilterAdTutor/" + predid, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status !== 202) {
          setFAds(res.data);
          showFAds();
          hideAlert();
        } else {
          showAlert();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios.get("https://localhost:7199/AdTutor/GetAdTutor/").then((res) => {
      setAds(res.data);
      getPredmeti();
    });
    showAds();
  }, []);

  return (
    <section className="tutorad">
      <div id="boxBig">
        <div id="barBig">
          <span className="bartitleBig"></span>
        </div>

        <div className="filters">
          <span className="adsfilterp">
            Odaberite kakve oglase za tutora želite da vidite:
          </span>
          <br />
          <br />
          <form id="formctrl" onSubmit={(e) => filter(e)}>
            <ThemeProvider theme={theme}>
              <InputLabel id="filtersb">Predmet</InputLabel>
              <Select
                labelId="filtersb"
                id="predmeti"
                variant="standard"
                label="Izaberite predmet"
                fullWidth
                value={predid}
                onChange={postaviPredmet}
              >
                {pr.map((p) => {
                  return (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  );
                })}
              </Select>
              <br />
              <br />
              <Button
                id="filtriraj"
                size="small"
                variant="outlined"
                color="neutral"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 1,
                  fontSize: 15,
                }}
                type="submit"
                form="formctrl"
              >
                Filtriraj
              </Button>
              <div className={styleAlert} id="nemaOglas">
                <Alert severity="error">Nema oglasa koje zahtevate!</Alert>
              </div>
            </ThemeProvider>
          </form>
        </div>
        <div className={showAsd}>
          {ads.map((ad) => {
            var datumic = new Date(ad.date);
            const velikiDatum = `${datumic.getDate()}/${
              datumic.getMonth() + 1
            }/${datumic.getFullYear()}  ${datumic.getHours()}:${datumic.getMinutes()}`;

            return (
              <div className="card" key={ad.id}>
                <div className="card-header">
                  <Link to={`/StudentProfilePage/${ad.studentAd}`}>
                    {ad.studentUsername}
                  </Link>
                  <p> {velikiDatum}</p>
                </div>
                <div className="card-body">
                  <div className="card-title">
                    <p>Predmet:{ad.subjectName},</p>
                  </div>
                  <p>
                    Ja sam na studijama:
                    {ad.typeOfStudies}
                  </p>
                  <p>I na ovoj sam godini: {ad.yearOfStudies}</p>
                  <br />
                  <p>{ad.summary}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={showFAsd}>
          {fads.map((ad) => {
            var datumic = new Date(ad.date);
            const velikiDatum = `${datumic.getDate()}/${
              datumic.getMonth() + 1
            }/${datumic.getFullYear()}  ${datumic.getHours()}:${datumic.getMinutes()}`;

            return (
              <div className="card" key={ad.id}>
                <div className="card-header">
                  <Link to={`/StudentProfilePage/${ad.studentId}`}>
                    {ad.studentUsername}
                  </Link>
                  ,<p> {velikiDatum}</p>
                </div>
                <div className="card-body">
                  <div className="card-title">
                    <p>Predmet:{ad.subjectName}</p>
                  </div>
                  <p>Tip studija: {ad.typeOfStudies}</p>
                  <p>Godina studija: {ad.yearOfStudies}</p>
                  <br />
                  <p>{ad.summary}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default TutorAdPage;
