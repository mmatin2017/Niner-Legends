import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "../index.css";
import axios from 'axios';
import ListGroup from "react-bootstrap/ListGroup";




export default function Home() {
   const [name, setName] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [state, setState] = useState({data: {}})
   const [loading, setLoading] = useState(true);
   const [id, setId] = useState(0);;

  
   

  

    
    function validateForm() {
      return name.length > 0;
    }
    async function handleSubmit(event) {
      
      event.preventDefault();
      setIsLoading(true)
      
      
        try{
            await axios.post('http://41dfa7c801b5.ngrok.io/summoners', {name : name})
            .then(res => {
              for (let j = 0; j < res.data.participantIdentities.length; j++) {
                console.log(res.data.participantIdentities[j].player.summonerName)
                if(res.data.participantIdentities[j].player.summonerName === name){
                  setId(j);
                  break;
                }
              }
              
            })
            .then()
            .catch(err => console.error(err))
            .finally(() => {
            })

            await axios.get('http://41dfa7c801b5.ngrok.io/participants')
            .then(res => {
              console.log(res.data)
              setState(res.data)
              console.log(state.champion[id])
              setLoading(false);


              
             
              
              
              
              

            })
            .catch(err => console.error(err))
            .finally(() => {
                setIsLoading(false);
                setLoading(false);
                
            })


      }
      catch(event){
        console.log(event)
        setIsLoading(false);
      }
    }
      /*

    <ListGroup.Item>Win {win}</ListGroup.Item>
        <ListGroup.Item>Kills {kills}</ListGroup.Item>
        <ListGroup.Item>Assists {assists}</ListGroup.Item>
        <ListGroup.Item>Deaths {deaths}</ListGroup.Item>
        <ListGroup.Item>Damage {damage}</ListGroup.Item>
        <ListGroup.Item>Gold {gold}</ListGroup.Item>
        <ListGroup.Item>Total Minions Kills {minions}</ListGroup.Item>
        <ListGroup.Item>Item 1 {item1}</ListGroup.Item>
        <ListGroup.Item>Item 2 {item2}</ListGroup.Item>
        <ListGroup.Item>Item 3 {item3}</ListGroup.Item>
        <ListGroup.Item>Item 4 {item4}</ListGroup.Item>
        <ListGroup.Item>Item 5 {item5}</ListGroup.Item>
        <ListGroup.Item>Item 6 {item6}</ListGroup.Item>
        <ListGroup.Item>Item 7 {item7}</ListGroup.Item>

         setKills(res.data.kills[id])              
              setAssists(res.data.assists[id])
              setDeaths(res.data.deaths[id])
              setDamage(res.data.totalDamageDealt[id])
              setGold(res.data.goldEarned[id])
              setMinions(res.data.totalMinionsKilled[id])
              setItem1(res.data.Item1[id])
              setItem2(res.data.Item2[id])
              setItem3(res.data.Item3[id])
              setItem4(res.data.Item4[id])
              setItem5(res.data.Item5[id])
              setItem6(res.data.Item6[id])
              setItem7(res.data.Item7[id])
    */
      function renderList(){
        if(loading ===true){
          return <h4>Enter Data</h4>
        }
        else{
      return(

        <ListGroup>
        <ListGroup.Item>Summoner {name}</ListGroup.Item>
        <ListGroup.Item>Champion {state.champion[id]}</ListGroup.Item>
        <ListGroup.Item>Win {state.win[id]}</ListGroup.Item>
        <ListGroup.Item>Kills {state.kills[id]}</ListGroup.Item>
        <ListGroup.Item>Deaths {state.deaths[id]}</ListGroup.Item>
        <ListGroup.Item>Assists {state.assists[id]}</ListGroup.Item>
        <ListGroup.Item>Total Damage {state.totalDamageDealt[id]}</ListGroup.Item>
        <ListGroup.Item>Gold Earned {state.goldEarned[id]}</ListGroup.Item>
        <ListGroup.Item>Champion Level {state.champLevel[id]}</ListGroup.Item>
        <ListGroup.Item>Minions Killed {state.totalMinionsKilled[id]}</ListGroup.Item>
        <ListGroup.Item>Item 1 {state.Item1[id]}</ListGroup.Item>
        <ListGroup.Item>Item 2 {state.Item2[id]}</ListGroup.Item>
        <ListGroup.Item>Item 3 {state.Item3[id]}</ListGroup.Item>
        <ListGroup.Item>Item 4 {state.Item4[id]}</ListGroup.Item>
        <ListGroup.Item>Item 5 {state.Item5[id]}</ListGroup.Item>
        <ListGroup.Item>Item 6 {state.Item6[id]}</ListGroup.Item>
        <ListGroup.Item>Item 7 {state.Item7[id]}</ListGroup.Item>
        </ListGroup>
      )
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

        {renderList()}

        </div>

        
      
        
  
  );
}