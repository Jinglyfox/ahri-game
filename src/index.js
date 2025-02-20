import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { input, request } from "./data.js"
import { ShopUI } from './components/pages/ShopUI.js';
import { BlankUI } from './components/pages/BlankUI.js';
import { OverworldUI } from './components/pages/OverworldUI.js';
import './index.css';


function Game() {

  const [gameState, setGameState] = useState({
    gameUpdated: false,
    gameLoaded: false
  })

  const [money, setMoney] = useState({
    moneyUpdated: []
  })

  const [ui, setUi] = useState({
    uiToRender: "blank"
  });

  function updateGame()
  {
    setGameState({
      gameUpdated: !gameState.gameUpdated
    });
    setUi({
      uiToRender: request.getUiToRender()
    });
    setMoney({
      moneyUpdated: request.getPlayerWalletDenoms()
    });
  }

  function startGame()
  {
    request.initializeData();
    setUi({
      uiToRender: "overworld"
    })
    updateMoney();
  }

  function updateMoney()
  {
    setMoney({
      moneyUpdated: request.getPlayerWalletDenoms()
    })
  }

  function saveGame()
  {
    input.saveGame();
  }

  function loadGame()
  {
    input.loadGame();
    updateMoney();
    setGameState({
      gameStarted: true,
      gameLoaded: !gameState.gameLoaded
    })
  }
 
  function setUI()
  {
    console.log("hello1");
    switch(ui.uiToRender)
    {
      case "blank":
        return <BlankUI startGame={startGame}/>
      case "overworld":
        return <OverworldUI updateGame={updateGame} />
      case "shop":
        return <ShopUI updateGame={updateGame}/>
    }
  }

  return(
    <div id="gameWrapper">
      <MenuBar updateMoney={updateMoney} startGame={startGame} values={money.moneyUpdated}/> 
      {setUI()}
      <div className ="sidebar" id="sidebarRight">
        <button onClick={() => saveGame()}><span>Save</span></button>
        <button onClick={() => loadGame()}><span>Load</span></button>
      </div>
    </div>
  )

  
  
}

function MenuBar(props) {  
  function updateShops()
  {
    //data.updateShops()
  }
  
  let values = props.values;

  return (
    <div className ="sidebar" id="sidebarLeft">
        <div><button onClick={props.startGame}><span>Start</span></button></div>
        <MoneyBar denominations={request.getDenomNames()} updateMoney={props.updateMoney} values={values}/>
        <div><button onClick={() => updateShops()}>Update Shops</button></div>
    </div>		
  )
}

function MoneyBar(props) {

  let denominations = props.denominations;
  let valuesToDisplay = props.values;

  function addMoney()
  {
    input.addMoney([10, 10, 10, 10]);
    props.updateMoney()
  }

  function removeMoney()
  {
    input.removeMoney([13, 156, 14, 2]);
    props.updateMoney()
  }

  function loadMoney()
  {
    let moneyBar = [];
    for(let i = 0; i < denominations.length; i++)
    {
      moneyBar.push(<Money denomination={denominations[i]} value={valuesToDisplay[i]} key={i}/>)
    }
    return moneyBar;
  }

   return (
    <div>
      <div id="moneybar">
        {loadMoney()}
      </div>
      <div><button onClick={() => addMoney()}>Add Money</button></div>
      <div><button onClick={() => removeMoney()}>Remove Money</button></div>
    </div>
  )
}

class Money extends React.Component {
  constructor(props)
  {
    super(props)
    
  }

  render() {
    return <div id={this.props.denomination} className="money"><img src={`./resources/pictures/${this.props.denomination} coin.png`}/><span className="money-amount">{this.props.value}</span></div>
  }
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);



function SceneKludge()
{
  request.initializeData();
  
}

//SceneKludge();