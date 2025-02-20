import { player } from "./player";

export class Gate
{
    constructor(lock = new Lock())
    {
        this.lock = lock;
    }

    setLock()
    {
        this.lock = Object.assign(new Lock(), this.lock)
    }

    checkLock()
    {
        this.lock = Object.assign(new Lock(), this.lock);
        return this.lock.checkLock();
    }
}

class Lock
{
    constructor(type = "", flag = {}, key = "")
    {
        this.type = type;
        this.flag = flag;
        this.key = key;
    }
    
    checkLock()
    {
        switch(this.type)
        {
            case "flag":
                return player.checkFlagAgainstValue(this.flag, this.key);
            case "over":
                return player.checkFlagIsOver(this.flag, this.key)
            case "under":
                return player.checkFlagIsUnder(this.flag, this.key)
            case "":
                return true;
            default:
                Error("The lock does not contain a valid type.")
        }
    }
}