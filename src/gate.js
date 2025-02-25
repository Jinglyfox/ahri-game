import { player } from "./player";
import { gameDataAPI } from "./GameData";

export class Gate
{
    constructor(locks = [])
    {
        this.locks = locks;
    }

    checkLocks()
    {
        for(let lock of this.locks)
        {
            lock = Object.assign(new Lock(), lock);
            if(!lock.checkLock())
            {
                return false
            }
        }
        return true;
    }
}

class Lock
{
    constructor(type = "", flag = {}, key = new Key())
    {
        this.type = type;
        this.flag = flag;
        this.key = key;
    }
    
    checkLock()
    {
        this.key = Object.assign(new Key(), this.key);
        //console.log(this.key);
        switch(this.type)
        {
            case "flag":
                return this.key.turnKey(gameDataAPI.getFlag(this.flag))
            case "stat":
                return this.key.turnKey(player.getStat(this.flag))
            case "item":
                return this.key.turnKey(player.getItemQuantity(this.flag))
            case "equipped":
                return this.key.turnKey(player.hasEquipped(this.flag))
            case "":
                return true;
            default:
                Error("The lock does not contain a valid type.")
        }
    }

    getType()
    {
        return this.type;
    }
}

class Key
{
    constructor(value="", check = "")
    {
        this.value = value;
        this.check = check;
    }

    turnKey(testValue)
    {
        //console.log(testValue + " " + this.value + " " + this.check);
        switch(this.check)
        {
            case "equal":
                return testValue == this.value;
            case "notequal":
                return testValue != this.value;
            case "over": 
                return testValue > this.value;
            case "under":
                return testValue < this.value;
            default:
                Error("Invalid check value " + this.check + " provided for key.")
        }
    }
}