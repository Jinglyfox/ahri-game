import React from "react";
import { GameArea } from "../atoms/GameArea";
import { input, request } from "../../data.js"

export function OverworldUI(props)
{
    let updateGame = props.updateGame;
    
    return(
        <GameArea className="overworld">
            <div id="textWrapper">
                <div id="textArea" dangerouslySetInnerHTML={{__html: request.getDisplayText()}}></div>
            </div>
            <ButtonDock updateGame={updateGame} buttonDock={request.getButtonDock()} />
        </GameArea>
    )
}

function ButtonDock (props) {
    let buttonDock = props.buttonDock;
    let updateGame = props.updateGame;

  function buildRows()
  {
    let buttonRows = []
    let buttonSet = [];
    for(let i = 0; i < 15; i++)
    {
        buttonSet.push(<DockButton id = {i} name={buttonDock[i].name} disabled={buttonDock[i].disabled} key={i} updateGame={updateGame} />)
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
  let updateGame = props.updateGame;

  function buttonHandler(id)
  {
    input.buttonPress(id)
    updateGame();
  }

  return (
    <button 
      id={"button" + id} 
      onClick = {() => buttonHandler(id)} 
      disabled={disabled}
    >
      <span>
        {name}
      </span>
    </button>
  )
}