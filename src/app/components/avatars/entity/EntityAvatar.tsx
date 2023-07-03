import { Popup } from "semantic-ui-react";

import emptyIcon from "../../../../images/EmptyIcon.png"
import "./EntityAvatar.scss"
import { Artisan, Supplement, Tool } from "../../../../lib/types/recipe";
import { getFileName, images } from "../icon";

interface EntityAvatarProps {
    entity?: Artisan | Tool | Supplement;
    size: "small" | "medium" | "large";
}

export function EntityAvatar (props: EntityAvatarProps) {
    if (props.size === "large") return EntityAvatarLarge(props);
    if (props.size === "medium") return EntityAvatarMedium(props);
    else return EntityAvatarMedium(props)
}

export function EntityAvatarMedium (props: EntityAvatarProps) {
    let skillName = "None";
    let skillChance = 0;
    if(props.entity) {
        [skillName, skillChance] = props.entity?.getSkill();
    }

    if(props.entity) {
        let fileName = getFileName(props.entity.name);
        let itemIcon = images.get(fileName);
        let highQualityFlair = images.get("high-quality-flair.png");
        
        return (
        <div className="EntityAvatar">
            <Popup
                className="EntityIcon"
                trigger={
                    <div style={{width: "fit-content", position: "relative"}}>
                        { props.entity.name.split("+1").length > 1 &&
                            <img style={
                                    {
                                        width: "25%",
                                        height: "25%",
                                        position: "absolute",
                                        left: "12.5%",
                                        top: "12.5%"
                                    }
                                }
                                src={highQualityFlair? highQualityFlair : emptyIcon}
                                alt="+1 Flair"
                            />
                        }
                        <img
                            className="Icon"
                            src={itemIcon? itemIcon : emptyIcon}
                            alt={`${props.entity.name} Icon`}
                        />
                    </div>
                }
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
                    {skillName !== "None" &&
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
        return <img className="Icon" src={emptyIcon} alt="unknown item" />
    }
}

export function EntityAvatarLarge (props: EntityAvatarProps) {

    let fileName = getFileName(props.entity?.name);
    let itemIcon = images.get(fileName);

    return (
    <div className="EntityAvatar" style={{textAlign: "center"}}>
        <img src={itemIcon? itemIcon : emptyIcon} className="Icon" alt={`${props.entity?.name}`} />
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