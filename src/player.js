import globals from "./resources/data/globals.json"
import { Inventory } from "./inventory"
import { Wallet } from "./money"

class Player
{
    constructor(inventory = new Inventory(), wallet = new Wallet(), playerData = new PlayerData())
    {
        this.inventory = inventory;
        this.wallet = wallet;
        this.playerData = playerData;
    }

    setFlag(flag, value)
    {
        this.playerData.setFlag(flag, value);
    }



    incrementFlag(flag, value)
    {
        this.playerData.incrementFlag(flag, value);
    }

    checkFlagExists(flag)
    {
        return this.playerData.checkFlagExists(flag);
    }

    saveGame()
    {
        return {playerInventory: this.inventory, playerWallet: this.wallet, ...this.playerData.saveGame()};
    }

    loadGame(saveFile)
    {
        this.wallet = Object.assign(new Wallet(), saveFile.playerWallet)
        this.inventory = Object.assign(new Inventory(), saveFile.playerInventory)
        this.inventory.initializeInventory();
        this.playerData = new PlayerData();
        this.playerData.loadGame(saveFile);
        this.playerData.setMoneyFlag(this.wallet.getMoneyRaw());
    }

    hasSeenScene(sceneId)
    {
        return this.playerData.checkFlagExists("player_seen_" + sceneId);
    }

    seenScene(sceneId)
    {
        this.playerData.setFlag("player_seen_" + sceneId, true);
    }

    checkFlagAgainstValue(flag, value)
    {
        return this.playerData.checkFlagAgainstValue(flag, value);
    }

    checkFlagIsOver(flag, value)
    {
        return this.playerData.checkFlagIsOver(flag, value);
    }

    checkFlagIsUnder(flag, value)
    {
        return this.playerData.checkFlagIsUnder(flag, value);
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

    boughtItems(shop)
    {
        this.inventory.boughtItems(shop.getSoldItems());
        this.playerData.setVisitedShop(shop);
    }

    getVisitedShopInventory(shopId)
    {
        return this.playerData.getVisitedShopInventory(shopId);
    }

    soldItems(items)
    {
        this.inventory.soldItems(items);
    }

    addItems(items)
    {
        for(let i = 0; i < items.length; i++)
        {
            this.addItem(items[i].item, items[i].quantity);
        }
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

    checkPurchasedFromShop(shopId)
    {
        return this.playerData.checkPurchasedFromShop(shopId);
    }

    getWallet()
    {
        return this.wallet;
    }
}

class PlayerData
{
    constructor(flags = {}, visitedShops = {})
    {
        this.flags = flags;
        this.visitedShops = visitedShops;
    }

    saveGame()
    {
        return {flags: this.flags, visitedShops: this.visitedShops};
    }

    loadGame(saveFile)
    {
        this.visitedShops = saveFile.visitedShops;
        this.flags = saveFile.flags;
    }

    setMoneyFlag(money)
    {
        this.flags["playerMoney"] = money;
    }

    setVisitedShop(shop)
    {
        this.visitedShops[shop.getShopId()] = shop.getFilteredInventory("all");
    }

    checkPurchasedFromShop(shopId)
    {
        return this.visitedShops.hasOwnProperty(shopId);
    }

    getFlag(flag)
    {
        return this.flags[flag];
    }

    incrementFlag(flag, value)
    {
        if(!this.checkFlagExists(flag))
        {
            this.flags[flag] = 0;
        }
        this.flags[flag] += value;
    }

    checkFlagAgainstValue(flag, value)
    {
        return this.flags[flag] == value;
    }

    checkFlagIsOver(flag, value)
    {
        if(!this.checkFlagExists(flag))
        {
            this.flags[flag] = 0;
        }
        return this.flags[flag] > value;
    }

    checkFlagIsUnder(flag, value)
    {
        if(!this.checkFlagExists(flag))
            {
                this.flags[flag] = 0;
            }
            return this.flags[flag] < value;
    }

    checkFlagExists(flag)
    {
        return this.flags.hasOwnProperty(flag);
    }

    setFlag(flag, value)
    {
        this.flags[flag] = value;
    }

    getVisitedShopInventory(shopId)
    {
        return this.visitedShops[shopId]
    }
}

export var player = new Player()
