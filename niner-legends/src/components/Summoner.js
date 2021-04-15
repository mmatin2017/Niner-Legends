import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "../index.css";

export default function Summoner(){
   
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    function validateForm() {
      return name.length > 0;
    }
  
    async function handleSubmit(event) {
        try{
            
            setIsLoading(true);
            console.log(name);

      }
      catch(event){
        console.log(event)
      }
    }

  

    useEffect(()=>{
        try{
          const summoner = "Son";
          fetch('http://93ad5ff73620.ngrok.io/summoners', {
              method: 'POST',
              headers: {
                  'Content-Type' : 'application/json'
              },
              body: JSON.stringify(summoner)
          }).then(
            response => response.json()
          ).then(data => console.log(data))

          if (Response.ok){
              console.log("response Worked")
          }
      }
      catch(event){
        console.log(event)
      }
        console.log('component mounted!')
      },[])

    return (
        <div className="Home">
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