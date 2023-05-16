import { Grid } from "semantic-ui-react";

import emptyIcon from "../../../images/EmptyIcon.png"
import { Artisan, Supplement, Tool } from "../../../lib/types/recipe";

import "./EntityAvatar.scss"

interface EntityAvatarProps {
    entity?: Artisan | Tool | Supplement;
    itemIcon?: any;
}

export function EntityAvatar (props: EntityAvatarProps) {
    return (
    <div className="EntityAvatar" style={{textAlign: "center"}}>
        <img src={props.itemIcon? props.itemIcon : emptyIcon} />
        { props.entity && <p>{props.entity.name}</p> }
    </div>
    );
}