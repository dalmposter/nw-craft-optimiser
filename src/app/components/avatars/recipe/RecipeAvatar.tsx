import { Checkbox, Dropdown, Grid } from "semantic-ui-react";
import { MWItem } from "../../../../lib/types/item";
import { ItemAvatar } from "../entity/ItemAvatar";

import "./RecipeAvatar.scss"

interface RecipeAvatarProps {
    availableItems: string[];
    activeItem?: MWItem;
    onChangeItem: (value: string) => void;
    updateHighQuality: (value: boolean) => void;
}

export function RecipeAvatar (props: RecipeAvatarProps) {
    return (
    <div className="RecipeAvatar">
        <Grid>
            <Grid.Column width={7}>
                <Dropdown
                    placeholder='Select An Item'
                    fluid
                    search
                    selection
                    options={
                        props.availableItems.map((value: string) => {
                            return { key: value, value: value, text: value }
                        })
                    }
                    onChange={(event, data) => {
                        props.onChangeItem(data.value? data.value as string : "")
                    }}
                    value={props.activeItem?.name}
                />
            </Grid.Column>
            <Grid.Column className="no-side-padding" width={3}>
                <Checkbox 
                    label="+1?"
                    className="vertical-align"
                    toggle
                    onChange={(event, data) => {
                        props.updateHighQuality(data.checked? data.checked : false)
                    }}
                />
            </Grid.Column>
            <Grid.Column width={6}>
                {
                    props.activeItem &&
                    <div style={{width: "100%", boxSizing: "border-box"}}>
                        <p style={{textAlign: "right"}}>
                            {props.activeItem.unlock}
                        </p>
                        <p style={{textAlign: "right"}}>
                            Commission: {props.activeItem.commission}g
                        </p>
                    </div>
                }
            </Grid.Column>
        </Grid>
        <Grid>
            <Grid.Column width={12}>
                {
                    props.activeItem && props.activeItem.recipe.map(
                        (value) => <ItemAvatar
                            key={`iAvatar-${value[1]}-${value[0]}`}
                            itemName={value[1]}
                            quantity={value[0]}
                            onClick={props.onChangeItem}
                        />
                    )
                }
            </Grid.Column>
            <Grid.Column width={4}>
                {
                    props.activeItem &&
                    <div style={{width: "100%", boxSizing: "border-box"}}>
                        <p style={{textAlign: "right"}}>
                            Proficiency: {props.activeItem.proficiency}
                        </p>
                        <p style={{textAlign: "right"}}>
                            Focus: {props.activeItem.focus}
                        </p>
                        <p style={{textAlign: "right"}}>
                            Yield: {props.activeItem.quantity}
                        </p>
                        <p style={{textAlign: "right"}}>
                            Can Dab Hand? {props.activeItem.canDabHand? "Yes" : "No"}
                        </p>
                    </div>
                }
            </Grid.Column>
        </Grid>
    </div>
    );
}