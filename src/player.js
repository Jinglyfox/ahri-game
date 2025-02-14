import globals from "./resources/data/globals.json"
import { Inventory } from "./inventory"
import { Wallet } from "./money"

class Player
{
    constructor(inventory = new Inventory(), wallet = new Wallet())
    {
        this.inventory = inventory;
        this.wallet = wallet;
    }

    getUnsortedItems()
    {
        return this.inventory.getUnsortedItems();
    }

    canAfford(amount)
    {
        return this.wallet.canAfford(amount);
    }

    addMoney(amount)
    {
        this.wallet.addMoney(amount)
    }

    removeMoney(amount)
    {
        this.wallet.removeMoney(amount)
    }

    boughtItems(items)
    {
        this.inventory.boughtItems(items);
    }

    soldItems(items)
    {
        this.inventory.soldItems(items);
    }

    addItem(item, quantity=1)
    {
        this.inventory.addItem(item, quantity);
    }

    removeItem(item, quantity=1)
    {
        this.inventory.removeItem(item, quantity);
    }

    getInventory()
    {
        return this.inventory;
    }

    getMoneyRaw()
    {
        return this.wallet.getMoneyRaw();
    }

    getWalletDenoms()
    {
        return this.wallet.getMoneyDenoms()
    }

    getWallet()
    {
        return this.wallet;
    }
}

export var player = new Player()
