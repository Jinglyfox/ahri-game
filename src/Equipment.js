import { itemData } from "./items";
import { InventoryItem } from "./inventory";
import { player } from "./player";

export class Equipment
{
    constructor(equipment={}, equipmentSlotOrder = [])
    {
        this.equipment = equipment;
        this.equipmentSlotOrder = equipmentSlotOrder;
    }

    initializeEquipment()
    {
        for(let slot in this.equipment)
        {
            if(this.equipment[slot] == null)
            {
                this.equipment[slot] = new InventoryItem();
                
            }
            else
            {
                this.equipment[slot] = new InventoryItem(itemData.getItemById(this.equipment[slot]), 1, ["equipped"]);
            }
        }
    }

    hasEquipped(itemId)
    {
        for(let slot in this.equipment)
        {
            if(this.equipment[slot].getId() == itemId)
            {
                return true;
            }
        }
        return false;
    }

    getEquipmentSlotOrder()
    {
        return this.equipmentSlotOrder;
    }

    equipItem(item)
    {
        if(!this.equipment[item.getSlot()].getId() == "")
        {
            this.unequipSlot(item.getSlot());
        }
        this.equipment[item.getSlot()] = new InventoryItem(itemData.getItemById(item.getId()), 1, ["equipped"]);
        console.log(this.equipment[item.getSlot()]);
    }

    unequipSlot(slot)
    {
        this.equipment[slot] = new InventoryItem();
    }

    getEquippedToSlot(slot)
    {
        return this.equipment[slot];
    }
}