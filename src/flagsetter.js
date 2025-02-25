import { gameDataAPI } from "./GameData";

export class FlagSetter
{
    constructor(flags = [])
    {
        this.flags = flags;
    }

    setFlags()
    {
        for(let i = 0; i < this.flags.length; i++)
        {
            switch(this.flags[i].action)
            {
                case "set":
                    gameDataAPI.setFlag(this.flags[i].flag, this.flags[i].value);
                    break;
                case "increment":
                    gameDataAPI.incrementFlag(this.flags[i].flag, this.flags[i].value);
            }
        }
    }
}