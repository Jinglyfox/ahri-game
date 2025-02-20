import React from 'react';
import { Button } from '../atoms/Button';

export function ShopDockButton(props)
{
    let active = props.active;
    let disabled = props.disabled;
    let onClick = props.onClick;
    let children = props.children
    return (
        <Button className={`shopDockButton ${active ? 'active' : ''}`} disabled={disabled} onClick={onClick}>
            {children}
        </Button>
    )
}