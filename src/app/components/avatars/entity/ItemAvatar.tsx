import { Grid } from "semantic-ui-react";
import { CraftedMWObject, MWItem, MWResource } from "../../../../lib/types/item";
import React from "react";
import { ItemIcon, ItemIconProps, ResourceIcon, ResourceIconProps } from "./ItemIcon";

import "./ItemAvatar.scss"

interface ItemAvatarProps {
    quantity?: number;
    item: CraftedMWObject | MWResource;
    itemIcon?: any;
    onClick?: (name: string) => void;
}

export function ItemAvatar (props: ItemAvatarProps) {
    return (
    <Grid className={`ItemAvatar ${props.item instanceof MWResource}`}>
        {props.quantity &&  
            <Grid.Column
                width={4}
                textAlign="right"
                className="no-top-padding"
            >
                <p>{props.quantity}x</p>
            </Grid.Column>
        }

        <Grid.Column className="no-top-padding width-fit-content" >
            { props.item instanceof MWResource
                ?
                <ResourceIcon {...props as ResourceIconProps} />
                :
                <ItemIcon {...props as ItemIconProps} />
            }
        </Grid.Column>

        <Grid.Column width={8} className="no-top-padding">
            { props.item instanceof MWResource ?
                <p
                    style={{height: "fit-content"}}
                >
                    {props.item.name}
                </p>
                :
                <p
                    style={{height: "fit-content", cursor: "pointer"}}
                    onClick={props.onClick? () => props.onClick!(props.item.name) : undefined}
                >
                    {props.item.name}
                </p>
            }
        </Grid.Column>
    </Grid>
    );
}