import React from 'react';
import ReactDOM from 'react-dom/client';
import { input, request } from "./data.js"
import { ShopUI } from "./components/shopui.js"
import './index.css';


class Game extends React.Component {
  constructor(props)
  {
    super(props)
    this.state = {update: false}
    this.checkout = this.checkout.bind(this);
    this.updateShops = this.updateShops.bind(this);
  }

  loadGame()
  {
    console.log("poop");
  }

  addMoney()
  {
    input.addMoney([10, 10, 10, 10]);
    this.setState({update: !this.state.update});
  }

  removeMoney()
  {
    input.removeMoney([10, 10, 10, 10]);
    this.setState({update: !this.state.update});
  }

  updateShops()
  {
    //data.updateShops()
    this.setState({update: !this.state.update});
  }
  
  checkout()
  {
    //data.checkout();
    this.setState({update: !this.state.update});
  }
  // <MoneyBar /> put this back on line 47
  render() {
    return (
      <div id="gameWrapper">
        <div className ="sidebar" id="sidebarLeft">
            <div>
              <button onClick={startGame}><span>Start</span></button>
            </div>
            
            <div><button onClick={() => this.addMoney()}>Add Money</button></div>
            <div><button onClick={() => this.removeMoney()}>Remove Money</button></div>
            <div><button onClick={() => this.updateShops()}>Update Shops</button></div>
          </div>		
          <GameArea checkout={this.checkout} />
          <div className ="sidebar" id="sidebarRight">
          <button><span>Save</span></button>
          <button onClick={() => this.loadGame()}><span>Load</span></button>
          </div>
     </div>
    )
  }
}

class GameArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {uiToRender: request.getUiToRender()}
    this.buttonHandler = this.buttonHandler.bind(this);
  }

  buttonHandler(buttonID)
  {
    input.buttonPress(buttonID);
    this.setState({uiToRender: request.getUiToRender()});
  }

  render() {
    if(this.state.uiToRender == "overworld")
    {
      return (
        <div id ="gameArea" className="overworld">
            <div id="textWrapper">
              <TextArea buttonHandler={this.buttonHandler} displayText={request.getDisplayText()} />
            </div>
            <ButtonDock buttonHandler={this.buttonHandler} buttonDock={request.getButtonDock()} />
        </div>
      )
    }
    else if(this.state.uiToRender == "shop")
    {
      return (
        <div id ="gameArea" className="overworld">
            <ShopUI buttonHandler={this.buttonHandler} checkout={this.props.checkout} shop={request.getActiveShop()}/>
        </div>
      )
    }
    }
 }


class ButtonDock extends React.Component
{
    buildRows()
    {
    let buttonRows = []
    let buttonSet = [];
    for(let i = 0; i < 15; i++)
    {
        buttonSet.push(<Button id = {i} buttonObject={this.props.buttonDock[i]} buttonHandler={this.props.buttonHandler} key={i} />)
        if((i + 1) % 5 === 0)
        {
        buttonRows.push(<div className="buttonRow" key={`buttonRow${i}`}>{buttonSet}</div>)
        buttonSet = [];
        }
    }
    return buttonRows;
    }

    render() {
        return (
            <div id = "buttonDock">
            {this.buildRows()}
            </div>
        )
    }
}

class Button extends React.Component
{

  render() {
    const { id } = this.props;
    return (
      <button 
        id={"button" + id} 
        onClick = {() => this.props.buttonHandler(id)} 
        disabled={this.props.buttonObject.disabled}
      >
        <span>
          {this.props.buttonObject.name}
        </span>
      </button>
    )
  }
}

class TextArea extends React.Component {
  constructor(props)
  {
    super(props);
  }

  //this function works, reminder for self: can't set html with this, needs to actually be a child.
  /*testFunction() {
    let test = [];
    for(let i = 0; i < 5; i++)
    {
      test.push(<TestComponent />)
    }
    return test;
  } */

  render() {
    return (
      <div 
        id="textArea"
        dangerouslySetInnerHTML={{__html: this.props.displayText}}
      >
      </div>
    )
  }
}
/*
class MoneyBar extends React.Component {
  constructor(props)
  {
    super(props);
  }

  render() {
    return (
      <div id="moneybar">
        <Money denomination="copper" money={this.props.money[0]} />
        <Money denomination="silver" money={this.props.money[1]} />
        <Money denomination="gold" money={this.props.money[2]} />
        <Money denomination="platinum"money={this.props.money[3]} />
      </div>
    )
  }
}

class Money extends React.Component {
  constructor(props)
  {
    super(props)
    
  }

  render() {
    return <div id={this.props.denomination} className="money"><img src={`./resources/pictures/${this.props.denomination} coin.png`}/><span className="money-amount">{this.props.money}</span></div>
  }
}

*/

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

SceneKludge();

function startGame()
{
  
}