import React, { useState, useEffect } from "react";
import "./AdPage.css";
import axios from "axios";

import { Link } from "react-router-dom";
import {
  createTheme,
  Button,
  ThemeProvider,
  TextField,
  Checkbox,
  FormControlLabel,
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

const RoomateAdPage = () => {
  const [ads, setAds] = useState([]);
  const [fads, setFAds] = useState([]);

  const [disb, setDisb] = useState(false, true);
  const [disbNum, setDisbNum] = useState(false, true);
  const [styleAlert, changeAlert] = useState("hide");

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
    changeAlert("show");
  };
  const hideAlert = () => {
    changeAlert("hide");
  };
  const promeniChecked = () => {
    setDisb(true);
  };
  const promenuNum = () => {
    setDisbNum(true);
  };
  const filter = (e) => {
    e.preventDefault();
    var grad = e.target.grad.value;
    var brojcimera = e.target.brcim.value;
    var stanCb = e.target.stan;
    var nbtCm = e.target.nbt;
    var stan;
    if (stanCb.checked) {
      stan = true;
    } else {
      stan = false;
    }
    if (nbtCm.checked) {
      brojcimera = 0;
    }
    axios
      .get(
        "https://localhost:7199/Filters/FilterAdRoommate/" +
          grad +
          "/" +
          brojcimera +
          "/" +
          stan
      )
      .then((res) => {
        console.log(res);
        if (res.status !== 202) {
          setFAds(res.data);
          showFAds();
          hideAlert();
        } else {
          showAlert();
        }
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    axios
      .get("https://localhost:7199/AdRoommate/GetAdsRoommate/")
      .then((res) => {
        setAds(res.data);
      });
    showAds();
  }, []);

  return (
    <section className="roomatead">
      <div id="boxBig">
        <div id="barBig">
          <span className="bartitleBig"></span>
        </div>

        <div className="filters">
          <form onSubmit={(e) => filter(e)}>
            <span className="adsfilterp">
              Odaberite kakve oglase za cimera želite da vidite:
            </span>

            <ThemeProvider theme={theme}>
              <TextField
                id="grad"
                label="Grad"
                variant="standard"
                size="small"
                fullWidth
              />
              <br />
              <br />
              <FormControlLabel
                control={<Checkbox id="stan" size="small" color="default" />}
                label="Tražite stan?"
              />
              <TextField
                id="brcim"
                onChange={promeniChecked}
                label="Broj cimera"
                type="number"
                disabled={disbNum}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, max: 10 },
                }}
                variant="standard"
              />
              <br />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    id="nbt"
                    size="small"
                    color="default"
                    disabled={disb}
                    onChange={promenuNum}
                  />
                }
                label="Broj cimera mi nije bitan"
              />

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
                  <Link to={`/StudentProfilePage/${ad.studentId}`}>
                    {ad.studentUsername}
                  </Link>
                  ,<p> {velikiDatum}</p>
                </div>
                <div className="card-body">
                  <div className="card-title">
                    <p>Grad:{ad.city},</p>
                  </div>
                  <p>
                    Imam stan: {ad.flat ? <span>Da</span> : <span>Ne</span>}
                  </p>
                  <p>Broj cimera: {ad.numberRoommate}</p>
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
                    <p>Grad:{ad.city},</p>
                  </div>
                  <p>
                    Imam stan: {ad.flat ? <span>Da</span> : <span>Ne</span>}
                  </p>
                  <p>Broj cimera: {ad.numberRoommate}</p>
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
export default RoomateAdPage;
