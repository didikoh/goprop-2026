import { useState } from "react";
import BottomMenu from "../menuWidgets/BottomMenu";
import RightWidget from "../geoclimateWidgets/RightWidget";

export function FullBottomWidget() {
    
    

    return (
        <div className="widget">
            <RightWidget mapType="3d" location="kl" />
            <BottomMenu />
        </div>
    );
}
