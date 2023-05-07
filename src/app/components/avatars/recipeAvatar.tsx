import { Checkbox, Dropdown, Grid } from "semantic-ui-react";
import { MWItem } from "../../../lib/types/item";
import { ItemAvatar } from "./itemAvatar";

interface RecipeAvatarProps {
    availableItems: string[];
    activeItem?: MWItem;
    onChangeItem: ((value: string) => void)
    updateHighQuality: ((value: boolean) => void)
}

export function RecipeAvatar (props: RecipeAvatarProps) {
    return (
    <div className="ItemAvatarProps">
        <Grid centered columns={3} >
            <Grid.Column>
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
                />
            </Grid.Column>
            <Grid.Column className="no-side-padding">
                <Checkbox 
                    label="High Quality?"
                    className="vertical-align"
                    toggle
                    onChange={(event, data) => {
                        props.updateHighQuality(data.checked? data.checked : false)
                    }}
                />
            </Grid.Column>
            <Grid.Column>
                {
                    props.activeItem &&
                    <div className="vertical-align">
                        <div>
                            {props.activeItem.profession}
                        </div>
                        <div>
                            {props.activeItem.commission} gold
                        </div>
                    </div>
                }
            </Grid.Column>
        </Grid>
        <Grid centered columns={2}>
            <Grid.Column>
                {
                    props.activeItem && props.activeItem.recipe.map(
                        (value) => <ItemAvatar
                            key={`iAvatar-${value[1]}-${value[0]}`}
                            itemName={value[1]}
                            quantity={value[0]}
                        />
                    )
                }
            </Grid.Column>
        </Grid>
    </div>
    );
}