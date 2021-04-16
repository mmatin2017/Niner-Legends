import React from "react";
import "../index.css";

export const Summoners = ({summoners}) => {



  return <div className="Home">{summoners.map(summoner => <div>{summoner.player}</div>)}</div>

};
   

    
