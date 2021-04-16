import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "../index.css";
import axios from 'axios';
import ListGroup from "react-bootstrap/ListGroup";




export default function Home() {
   const [name, setName] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [state, setState] = useState({data : {}});
    
    function validateForm() {
      return name.length > 0;
    }
    async function handleSubmit(event) {
      
      event.preventDefault();
      setIsLoading(true)
      
      let id;
        try{
          
            await axios.post('http://d0c86f7024dd.ngrok.io/summoners', {name : name})
            .then(res => {
              
              console.log("please work")
              console.log(res.data)
              for (let j = 0; j < res.data.participantIdentities.length; j++) {
                console.log(res.data.participantIdentities[j].player.summonerName)
                if(res.data.participantIdentities[j].player.summonerName === name){
                  id = j;
                  break;
                }
              }
              console.log(res.data.participantIdentities[id].player.summonerName)
              console.log(res.data.participants[id])
              setState(res.data.participants[id]);
              console.log(state.stats.assists)
              console.log(id);
              
            })
            .catch(err => console.error(err))
            .finally(() => {
                setIsLoading(false);
                console.log(state)
            })

      }
      catch(event){
        console.log(event)
        setIsLoading(false);
      }
    }

      function renderList(){
      return(
        <ListGroup>
        <ListGroup.Item>Summoner {name}</ListGroup.Item>
        <ListGroup.Item>Champion ID {state.championId}</ListGroup.Item>
        <ListGroup.Item>Total Assists {state.stats.assists}</ListGroup.Item>
        <ListGroup.Item>Total Kills {state.stats.kills}</ListGroup.Item>

        </ListGroup>
      )

    }


    
    /*useEffect(()=>{
          
          axios.post('http://4528c60c4414.ngrok.io/summoners', {name : "Lugerr"})
         .then(res => setState(res.data))
         .catch(err => console.error(err))
        }, [])
        */

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

        {renderList()}

        
      
        
  </div>
  );
}
