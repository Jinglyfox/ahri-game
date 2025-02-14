import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { input, request } from "../data.js"

export function ShopUI(props){

    const [update, setUpdate] = useState({
        updated: false
    })
    
    function shopReturn()
    {
        props.shopReturn();
    }

    function updateInventory()
    {
        setUpdate({updated: !update.updated});
    }

    return(
    <div id="shopWrapper">
        <div id="shopLeft">
            <VendorCard vendorName={request.getVendorName()} vendorBlurb={request.getVendorBlurb()} />
            <ItemInfoCard item={request.getActiveShopItem()}/>
        </div>
        <div id="shopRight">
            <ShopInventoryHeader updateInventory={updateInventory} disabledMenu={request.getDisabledMenu()} displayedPage={request.getDisplayedPage()} header={request.getShopHeader()}/>
            <ShopInventory updateInventory={updateInventory} items={request.getShopInventory()}/>
            <RunningTotal updateInventory={updateInventory} total={request.getRunningTotal()}/>
            <ShopDock shopReturn={shopReturn} checkout={props.checkout} updateMoney={props.updateMoney}/>
        </div>  
    </div>
    )
  }

function ShopInventoryHeader (props) {

    let disabledMenu = props.disabledMenu;
    let displayedPage = props.displayedPage

    function swapInventory(buyOrSell)
    {
        input.swapShopInventory(buyOrSell)
        props.updateInventory();
    }

    return(
    <div id="shopInventoryHeader">
        <button className={`shopDockButton ${displayedPage == 'buy' ? 'active' : ''}`} disabled={disabledMenu == "buy" ? true : false} onClick={() => swapInventory(("buy"))}>
            <span className="buttonText">Buy</span>
        </button>
        <span id="shopTitle">{props.header}</span>
        <button className={`shopDockButton ${displayedPage== 'sell' ? 'active' : ''}`} disabled={disabledMenu == "sell" ? true : false} onClick={() => swapInventory("sell")}>
            <span className="buttonText">Sell</span>
        </button>
    </div>
    )
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
        input.setCategoryFilter(category)
        this.props.updateInventory()
    }
  
    updateSubcategory(subcategory)
    {
        input.setSubcategoryFilter(subcategory)
        this.props.updateInventory()
    }
  
    loadItems()
    {
        let itemCards = []
        let activeItem = request.getActiveShopItem();
        for(let item in this.props.items)
        {
            itemCards.push(<ShopItemCard active={activeItem.getId() == this.props.items[item].getId() ? 'activeItemListCard' : ''} updateInventory={this.props.updateInventory} item={this.props.items[item]} key={item} />)
        }
        return itemCards
    }
  
    render() {
        return(
        <div id="shopInventoryWrapper">
          <FilterList updateInventory={this.props.updateInventory} updateFilter={this.updateParentCategory} activeFilter={request.getCategoryFilter()} filterCategories={request.getItemCategories()} />
          <FilterList updateInventory={this.props.updateInventory} updateFilter={this.updateSubcategory} activeFilter={request.getSubcategoryFilter()} filterCategories={request.getItemSubcategories()} />
          <div id="itemList">
              {this.loadItems()}
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
            <button className="shopDockButton" onClick={() => this.props.checkout()} disabled={!request.areItemsAdded()}><span className="buttonText">Checkout</span></button>
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
  
  
  
  
  
  class Filter extends React.Component {
    constructor(props)
    {
        super(props);
    }
    
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
      this.state = {filter: request.getCategoryFilter()}
    }
  
    /*updateFilter(filter)
    {
      input.setActiveFilter(filter);
      this.setState({filter: filter})
      this.props.updateInventory()
    } */

    loadFilters()
    {
      let filterList = []
      let emptyCategories = request.getEmptyCategories();
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
      this.setQuantity = this.setQuantity.bind(this);
      this.setActiveItem = this.setActiveItem.bind(this);
    }
  
    setActiveItem()
    {
      input.setActiveShopItem(this.props.item);
      this.props.updateInventory();
    }
  
    setQuantity(amount)
    {
        let quantity = input.setShopItemQuantity(this.props.item, amount);
        this.props.updateInventory();
        return quantity;
    }
  
    addQuantity()
    {

    }

    removeQuantity()
    {

    }

    displayStock()
    {
      let quantityForSale = this.props.item.getQuantity();
      if(this.props.item.hasFlag("unique"))
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
        <div className={`itemListCard ${this.props.active} ${this.props.item.getQuantity() == 0 ? "itemOutOfStock":""}`} onClick={() => this.setActiveItem()}>
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
                  <div className="itemCardCost">{this.props.item.getFormattedPrice()}</div>
                  <ItemQuantity
                    isUnique={this.props.item.hasFlag("unique")}
                    quantityForSale={this.props.item.getQuantity()}
                    canAdd={request.requestCanChangeQuantity(this.props.item, 1)}
                    canRemove={request.requestCanChangeQuantity(this.props.item, -1)}
                    itemQuantity={this.props.item.getQuantityInCart()}
                    requestQuantity={this.setQuantity} 
                    addQuantity={this.setQuantity} 
                    removeQuantity={this.setQuantity} 
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
      
      quantity = this.props.setQuantity(this.props.itemQuantity + quantity);
      this.setState({value: quantity});
    }
  
    setQuantity(event)
    {
      
      if(/^[0-9\b]+$/.test(event.target.value) && event.target.value >= 0 && event.target.value <= 9999 || event.target.value == '')
      {
        //this.setState({value: this.props.itemQuantity});
        let quantity = this.props.setQuantity(Number(event.target.value));
        
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
              disabled={!this.props.canAdd}
              onClick={(e) => this.quantityPress(1, e)}
            >
              <span className="buttonText">Select</span>
            </button>
            <button 
              className="itemCardBuyLess"
              disabled={!this.props.canRemove}
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
              disabled={!this.props.canRemove}
              onClick={(e) => this.quantityPress(-1, e)}
            >
              <span className="buttonText" >-</span>
            </button>
            <input className="quantityInput" value={this.state.value === '' ? '' : this.props.itemQuantity} type="text" placeholder="0" onBlur={(e) => this.onBlur(e)} onChange={(e) => this.setQuantity(e)}/>
            <button 
              className="itemCardBuyMore" 
              title="Hold control to add 10 items, shift to add 100, or both to add 1000." 
              disabled={!this.props.canAdd} 
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

        if(this.props.item.getId() != "")
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
    constructor(props)
    {
        super(props);
    }
    
    render() {
        return (
        <div id="vendorCard" className="cardShape">
          <div className="cardHeader">
              <div className="cardHeaderContainer">
                <span>
                  {this.props.vendorName}
                </span></div>
              <div className="underline"></div>
          </div>
          <div className="cardTextArea">
            {this.props.vendorBlurb}
          </div>
      </div>
      )
    }
  }
