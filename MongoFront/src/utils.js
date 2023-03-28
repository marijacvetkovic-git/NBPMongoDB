export function parseJwt(token) {
  if (token == null) {
    return;
  }
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
export function getUsername() {
  var user = localStorage.getItem("token");
  if (user == null) {
    return;
  }
  const name =
    parseJwt(user)[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    ];

  return name;
}
export function getRole() {
  var user = localStorage.getItem("token");
  if (user == null) {
    return;
  }
  const role =
    parseJwt(user)[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  return role;
}
export function getUserId() {
  var user = localStorage.getItem("token");
  if (user == null) {
    return;
  }
  const id =
    parseJwt(user)[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];
  return id;
}
export function getIsBanned() {
  var user = localStorage.getItem("token");
  if (user == null) {
    return;
  }
  const id =
    parseJwt(user)[
      "http://schemas.xmlsoap.org/ws/2009/09/identity/claims/actor"
    ];
  return id;
}
export function getExp() {
  var user = localStorage.getItem("token");
  if (user == null) {
    return;
  }
  const id =
    parseJwt(user)[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration"
    ];
  return id;
}
