import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { input, request } from "./data.js"
import { ShopUI } from "./components/shopui.js"
import './index.css';


function Game() {

  const [gameState, setGameState] = useState({
    gameStarted: false
  })

  const [money, setMoney] = useState({
    moneyUpdated: []
  })

  function startGame()
  {
    request.initializeData();
    setGameState({
      gameStarted:true
    })
    updateMoney();
  }
  
  function updateMoney()
  {
    setMoney({
      moneyUpdated: request.getPlayerWalletDenoms()
    })
  }

  function loadGame()
  {
    console.log("poop");
  }
 
  return (
     
    <div id="gameWrapper">
      <MenuBar updateMoney={updateMoney} startGame={startGame} values={money.moneyUpdated}/> 
      <GameArea updateMoney={updateMoney} gameStarted={gameState.gameStarted} />
      <div className ="sidebar" id="sidebarRight">
        <button><span>Save</span></button>
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

function GameArea(props) {
    //this.state = {uiToRender: request.getUiToRender()}
    //this.buttonHandler = this.buttonHandler.bind(this);

  
  const [ui, setUi] = useState({
    uiToRender: "overworld"
  });

  function buttonHandler(buttonID)
  {
    input.buttonPress(buttonID);
    setUi({
      uiToRender: request.getUiToRender()
    });
  }

  function checkout()
  {
    input.shopCheckout();
    props.updateMoney();
    shopReturn();
  }

  function shopReturn()
  {
    input.shopReturn();
    setUi({
      uiToRender: request.getUiToRender()
    });
  }

  if(props.gameStarted)
  {
    if(ui.uiToRender == "overworld")
      {
        
        return (
          <div id ="gameArea" className="overworld">
              <div id="textWrapper">
                <TextArea buttonHandler={buttonHandler} displayText={request.getDisplayText()} />
              </div>
              <ButtonDock buttonHandler={buttonHandler} buttonDock={request.getButtonDock()} />
          </div>
        )
      }
      else if(ui.uiToRender == "shop")
      {
        return (
          <div id ="gameArea" className="overworld">
              <ShopUI buttonHandler={buttonHandler} shopReturn={shopReturn} checkout={checkout}/>
          </div>
        )
      }
  }
  
 }


function ButtonDock (props) {
    
  function buildRows()
  {
    let buttonRows = []
    let buttonSet = [];
    for(let i = 0; i < 15; i++)
    {
        buttonSet.push(<DockButton id = {i} name={props.buttonDock[i].name} disabled={props.buttonDock[i].disabled} key={i} buttonHandler={props.buttonHandler} />)
        if((i + 1) % 5 === 0)
        {
          buttonRows.push(<div className="buttonRow" key={`buttonRow${i}`}>{buttonSet}</div>)
          buttonSet = [];
        }
    }
    return buttonRows;
  }

    return (
      <div id = "buttonDock">
        {buildRows()}
      </div>
    )
}

function DockButton(props) {
  let id = props.id;
  let name = props.name;
  let disabled = props.disabled;

  return (
    <button 
      id={"button" + id} 
      onClick = {() => props.buttonHandler(id)} 
      disabled={disabled}
    >
      <span>
        {name}
      </span>
    </button>
  )
}

function TextArea(props) {
  const displayText = props.displayText;
  return (
    <div 
      id="textArea"
      dangerouslySetInnerHTML={{__html: displayText}}
    >
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