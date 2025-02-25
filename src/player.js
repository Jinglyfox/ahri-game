import globals from "./resources/data/globals.json"
import { Inventory } from "./inventory"
import playerDefault from "./resources/data/playerDefault.json"
import { StatBlock } from "./Stats";
import { Equipment } from "./Equipment";

class Player
{
    constructor(inventory = new Inventory(), money = 0, statBlock = new StatBlock(), equipment = new Equipment())
    {
        this.inventory = inventory;
        this.money = money;
        this.statBlock = statBlock;
        this.equipment = equipment;
    }

    saveGame()
    {
        return {playerInventory: this.inventory, playerMoney: this.money};
    }

    initializePlayer()
    {
        this.statBlock = Object.assign(new StatBlock(), playerDefault.statBlock);
        this.statBlock.initializeStatBlock();
        this.equipment = Object.assign(new Equipment(), playerDefault.equipment);
        this.equipment.initializeEquipment();
    }

    getEquippedItems()
    {
        return this.equipment;
    }

    equipItem(item)
    {
        if(this.equipment.getEquippedToSlot(item.getSlot()).getId() != "")
        {
            this.addItem(this.equipment.getEquippedToSlot(item.getSlot()).getId(), 1)
            this.equipment.unequipSlot(item.getSlot());
        }
        this.equipment.equipItem(item);
    }

    hasEquipped(itemId)
    {
        return this.equipment.hasEquipped(itemId);
    }

    getItemQuantity(itemId)
    {
        return this.inventory.getQuantity(itemId);
    }

    unequipItem(slot)
    {
        this.equipment.unequipSlot(slot);
    }

    addStats(stats)
    {
        this.statBlock.addStats(stats);
    }

    getStat(stat)
    {
        return this.statBlock.getStatValue(stat)
    }

    getStats()
    {
        return this.statBlock
    }

    setStats(statBlock)
    {
        this.statBlock = statBlock;
    }

    loadGame(saveFile)
    {
        this.money = saveFile.playerMoney;
        this.inventory = Object.assign(new Inventory(), saveFile.playerInventory)
        this.inventory.initializeInventory();
    }

    getUnsortedItems()
    {
        return this.inventory.getUnsortedItems();
    }

    canAfford(amount)
    {
        return this.money - amount >= 0;
    }

    addMoney(amount)
    {
        this.money += amount;
    }

    removeMoney(amount)
    {
        this.money -= amount;
    }

    getMoney()
    {
        return this.money;
    }

    setInventory(inventory)
    {
        this.inventory = inventory;
    }

    isInventoryEmpty()
    {
        return this.inventory.isEmpty();
    }

    boughtItems(items)
    {
        this.inventory.boughtItems(items);
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

    
}



export var player = new Player()
