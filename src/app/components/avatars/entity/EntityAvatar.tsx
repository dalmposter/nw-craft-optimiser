import { Grid, Popup } from "semantic-ui-react";

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
    let skillName = "None";
    let skillChance = 0;
    if(props.entity) {
        [skillName, skillChance] = props.entity?.getSkill();
    }

    if(props.entity) {
        return (
        <div className="EntityAvatar" style={{textAlign: "center"}}>
            <Popup
                className="EntityIcon"
                trigger={<img src={props.itemIcon? props.itemIcon : emptyIcon} />}
                flowing hoverable
            >
                <div>
                    <h4>
                        {props.entity.name}
                        {props.entity instanceof Artisan ? ` [${props.entity.rarity}]` : ""}
                    </h4>
                    {props.entity.proficiency > 0 &&
                        <p>+{props.entity.proficiency} proficiency</p>
                    }
                    {props.entity.focus > 0 &&
                        <p>+{props.entity.focus} focus</p>
                    }
                    {props.entity instanceof Artisan &&
                    <>
                        <p>
                            {props.entity.speedModifier >= 0? "+" : ""}
                            {props.entity.speedModifier * 100}% speed
                        </p>
                        <p>
                            {props.entity.commissionModifier >= 0? "+" : ""}
                            {props.entity.commissionModifier * 100}% comission
                        </p>
                    </>
                    }
                    {skillName != "None" &&
                        <p>Special Skill: {skillName} ({skillChance * 100}%)</p>
                    }
                </div>
            </Popup>
            <div className="EntityAvatar" style={{textAlign: "center"}}>
                <p>{props.entity.name}</p>
            </div>
        </div>
        )
    } else {
        return <img src={props.itemIcon? props.itemIcon : emptyIcon} />
    }
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