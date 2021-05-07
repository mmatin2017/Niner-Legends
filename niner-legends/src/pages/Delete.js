import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "../index.css";
import axios from "axios";

export default function Home() {
    const [gameID, setGameID] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return gameID.length > 0;
      }

      async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
    
        try {
          // posting the name
          await axios
            .delete("http://29d5b09f8713.ngrok.io/delete/"+gameID)
            .then()
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
          
        } catch (event) {
          console.log(event);
          setIsLoading(false);
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
                <Form.Label>Enter Game ID to Delete</Form.Label>
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
          
        </div>
      );







}