import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "../index.css";
import axios from "axios";

export default function Home() {
    const [gameID, setGameID] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return gameID.length > 0;
      }

      async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        let url = "http://ab43cc4188ce.ngrok.io/delete/"
    
        try {
          // posting the name
          console.log(gameID)
          console.log(url+gameID)
          await axios
            .delete(url+gameID)
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