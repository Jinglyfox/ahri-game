import globals from "./resources/data/globals.json"

export class Wallet
{
	constructor(rawValue = 0, denominations = new Array(0, 0, 0, 0))
	{
		this.rawValue = rawValue;
		this.denominations = denominations;
	}

	getRawValue()
	{
		return this.rawValue;
	}

    getProcessedMoney()
    {
        return this.denominations
    }

	tester(amount)
	{
		return Money.convertToString(amount);
	}

	addMoney(amount, type = null)
	{
		let rawValue = amount;
		if(amount instanceof Object)
        {
            rawValue = Money.convertDenomsToRaw(amount)
        }
        else if(type !== null)
		{
			rawValue = Money.convertDenomToRaw(amount, type);
		}
		this.rawValue += rawValue;
		this.denominations = Money.convertRawToDenoms(this.rawValue);
	}

	removeMoney(amount, type=null)
	{
		if(this.canAfford(amount, type))
		{
			let rawValue = amount;
			if(rawValue instanceof Object)
			{
				rawValue = Money.convertDenomsToRaw(amount);
			}
			else if(type !== null)
			{
				rawValue = Money.convertDenomToRaw(amount, type);
			}
			this.rawValue -= rawValue;
		}
		else
		{
			return false;
		}
		
		this.denominations = Money.convertRawToDenoms(this.rawValue);
	}

	canAfford(amount, type=null)
	{
		let rawValue = amount;
		//convert denominations to a raw money value
		if(rawValue instanceof Object)
		{
            rawValue = Money.convertDenomsToRaw(amount);
		}
		else if(type !== null)
		{
			rawValue = Money.convertDenomToRaw(amount, type);
		}
		return (this.rawValue - rawValue >= 0);
	}
}

export class Money
{
	constructor()
	{

	}

	static convertRawToDenoms(amount)
	{
		let negative = false;
		
		let rawValue = amount;

		if(!(rawValue instanceof Object))
		{
			if(rawValue < 0)
			{
				negative = true;
				rawValue = Math.abs(rawValue);
			}
			let denominations = new Array(0, 0, 0, 0,);
			for(let i = 0; i < globals.denoms.length; i++)
			{
				denominations[i] = rawValue % globals.denoms[i];
				rawValue = Math.floor(rawValue / globals.denoms[i]); 
			}
			denominations[denominations.length - 1] = rawValue;
			return denominations;
		}
		else
		{
			return amount;
		}
	}

	static convertDenomsToRaw(amount)
	{
        if(amount instanceof Object)
		{
			let rawValue = 0;
			for(let i = 0; i < amount.length; i++)
			{
                if(i !== 0)
				{
					let mult = 1;
					for(let j = 0; j < i; j++)
					{
                        mult *= globals.denoms[j];
					}
					rawValue += (amount[i] * mult);
				}
				else
				{
					rawValue += amount[i];
				}
			}
			return rawValue;
		}
		else {
			return amount;
		}
	}

	//converts one type to raw number. type can be an abbreviation or a full denomation name e.g. copper vs cp
	static convertDenomToRaw(amount, type)
	{
        if(globals.denomAbbrevs[0] === type || globals.denomNames[0] === type)
		{
			return amount;
		}
		else
		{
			let convertedValue = amount;
            let index = 1;
            let foundIndex = false;
            for(let denomination in globals.denomNames)
            {
                if(denomination === type)
                {
                    index += 1;
                    foundIndex = true;
                    break;
                }
                index += 1;
            }
            if(!foundIndex)
            {
                index = 1;
                for(let denomination in globals.denomAbbrevs)
                {
                if(denomination === type)
                {
                    index += 1;
                    break;
                }
                index += 1;
                }
            }
			for(let i = 0; i < index; i++)
			{
				convertedValue *= globals.denoms[i];
			}
			return convertedValue;
		}
	}

	static convertToString(amount)
	{
		let moneyAsDenoms = amount;
		if(!Array.isArray(amount))
		{
			moneyAsDenoms = this.convertRawToDenoms(amount);
		}
		let firstDenomFound = "";
		let lastDenomFound = "";
		let convertedString = "";
		let totalFound = 0;
		for(let i = moneyAsDenoms.length - 1; i >= 0; i--)
		{
			if(moneyAsDenoms[i] !== 0 && firstDenomFound === "")
			{
				firstDenomFound = `${moneyAsDenoms[i]} ${globals.denomNames[i]}`
				convertedString += firstDenomFound;
				totalFound++;
			}
			else if(moneyAsDenoms[i] !== 0 && lastDenomFound === "")
			{
				lastDenomFound = `${moneyAsDenoms[i]} ${globals.denomNames[i]}`;
				totalFound++;
			}
			else if(moneyAsDenoms[i] !== 0)
			{
				convertedString = `${convertedString}, ${lastDenomFound}`
				lastDenomFound = `${moneyAsDenoms[i]} ${globals.denomNames[i]}`;
				totalFound++;
			}
		}
		if(totalFound > 1)
		{
			convertedString = `${convertedString}, and ${lastDenomFound}`
		}
		return convertedString;
	}
}