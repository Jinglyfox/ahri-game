import React from 'react';
import ReactDOM from 'react-dom/client';
import { data } from "./data.js"
import './index.css';


class Game extends React.Component {
  constructor(props)
  {
    super(props)
    this.state = {update: false}
    this.addMoney = this.addMoney.bind(this);
    this.removeMoney = this.removeMoney.bind(this);
    this.checkout = this.checkout.bind(this);
    this.updateShops = this.updateShops.bind(this);
  }

  addMoney()
  {
    data.addMoney([10, 10, 10, 10]);
    this.setState({update: !this.state.update});
  }

  removeMoney()
  {
    data.removeMoney([10, 10, 10, 10]);
    this.setState({update: !this.state.update});
  }

  updateShops()
  {
    data.updateShops()
    this.setState({update: !this.state.update});
  }
  
  checkout()
  {
    data.checkout();
    this.setState({update: !this.state.update});
  }

  render() {
    return (
      <div id="gameWrapper">
        <div className ="sidebar" id="sidebarLeft">
            <div>
              <button onClick={startGame}><span>Start</span></button>
            </div>
            <MoneyBar money={data.getMoney()} />
            <AddMoney update={this.addMoney} />
            <RemoveMoney update={this.removeMoney} />
            <UpdateShops update={this.updateShops} />
          </div>		
          <GameArea checkout={this.checkout} uiToRender={data.getUiToRender()}/>
          <div className ="sidebar" id="sidebarRight">
            <SaveButton />
            <LoadButton />
          </div>
     </div>
    )
  }
}

class UpdateShops extends React.Component {
  render() {
    return <div onClick={() => this.props.update()}><button>Update Shops</button></div>
  }
}

class GameArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {uiToRender: data.getUiToRender()}
    this.handler = this.handler.bind(this);
    this.shopReturn = this.shopReturn.bind(this);
  }

  shopReturn()
  {
    data.shopReturn();
    this.setState({uiToRender: data.getUiToRender()});
  }


  handler(buttonObject)
  {
    data.buttonPress(buttonObject);
    this.setState({uiToRender: data.getUiToRender()});
  }

  render() {
    if(this.state.uiToRender == "overworld")
    {
      return (
        <div id ="gameArea" className="overworld">
            <div id="textWrapper">
              <TextArea handler={this.handler} displayText={data.getDisplayText()} />
            </div>
            <ButtonDock handler={this.handler} buttonDock={data.getButtonDock()} />
        </div>
      )
    }
    else if(this.state.uiToRender == "shop")
    {
      return (
        <div id ="gameArea" className="overworld">
            <ShopUI shopReturn={this.shopReturn} checkout={this.props.checkout} shop={data.getActiveShop()}/>
        </div>
      )
    }
  }
}

class ShopUI extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {update: false}
    this.updateInventory = this.updateInventory.bind(this);
    this.shopCheckout = this.shopCheckout.bind(this);
  }
  
  updateInventory()
  {
    this.setState({update: !this.state.update});
  }

  shopCheckout()
  {
    this.props.checkout()
    this.props.shopReturn();
  }

  render() {
    return(
      <div id="shopWrapper">
        <div id="shopLeft">
            <VendorCard vendor={data.getVendor()} />
            <ItemInfoCard item={data.getActiveItem()}/>
        </div>
        <div id="shopRight">
            <ShopInventoryHeader updateInventory={this.updateInventory} disabledMenu={data.getDisabledMenu()} header={data.getShopHeader()}/>
            <ShopInventory updateInventory={this.updateInventory} items={data.getShopInventory()}/>
            <RunningTotal updateInventory={this.updateInventory} total={data.getRunningTotal()}/>
            <ShopDock shopReturn={this.props.shopReturn} checkout={this.shopCheckout}/>
        </div>
      </div>
    )
  }
}

class ShopDock extends React.Component {
  render() {
    return(
      <div id="shopDock">
          <button className="shopDockButton"><span className="buttonText">Quantity</span></button>
          <button className="shopDockButton" disabled=""><span className="buttonText">Inspect</span></button>
          <button className="shopDockButton" onClick={() => this.props.checkout()} disabled={!data.areItemsAdded()}><span className="buttonText">Checkout</span></button>
          <button className="shopDockButton" onClick={() => this.props.shopReturn()}><span className="buttonText">Return</span></button>
      </div>
    )
  }
}

class RunningTotal extends React.Component {
  render() {
    return(
      <div id="totalPrice">
          <span>Running Total:</span>
          <div id="runningTotal">{this.props.total}</div>
      </div>
    )
  }
}

class ShopInventoryHeader extends React.Component {
  constructor(props)
  {
    super(props)
    this.swapInventory = this.swapInventory.bind(this)
    this.state={displayedPage: this.props.disabledMenu == "buy" ? "sell" : "buy"};
  }

  swapInventory(buyOrSell)
  {
    data.swapShopInventory(buyOrSell);
    this.setState({displayedPage: buyOrSell});
    this.props.updateInventory();
  }
  
  render() {
    return(
      <div id="shopInventoryHeader">
          <button className={`shopDockButton ${this.state.displayedPage == 'buy' ? 'active' : ''}`} disabled={this.props.disabledMenu == "buy" ? true : false} onClick={() => this.swapInventory(("buy"))}>
            <span className="buttonText">Buy</span>
          </button>
          <span id="shopTitle">{this.props.header}</span>
          <button className={`shopDockButton ${this.state.displayedPage == 'sell' ? 'active' : ''}`} disabled={this.props.disabledMenu == "sell" ? true : false} onClick={() => this.swapInventory("sell")}>
            <span className="buttonText">Sell</span>
          </button>
      </div>
    )
  }
}

class ShopInventory extends React.Component {

  constructor(props)
  {
    super(props);
    this.updateParentCategory = this.updateParentCategory.bind(this);
    this.updateSubcategory = this.updateSubcategory.bind(this);
  }

  updateParentCategory(category)
  {
    data.setCategoryFilter(category)
    this.props.updateInventory()
  }

  updateSubcategory(subcategory)
  {
    data.setSubcategoryFilter(subcategory)
    this.props.updateInventory()
  }

  loadItems()
  {
    let itemCards = []
    let activeItem = data.getActiveItemId();
    for(let i = 0; i < this.props.items.length; i++)
    {
      itemCards.push(<ShopItemCard active={activeItem == this.props.items[i].getId() ? 'activeItemListCard' : ''} updateInventory={this.props.updateInventory} item={this.props.items[i]} key={i} />)
    }
    return itemCards
  }

  render() {
    return(
      <div id="shopInventoryWrapper">
        <FilterList updateInventory={this.props.updateInventory} updateFilter={this.updateParentCategory} activeFilter={data.getCategoryFilter()} filterCategories={data.getItemCategories()} />
        <FilterList updateInventory={this.props.updateInventory} updateFilter={this.updateSubcategory} activeFilter={data.getSubcategoryFilter()} filterCategories={data.getFilteredSubcategories()} />
        <div id="itemList">
            {this.loadItems()}
        </div>
      </div>
    )
  }
}

class Filter extends React.Component {
  render() {
    if(this.props.active)
    {
      return (
        <button className="inventoryFilter activeFilter"><img src={`./resources/pictures/${this.props.category}icon.png`} /></button>
      )
    }
    else
    {
      return (
        <button onClick={() => this.props.updateFilter(this.props.category)} disabled={this.props.disabled} className="inventoryFilter inactiveFilter"><img src={`./resources/pictures/${this.props.category}icon.png`} /></button>
      )
    }
  }
}

class FilterList extends React.Component {
  
  constructor(props)
  {
    super(props);
    //this.state = {filter: data.getActiveFilter()}
    //this.updateFilter = this.updateFilter.bind(this);
  }

  /*updateFilter(filter)
  {
    data.setActiveFilter(filter);
    this.setState({filter: filter})
    this.props.updateInventory()
  }*/

  loadFilters()
  {
    let filterList = []
    let emptyCategories = data.getEmptyCategories();
    let filterCategories = this.props.filterCategories;
    filterCategories.unshift("all");
    for(let i = 0; i < filterCategories.length; i++)
    {
      if(filterCategories[i] == this.props.activeFilter)
      {
        filterList.push(<Filter disabled={null} updateFilter={this.props.updateFilter} key={i} category={filterCategories[i]} active={true} />)
      }
      else
      { 
        if(emptyCategories.includes(this.props.filterCategories[i]))
        {
          filterList.push(<Filter disabled={true} updateFilter={this.props.updateFilter} key={i} category={filterCategories[i]} active={false} />)
        }
        else
        {
          filterList.push(<Filter disabled={null} updateFilter={this.props.updateFilter} key={i} category={filterCategories[i]} active={false} />)
        }
      }
    }
    return filterList;
  }

  render() {
    return(
      <div id="inventoryFilters">{this.loadFilters()}</div>
    )
  }
}

class ShopItemCard extends React.Component {
  
  constructor(props)
  {
    super(props);
    this.requestQuantity = this.requestQuantity.bind(this);
    this.setActiveItem = this.setActiveItem.bind(this);
  }

  setActiveItem()
  {
    data.setActiveShopItem(this.props.item);
    this.props.updateInventory();
  }

  requestQuantity(request)
  {
    let quantity = data.requestItemQuantity(this.props.item, request);
    data.setShopItemQuantity(this.props.item, quantity);
    this.props.updateInventory();
    return quantity;
  }

  displayStock()
  {
    let quantityForSale = this.props.item.getQuantityForSale();
    if(this.props.item.isUnique())
    {
      return <span className="itemCardRemaining">Unique Item</span>
    }
    if(quantityForSale > 0)
    {
      return <span className="itemCardRemaining">remaining: {quantityForSale}</span>
    }
    else if(quantityForSale == 0)
    {
      return <span className="itemCardRemaining">OUT OF STOCK</span>
    }
    return
  }

  render() {
    return(
      <div className={`itemListCard ${this.props.active} ${this.props.item.getQuantityForSale() == 0 ? "itemOutOfStock":""}`} onClick={() => this.setActiveItem()}>
        <img className="itemImg" src={`resources/pictures/${this.props.item.getSubcategory()}icon.png`} />
        <div className="itemCardText">
            <div className="cardHeader">
                <div className="cardHeaderContainer">
                  <span>{this.props.item.getName()}</span>
                  {this.displayStock()}
                </div>
                <div className="underline"></div>
            </div>
            <div className="itemCardInfo">
                <div className="itemCardCost">{data.getItemPrice(this.props.item)}</div>
                <ItemQuantity
                  isUnique={this.props.item.isUnique()}
                  quantityForSale={this.props.item.getQuantityForSale()}
                  canAdd={data.requestItemQuantity(this.props.item, this.props.item.getQuantitySold() + 1)}
                  canRemove={data.requestItemQuantity(this.props.item, this.props.item.getQuantitySold() - 1)}
                  itemQuantity={this.props.item.getQuantitySold()}
                  requestQuantity={this.requestQuantity} 
                  addQuantity={this.addQuantity} 
                  subtractQuantity={this.subtractQuantity} 
                  setQuantity={this.setQuantity}
                />
            </div>
        </div>
      </div>
    )
  }
}

class ItemQuantity extends React.Component {
  
  constructor(props)
  {
    super(props);
    this.state = {value: this.props.itemQuantity};
    this.quantityPress = this.quantityPress.bind(this)
    this.setQuantity = this.setQuantity.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  
  quantityPress(input, event)
  {
    let quantity = input;
    if(event.ctrlKey)
    {
      quantity *= 10;
    }
    if(event.shiftKey)
    {
      quantity *= 100;
    }
    
    quantity = this.props.requestQuantity(this.props.itemQuantity + quantity);
    this.setState({value: quantity});
  }

  setQuantity(event)
  {
    
    if(/^[0-9\b]+$/.test(event.target.value) && event.target.value >= 0 && event.target.value <= 9999 || event.target.value == '')
    {
      //this.setState({value: this.props.itemQuantity});
      let quantity = this.props.requestQuantity(Number(event.target.value));
      if(event.target.value === '')
      {
        this.setState({value: ''});
      }
      else
      {
        
        this.setState({value: quantity});
      }
    }
  }

  onBlur(event)
  {
    if(event.target.value == '')
    {
      this.setState({value: 0});
    }
  }

  render() {
    if(this.props.isUnique)
    {
      return(
        <div className="itemCardUniqueItem">
          <button 
            className="itemCardBuyMore"
            disabled={!(this.props.canAdd == this.props.itemQuantity + 1)}
            onClick={(e) => this.quantityPress(1, e)}
          >
            <span className="buttonText">Select</span>
          </button>
          <button 
            className="itemCardBuyLess"
            disabled={!(this.props.canRemove == this.props.itemQuantity - 1)}
            onClick={(e) => this.quantityPress(-1, e)}
          >
            <span className="buttonText">Cancel</span>
          </button>
        </div>
      )
    }
    else
    {
      return(
        <div className="itemCardQuantityControl">
          <button 
            className="itemCardBuyLess" 
            title="Hold control to remove 10 items, shift to add 100, or both to add 1000." 
            disabled={this.props.canRemove == this.props.itemQuantity - 1 ? false : true}
            onClick={(e) => this.quantityPress(-1, e)}
          >
            <span className="buttonText" >-</span>
          </button>
          <input className="quantityInput" value={this.state.value === '' ? '' : this.props.itemQuantity} type="text" placeholder="0" onBlur={(e) => this.onBlur(e)} onChange={(e) => this.setQuantity(e)}/>
          <button 
            className="itemCardBuyMore" 
            title="Hold control to add 10 items, shift to add 100, or both to add 1000." 
            disabled={this.props.canAdd == this.props.itemQuantity + 1 ? false : true} 
            onClick={(e) => this.quantityPress(1, e)}
          >
            <span className="buttonText">+</span>
          </button>
        </div>
      )
    }
  }
}

class ItemInfoCard extends React.Component {

  render() {
    if(this.props.item != null)
    {
      return(
        <div id="itemInfoCard" className="cardShape active">
          <div className="cardHeader">
              <div className="cardHeaderContainer"><span>{this.props.item.getName()}</span></div>
              <div className="underline"></div>
          </div>
          <div className="cardTextArea">{this.props.item.getDescription()}</div>
        </div>
      )
    }
    else
    {
      return(
        <div id="itemInfoCard" className="cardShape disabled">

        </div>
      )
    }
  }
}

class VendorCard extends React.Component {
  render() {
    return (
      <div id="vendorCard" className="cardShape">
        <div className="cardHeader">
            <div className="cardHeaderContainer">
              <span>
                {this.props.vendor.getName()}
              </span></div>
            <div className="underline"></div>
        </div>
        <div className="cardTextArea">
          {this.props.vendor.getBlurb()}
        </div>
    </div>
    )
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
        buttonSet.push(<Button id = {i} buttonObject={this.props.buttonDock[i]} handler={this.props.handler} key={i} />)
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
        onClick = {() => this.props.handler(this.props.buttonObject)} 
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

class AddMoney extends React.Component {
  constructor(props)
  {
    super(props);
  }

  render() {
    return <div><button onClick={() => this.props.update()}>Add Money</button></div>
  }
}

class RemoveMoney extends React.Component {
  constructor(props)
  {
    super(props);
  }

  render() {
    return <div><button onClick={() => this.props.update()}>Remove Money</button></div>
  }
}

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



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);



function SceneKludge()
{
  data.initializeData();
  
}

SceneKludge();

function SaveButton()
{
  return <button><span>Save</span></button>;
}

function LoadButton()
{
  function loadGame()
  {
    console.log("poop");
  }

  return <button onClick={loadGame}><span>Load</span></button>;
}

function startGame()
{
  
}