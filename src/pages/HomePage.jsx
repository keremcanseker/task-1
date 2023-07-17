import React from "react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../userContext";
import { set } from "mongoose";

export default function HomePage() {
  const { isLogged, setIsLogged } = useContext(UserContext);
  function logout() {
    fetch(process.env.API_ENDPOINT + "/logout", {
      credentials: "include",
      method: "POST",
    });
    setIsLogged(false);
  }
  return (
    <main>
      <h1>HOME PAGE</h1>

      {!isLogged && (
        <div className="login__register">
          <Link to="/login">LOGIN</Link>
          <Link to="/register">REGISTER</Link>
        </div>
      )}
      {isLogged && (
        <div>
          <h1>WELCOME</h1>
          <button onClick={logout}>LOGOUT</button>
        </div>
      )}
    </main>
  );
}
