import { Grid } from "semantic-ui-react";

import emptyIcon from "../../../../images/EmptyIcon.png"

import "./ItemAvatar.scss"

interface ItemAvatarProps {
    quantity?: number;
    itemName: string;
    itemIcon?: any;
}

export function ItemAvatar (props: ItemAvatarProps) {
    return (
    <Grid className="ItemAvatar">
        {props.quantity &&  <Grid.Column
                                width={4}
                                textAlign="right"
                                className="no-top-padding"
                            >
                                <p>{props.quantity}x</p>
                            </Grid.Column>
        }

        <Grid.Column className="no-top-padding width-fit-content" >
            <img src={props.itemIcon? props.itemIcon : emptyIcon} />
        </Grid.Column>

        <Grid.Column width={8} className="no-top-padding">
            <p>{props.itemName}</p>
        </Grid.Column>
    </Grid>
    );
}