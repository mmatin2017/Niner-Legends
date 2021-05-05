import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "../index.css"

export default function NotFound() {

  const [name, setName] = useState("");
  const [towerKills, setTowerKills] = useState("");
  const [firstBlood, setFirstBlood] = useState("");
  const [inhibitorKills, setInhibitorKills] = useState("");
  const [baronKills, setBaronKills] = useState("");
  const [dragonKills, setDragonKills] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return name.length > 0;
  }

  async function handleSubmit(event){

    event.preventDefault();
    setIsLoading(true);

    try{
        console.log(towerKills + " " + name + " " + firstBlood+ " " + inhibitorKills+ " " + dragonKills+ " "+ baronKills)
        setIsLoading(false);
    }
    catch{

    }

    


  }
  return (
    <div className="Login">
      <h3>Analytics Page!</h3>

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
    </div>
  );
}