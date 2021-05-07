import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "../index.css";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";

export default function Home() {
  const [gameID, setGameID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(true);

  function validateForm() {
    return gameID.length > 0;
  }

  //This handles the submit
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // posting the name
      await axios
        .post("http://7ae43471d963.ngrok.io/id", { GameID: gameID })
        .then()
        .catch((err) => console.error(err))
        .finally(() => {});

      await axios
        .get("http://7ae43471d963.ngrok.io/matches")
        .then((res) => {
          console.log(res.data);
          setState(res.data.Matches);

          console.log(state.Matches[0].Details.participants[0]);
          console.log(state.Matches[0].GameID);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
          setLoading(false);
        });
    } catch (event) {
      console.log(event);
      setIsLoading(false);
    }
  }

  function renderList() {
    if (loading === true) {
      return <h4>Enter GameID</h4>;
    } else {
      return (
        <div className="Login">
          <h1>Matches</h1>
          <h3 style={{ color: "#348ceb" }}>Win</h3>
          <h3 style={{ color: "#800919" }}>Loss</h3>

          <ListGroup variant="">
            {state.map((mObj) => (
              <ListGroup.Item key={mObj.GameID}>
                {"Match ID: "}
                {mObj.GameID}
                <br />

                <div>
                  {mObj.Details.teams.map((sub) => (
                    <div
                      key={sub.FirstBlood}
                      style={
                        sub.Win.toString() === "Win"
                          ? { color: "#348ceb" }
                          : { color: "#800919" }
                      }
                    >
                      <div>
                        {"Team: "}
                        {sub.Team}
                      </div>

                      <div>
                        {"Win: "}
                        {sub.Win}
                      </div>

                      <div>
                        {"Baron Kills: "}
                        {sub.BaronKills}
                      </div>

                      <div>
                        {"Dragon Kills: "}
                        {sub.DragonKills}
                      </div>

                      <div>
                        {"First Blood: "}
                        {sub.FirstBlood.toString()}
                      </div>

                      <div>
                        {"Inhibitor Kills: "}
                        {sub.InhibitorKills}
                      </div>

                      <div>
                        {"Tower Kills: "}
                        {sub.TowerKills}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {mObj.Details.participants.map((sub) => (
                    <div
                      key={sub.totalDamageDealt}
                      style={
                        sub.win.toString() === "true"
                          ? { color: "#348ceb" }
                          : { color: "#800919" }
                      }
                    >
                      {"Champion: "}
                      {sub.champion}

                      <div>
                        {"Champion Level: "}
                        {sub.champLevel}
                      </div>

                      <div>
                        {"Win: "}
                        {sub.win.toString()}
                      </div>

                      <div>
                        {"Item 1 : "}
                        {sub.Item1}{" "}
                      </div>

                      <div>
                        {"Item 2 : "}
                        {sub.Item2}{" "}
                      </div>

                      <div>
                        {"Item 3 : "}
                        {sub.Item3}{" "}
                      </div>

                      <div>
                        {"Item 4 : "}
                        {sub.Item4}{" "}
                      </div>

                      <div>
                        {"Item 5 : "}
                        {sub.Item5}{" "}
                      </div>

                      <div>
                        {"Item 6 : "}
                        {sub.Item6}{" "}
                      </div>

                      <div>
                        {"Items 7 : "}
                        {sub.Item7}{" "}
                      </div>

                      {" Keystone: "}
                      {sub.KeyStone}

                      <div>
                        {"Primary 1: "}
                        {sub.Primary1}
                      </div>

                      <div>
                        {"Primary 2: "}
                        {sub.Primary2}
                      </div>

                      <div>
                        {"Primary 3: "}
                        {sub.Primary3}
                      </div>

                      <div>
                        {"Secondary 1: "}
                        {sub.Secondary1}
                      </div>

                      <div>
                        {"Secondary 2: "}
                        {sub.Secondary2}{" "}
                      </div>

                      <div>
                        {"Kills: "}
                        {sub.kills}
                      </div>

                      <div>
                        {"Deaths: "}
                        {sub.deaths}
                      </div>

                      <div>
                        {"Assists: "}
                        {sub.assists}
                      </div>

                      <div>
                        {"Gold Earned: "}
                        {sub.goldEarned}
                      </div>

                      <div>
                        {"Total Damage Dealt: "}
                        {sub.totalDamageDealt}
                      </div>

                      <div>
                        {"Total Minions Killed: "}
                        {sub.totalMinionsKilled}
                      </div>
                    </div>
                  ))}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="lander">
        <h1>Niner Legends</h1>
        <p className="text-muted">
          Competitive stat tracking for League of Legends
        </p>
      </div>
      <div className="Login">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="name">
            <Form.Label>Enter Game ID</Form.Label>
            <Form.Control
              autoFocus
              type="name"
              value={gameID}
              onChange={(e) => setGameID(e.target.value)}
            />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Submit
          </LoaderButton>
        </Form>
      </div>
      {renderList()}
    </div>
  );
}
