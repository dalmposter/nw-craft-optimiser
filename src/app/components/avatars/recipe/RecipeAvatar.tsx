import { Checkbox, Dropdown, Grid } from "semantic-ui-react";
import { MWItem } from "../../../../lib/types/item";
import { ItemAvatar } from "../entity/ItemAvatar";
import { findMwObject } from "../../../../lib/types/util";

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
        <div className="flex-container">
            <div style={{flexGrow: 1}}>
                <Dropdown
                    className="ItemSelector"
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
            </div>
            <div style={{flexGrow: 1}}>
                <div>
                    <Checkbox 
                        label="+1?"
                        className="vertical-align"
                        toggle
                        onChange={(event, data) => {
                            props.updateHighQuality(data.checked? data.checked : false)
                        }}
                    />
                </div>
                {
                    props.activeItem &&
                    <div>
                        <p style={{textAlign: "right"}}>
                            {props.activeItem.unlock}
                        </p>
                        <p style={{textAlign: "right"}}>
                            Commission: {props.activeItem.commission}g
                        </p>
                    </div>
                }
            </div>
        </div>
        <Grid>
            <Grid.Column width={12}>
                {
                    props.activeItem && props.activeItem.recipe.map(
                        (value) => <ItemAvatar
                            key={`iAvatar-${value[1]}-${value[0]}`}
                            item={findMwObject(value[1])}
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