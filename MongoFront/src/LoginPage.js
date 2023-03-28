import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  createTheme,
  ThemeProvider,
  TextField,
  Button,
  FormControl,
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

const LogInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [styleAlert, changeAlert] = useState("sakrij");
  const showAlert = () => {
    changeAlert("prikazi");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setUsernameError(false);
    setPasswordError(false);
    if (username == "") {
      setUsernameError(true);
    }
    if (password == "") {
      setPasswordError(true);
    }
  };
  const handleLogin = () => {
    console.log(username, password);
    axios
      .put("https://localhost:7199/api/Authenticate/Login/", {
        username,
        password,
      })
      .then((res) => {
        console.log("Getting from : ", res.data);
        if (res.data.token != undefined) {
          localStorage.setItem("token", res.data.token);
          window.location = "/Profilepage";
        } else console.log("nema sifra bato");

        return res.data.token;
      })
      .catch((err) => console.log(err.message));
  };
  return (
    <form
      className="fLogin"
      onSubmit={(e) => {
        handleLogin();
        handleSubmit(e);
      }}
    >
      <FormControl>
        <ThemeProvider theme={theme}>
          <TextField
            fullWidth
            id="fusernameLog"
            label="Korisničko ime"
            variant="standard"
            size="small"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            id="fpassword"
            label="Šifra"
            variant="standard"
            size="small"
            fullWidth
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <br />
          <br />
          <Button
            id="blogin"
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
            Prijavi se
          </Button>
          <div className={styleAlert} id="alertBanovan">
            <Alert severity="error">
              Banovani ste, prekršili ste uslove i pravila korišćenja! 🙁
            </Alert>
          </div>
        </ThemeProvider>
      </FormControl>
    </form>
  );
};
export default LogInPage;
