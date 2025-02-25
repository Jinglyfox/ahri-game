import React from "react";
import { input } from "../../data";
import { Button } from "../atoms/Button";

export function ReportUI(props) {
    let updateGame = props.updateGame;

    function closeReport()
    {
        input.menuClosed()
        updateGame();
    }

    return (
        <div>
            <Button onClick={closeReport}>
                Advance
            </Button>
        </div>
    )
}