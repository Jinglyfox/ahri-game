import React from "react";
import { Button } from "../atoms/Button";

export function QuantityButton(props)
{
    let children = props.children;
    let onClick = props.onClick;
    let disabled = props.disabled;

    return (
        <Button 
            className="itemCardQuantityChange"
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}