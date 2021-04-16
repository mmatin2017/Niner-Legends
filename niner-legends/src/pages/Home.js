import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "../index.css";
import axios from 'axios';
import {Summoners} from '../components/Summoner'



export default function Home() {
   const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState(null);

    function validateForm() {
      return name.length > 0;
    }
    async function handleSubmit(event) {
      event.preventDefault();
      setIsLoading(true)
        try{
            
            await axios.post('http://b63558c6766e.ngrok.io/summoners', {name : name})
            .then(res => setState(res.data))
            .catch(err => console.error(err))
            .finally(() => {
                setIsLoading(false);
                console.log(state.participantIdentities);
                
                
            })

      }
      catch(event){
        console.log(event)
        setIsLoading(false);
      }
    }

    useEffect(()=>{
          
          axios.post('http://b63558c6766e.ngrok.io/summoners', {name : "Lugerr"})
         .then(res => setState(res.data))
         .catch(err => console.error(err))

       
        
        }, [])

  return (
    <div className="lander">
    <h1>Niner Legends</h1>
    <p className="text-muted">
      Competitive stat tracking for League of Legends
    </p>
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
