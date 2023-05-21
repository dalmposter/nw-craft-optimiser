import { Grid } from "semantic-ui-react";

import emptyIcon from "../../../../images/EmptyIcon.png"
import "./EntityAvatar.scss"
import { Artisan, Supplement, Tool } from "../../../../lib/types/recipe";

interface EntityAvatarProps {
    entity?: Artisan | Tool | Supplement;
    itemIcon?: any;
    size: "small" | "medium" | "large";
}

export function EntityAvatar (props: EntityAvatarProps) {
    if (props.size == "large") return EntityAvatarLarge(props);
    if (props.size == "medium") return EntityAvatarMedium(props);
    else return EntityAvatarMedium(props)
}

export function EntityAvatarMedium (props: EntityAvatarProps) {
    return (
    <div className="EntityAvatar" style={{textAlign: "center"}}>
        <img src={props.itemIcon? props.itemIcon : emptyIcon} />
        { props.entity &&
            <div>
                <p>{props.entity.name}</p>
            </div>
        }
    </div>
    );
}

export function EntityAvatarLarge (props: EntityAvatarProps) {
    return (
    <div className="EntityAvatar" style={{textAlign: "center"}}>
        <img src={props.itemIcon? props.itemIcon : emptyIcon} />
        { props.entity &&
            <div>
                <p style={{marginBottom: "12px"}}>
                    {props.entity.name}
                    {props.entity instanceof Artisan? ` [${props.entity.rarity}]` : ""}
                </p>
                <p>Proficiency: {props.entity.proficiency}</p>
                <p>Focus: {props.entity.proficiency}</p>
                { props.entity.dabHandChance > 0 &&
                    <p>{props.entity.dabHandChance * 100}% Dab Hand</p>
                }
                { props.entity.recycleChance > 0 &&
                    <p>{props.entity.recycleChance * 100}% Recycle</p>
                }
            </div>
        }
        
    </div>
    );
}