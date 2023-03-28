import React, { useState, useEffect } from "react";

import axios from "axios";
import "../Ads/AdPage.css";
import { Link } from "react-router-dom";
import {
  createTheme,
  Button,
  Select,
  ThemeProvider,
  InputLabel,
  MenuItem,
  FormControl,
  Alert,
} from "@mui/material";

const ProfessorPage = () => {
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
  const [ads, setAds] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  const [fakulteti, setFakulteti] = useState([]);
  const [predid, setPredid] = useState("");
  const [disb, setDisb] = useState();
  const [pnaziv, setPnaziv] = useState("");
  const [faxid, setFaxid] = useState("");
  const [fnaziv, setFnaziv] = useState();
  const [styleAlert, changeAlert] = useState("hide");
  const showAlert = () => {
    changeAlert("show");
  };
  const hideAlert = () => {
    changeAlert("hide");
  };
  const promeniDrop = () => {
    setDisb(false);
  };
  const postaviPredmet = (e) => {
    setPredid(e.target.value);
    setPnaziv(predmeti.find((p) => p.id === e.target.value));
  };
  const postaviFakultet = (e) => {
    setFaxid(e.target.value);
    setFnaziv(fakulteti.find((p) => p.id === e.target.value));
  };
  const getFakulteti = () => {
    axios.get("https://localhost:7199/Faculty/GetFaculties/").then((res) => {
      setFakulteti(res.data);
    });
  };
  const showCertCoures = (e) => {
    axios.get("https://localhost:7199/Subject/GetSubjects/").then((res) => {
      setPredmeti(res.data);
    });
  };

  const filterProf = (e) => {
    setPredid(e.target.value);
    e.preventDefault();
    axios
      .get("https://localhost:7199/Filters/FiltersProfessor/" + predid)
      .then((res) => {
        console.log(res.status);
        if (res.status != 202) {
          setAds(res.data);
          hideAlert();
        } else {
          showAlert();
        }
      });
  };
  const [psubjs, setPsubjs] = useState([]);
  useEffect(() => {
    axios.get("https://localhost:7199/Professor/GetProfessors/").then((res) => {
      console.log(res.data);
      setAds(res.data);
    });

    getFakulteti();
    showCertCoures();
  }, []);

  return (
    <div id="boxBig">
      <div id="barBig">
        <span className="bartitleBig"></span>
      </div>
      <div className="filters">
        <form id="formctrl" onSubmit={(e) => filterProf(e)}>
          <span className="adsfilterp">Odaberite koji vam profesor treba:</span>

          <br />
          <br />
          {/* <FormControl id="formctrl">
            <ThemeProvider theme={theme}>
              <InputLabel id="filtersbfac" htmlFor="fakulteti">
                Izaberite fakultet
              </InputLabel>
              <Select
                labelId="filtersbfac"
                id="fakulteti"
                variant="standard"
                label="Izaberite fakultet"
                fullWidth
                value={faxid}
                onChange={(e) => {
                  postaviFakultet(e);
                  showCertCoures(e);
                }}
              >
                {fakulteti.map((p) => {
                  return (
                    <MenuItem key={p.fid} value={p.fid} onClick={promeniDrop}>
                      {p.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </ThemeProvider>
          </FormControl> */}
          <br />
          <br />
          <FormControl id="formctrl">
            <ThemeProvider theme={theme}>
              <InputLabel id="filtersb">Izaberite predmet</InputLabel>
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
          </FormControl>
        </form>
      </div>
      {ads.map((ad) => {
        return (
          <div className="card" key={ad.id}>
            <div className="card-header" key={ad.uid}>
              <Link to={`/ProfilePage/${ad.uid}`}>{ad.username}</Link>
            </div>
            <div className="card-body">
              <div className="card-title">
                <p>
                  Ime i prezime: {ad.name} {ad.surname}
                </p>
              </div>
              <p>Obrazovanje: {ad.education}</p>
              {/* <p>Prosecna ocena: {ad.professorRate.rateValue}</p> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ProfessorPage;
