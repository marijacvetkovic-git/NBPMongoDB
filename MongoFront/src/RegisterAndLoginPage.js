import React, { useState, useEffect } from "react";
import "./Register&LoginPage.css";
import "./HomePage.css";
import LogInPage from "./LoginPage";

import axios from "axios";
import {
  FormControl,
  createTheme,
  ThemeProvider,
  TextField,
  RadioGroup,
  Radio,
  Button,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Alert,
} from "@mui/material";
import { grey } from "@mui/material/colors";

const RegisterAndLogin = () => {
  const [styleAlert, changeAlert] = useState("sakrij");

  const showAlert = () => {
    changeAlert("prikazi");
  };
  const [styleLogin, changeLogin] = useState("login1", "register2");
  const showLogin = () => {
    changeRegister("register1");
    changeLogin("login2");
  };

  const [styleRegister, changeRegister] = useState("register1", "login2");
  const showRegister = () => {
    changeRegister("register2");
    changeLogin("login1");
  };

  const [RegisterProfessor, changeProfessor] = useState(
    "register1",
    "register2"
  );
  const [registerEveryone, changeEveryone] = useState("register1", "register2");
  const showProfessor = () => {
    changeStudent("register1");
    changeProfessor("register2");
    changeEveryone("register2");
  };

  const [RegisterStudent, changeStudent] = useState("register1", "register2");
  const showStudent = () => {
    changeStudent("register2");
    changeProfessor("register1");
    changeEveryone("register2");
  };

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
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [faculty, setFaculty] = useState("");
  const [city, setCity] = useState("");
  const [stype, setStudyType] = useState("");
  const [nastavnoZvanje, setNastavnoZvanje] = useState("");

  const dataGet = (e) => {
    e.preventDefault();

    var name = e.target.fname.value;
    var surname = e.target.fsurname.value;
    var email = e.target.femail.value;
    var pass = e.target.fmakepswd.value;
    var prof = e.target.toggleprofessor;
    var username = e.target.fusername.value;
    var grad = e.target.fcity.value;
    var ulogica;

    if (prof.checked) {
      var nastavno = e.target.fnastavnozvanje.value;
      ulogica = 1;
      const i = {
        name: name,
        surname: surname,
        email: email,
        username: username,
        password: pass,
        education: nastavno,
      };
      console.log(i);
      axios
        .post("https://localhost:7199/Professor/CreateNewProfessor/", i)
        .then((res) => {
          console.log("Getting from : ", res.i);
          showAlert();
        })
        .catch((err) => console.log(err.message));
      //  }
    } else {
      var godinas = e.target.fyear.value;
      var tip = e.target.stype.value;

      ulogica = 0;

      const i = {
        name: name,
        surname: surname,
        email: email,
        username: username,
        password: pass,
        city: grad,
        yearOfStudies: godinas,
        typeOfStudies: tip,
        facultyStudent: faxid,
      };
      console.log(faxid);
      axios
        .post("https://localhost:7199/Student/CreateStudent/", i)
        .then((res) => {
          console.log("Getting from : ", res.i);
          console.log(res.data);
          showAlert();
        })
        .catch((err) => console.log(err.message));
    }
  };
  const [fax, setFax] = useState("");
  const [faxid, setFaxid] = useState("");
  const postaviFakultet = (e) => {
    setFaxid(e.target.value);
    setFax(fakultet.find((p) => p.fid === e.target.value));
  };
  const [fakultet, setFakultet] = useState([]);
  const fakulteti = () => {
    axios.get("https://localhost:7199/Faculty/GetFaculties/").then((res) => {
      setFakultet(res.data);
    });
  };
  useEffect(() => {
    fakulteti();
  }, []);
  return (
    <section className="RAndL">
      <div id="boxRAndL">
        <div id="barRAndL">
          <span className="bartitle">
            <span id="cregister" className={styleRegister}>
              Registracija
            </span>
            <span id="clogin" className={styleLogin}>
              Prijavljivanje
            </span>
          </span>
        </div>
        <div id="obeForme">
          <div id="changeAccess">
            <ThemeProvider theme={theme}>
              <div id="pickAccess">
                <RadioGroup
                  row
                  aria-labelledby="access-demo-row-radio-buttons-group-label"
                  name="access-row-radio-buttons-group"
                >
                  <FormControlLabel
                    value="register"
                    id="rbRegister"
                    control={
                      <Radio
                        onClick={showRegister}
                        sx={{
                          color: grey[800],
                          "&.Mui-checked": {
                            color: grey[600],
                          },
                        }}
                      />
                    }
                    label="Registrujte se"
                  />
                  <FormControlLabel
                    id="rbLogin"
                    value="login"
                    control={
                      <Radio
                        onClick={showLogin}
                        sx={{
                          color: grey[800],
                          "&.Mui-checked": {
                            color: grey[600],
                          },
                        }}
                      />
                    }
                    label="Prijavite se"
                  />
                </RadioGroup>
              </div>
            </ThemeProvider>
            <form onSubmit={(e) => dataGet(e)} className={styleRegister}>
              <div className={styleRegister} id="DRegister">
                <ThemeProvider theme={theme}>
                  <div id="toggleAccess">
                    <FormLabel id="toggle-r-controlled-radio-buttons-group">
                      Odaberite tip člana
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="toggle-r-demo-row-radio-buttons-group-label"
                      name="toggle-r-row-radio-buttons-group"
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            value="Student"
                            id="togglestudent"
                            onClick={showStudent}
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Student"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            id="toggleprofessor"
                            value="Professor"
                            onClick={showProfessor}
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Profesor"
                      />
                    </RadioGroup>
                  </div>

                  <div className={registerEveryone}>
                    <TextField
                      id="fname"
                      label="Ime"
                      variant="standard"
                      size="small"
                      value={name}
                      fullWidth
                      onChange={(event) => setName(event.target.value)}
                    />
                    <TextField
                      id="fsurname"
                      label="Prezime"
                      variant="standard"
                      size="small"
                      value={surname}
                      fullWidth
                      onChange={(event) => setSurname(event.target.value)}
                    />
                    <TextField
                      id="fusername"
                      label="Korisničko ime"
                      variant="standard"
                      size="small"
                      value={username}
                      fullWidth
                      onChange={(event) => setUsername(event.target.value)}
                    />
                    <TextField
                      id="femail"
                      label="E-mail adresa"
                      variant="standard"
                      size="small"
                      value={email}
                      fullWidth
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <TextField
                      id="fmakepswd"
                      label="Šifra"
                      type="password"
                      size="small"
                      variant="standard"
                      value={password}
                      fullWidth
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <br />
                  </div>
                  <div className={RegisterStudent} id="fRegisterStudent">
                    <ThemeProvider theme={theme}>
                      <InputLabel id="faxprof">Izaberite fakultet</InputLabel>
                      <Select
                        id="faxprof"
                        variant="standard"
                        label="Izaberite fakultet"
                        value={faxid}
                        onChange={(e) => {
                          postaviFakultet(e);
                        }}
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
                    <TextField
                      id="fcity"
                      label="Naziv grada"
                      variant="standard"
                      size="small"
                      value={city}
                      fullWidth
                      onChange={(event) => setCity(event.target.value)}
                    />
                    <TextField
                      id="stype"
                      label="Tip studija"
                      fullWidth
                      variant="standard"
                      onChange={(event) => setStudyType(event.target.value)}
                    />

                    <TextField
                      id="fyear"
                      label="Godina studija"
                      type="number"
                      fullWidth
                      InputProps={{
                        inputProps: { min: 1, max: 5 },
                      }}
                      variant="standard"
                    />

                    <Button
                      id="submitregistration"
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
                      Registruj se
                    </Button>

                    <br />
                    <br />
                  </div>
                  <div className={RegisterProfessor} id="fRegisterProfessor">
                    <TextField
                      id="fnastavnozvanje"
                      label="Nastavno zvanje"
                      variant="standard"
                      size="small"
                      value={nastavnoZvanje}
                      fullWidth
                      onChange={(event) =>
                        setNastavnoZvanje(event.target.value)
                      }
                    />

                    <Button
                      id="submitregistration"
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
                      Registruj se
                    </Button>
                  </div>
                </ThemeProvider>
              </div>
            </form>
            <div className={styleAlert} id="ima">
              <Alert severity="success">Uspesno ste se registrovali!</Alert>
            </div>
          </div>

          <div className={styleLogin} id="DLogin">
            <LogInPage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterAndLogin;
