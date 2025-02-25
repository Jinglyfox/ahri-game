import globals from "./resources/data/globals.json"

export class Money
{
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

	static formatPrice(price)
	{
		let startDenom = false;
		let priceString = [];
		for(let i = price.length - 1; i >= 0; i--)
		{
			if(price[i] !== 0 || startDenom)
			{
				priceString.push(<span key={i}>{price[i]}{globals.denomAbbrevs[i]}</span>);
				startDenom = true;
			}
		}
		return priceString;
	}
}