import React from "react";
import Summoner from "../components/Summoner";
import "../index.css";



export default function Home() {
  

  return (
    <div className="lander">
    <h1>Niner Legends</h1>
    <p className="text-muted">
      Competitive stat tracking for League of Legends
    </p>
    <Summoner/>
  </div>
  );
}
