import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "../index.css";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import plot from "./plot.png";
console.log(plot);

export default function Analytics() {
  const [name, setName] = useState("");
  const [towerKills, setTowerKills] = useState("");
  const [firstBlood, setFirstBlood] = useState("");
  const [inhibitorKills, setInhibitorKills] = useState("");
  const [baronKills, setBaronKills] = useState("");
  const [dragonKills, setDragonKills] = useState("");
  const [state, setState] = useState({ data: {} });
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return name.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await axios
        .post("http://3349b54166d0.ngrok.io/prediction", {
          player_name: name,
          tower_kills: towerKills,
          firstblood: firstBlood,
          inhibitor_kills: inhibitorKills,
          baron_kills: baronKills,
          dragon_kills: dragonKills,
        })
        .then((res) => {
          console.log(res.data);
          setState(res.data);
          console.log(state);
        });
    } catch (event) {
      console.log(event);
      setIsLoading(false);
    }
  }

  function renderStats() {
    if (isLoading === true) {
      return (
        <ListGroup>
          <ListGroup.Item>Decision tree Classifier</ListGroup.Item>
          <ListGroup.Item>
            Predicted Outcome: {state.pred_outcome}
          </ListGroup.Item>
          <ListGroup.Item>
            Red Team Win Probability: {state.red_prob}%
          </ListGroup.Item>
          <ListGroup.Item>
            Blue Team Win Probability: {state.blue_prob}%
          </ListGroup.Item>
          <ListGroup.Item>
            Accuracy of Model: {state.accuracy * 100}%
          </ListGroup.Item>
          <ListGroup.Item>
            <img src={plot} alt="plot" />
          </ListGroup.Item>
        </ListGroup>
      );
    }
  }
  return (
    <div className="Login">
      <h3>Predict Outcome</h3>
      <p>Team: Red</p>

      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="name">
          <Form.Label>Enter Summoner Name</Form.Label>
          <Form.Control
            autoFocus
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="name">
          <Form.Label>Enter Tower Kills</Form.Label>
          <Form.Control
            type="name"
            value={towerKills}
            onChange={(e) => setTowerKills(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="name">
          <Form.Label>Enter First Blood</Form.Label>
          <Form.Control
            type="name"
            value={firstBlood}
            onChange={(e) => setFirstBlood(e.target.value)}
          />
          <Form.Group size="lg" controlId="name">
            <Form.Label>Enter Inhibitor Kills</Form.Label>
            <Form.Control
              type="name"
              value={inhibitorKills}
              onChange={(e) => setInhibitorKills(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="name">
            <Form.Label>Enter Baron Kills</Form.Label>
            <Form.Control
              type="name"
              value={baronKills}
              onChange={(e) => setBaronKills(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="name">
            <Form.Label>Enter Dragon Kills</Form.Label>
            <Form.Control
              type="name"
              value={dragonKills}
              onChange={(e) => setDragonKills(e.target.value)}
            />
          </Form.Group>
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
      {renderStats()}
    </div>
  );
}
