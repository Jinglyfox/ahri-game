import { player } from "./player";

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
                    player.setFlag(this.flags[i].flag, this.flags[i].value);
                    break;
                case "increment":
                    player.incrementFlag(this.flags[i].flag, this.flags[i].value);
            }
        }
    }
}