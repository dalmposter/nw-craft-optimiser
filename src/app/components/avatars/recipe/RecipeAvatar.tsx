import { Checkbox, Dropdown, Grid } from "semantic-ui-react";
import { CraftedMWObject, MWItem } from "../../../../lib/types/item";
import { ItemAvatar } from "../entity/ItemAvatar";

import "./RecipeAvatar.scss"
import { findMwObject } from "../../../../lib/types/util";
import { ItemFilter, MWCategory } from "../../../craftCalc/CraftCalc.types";

interface RecipeAvatarProps {
    availableItems: CraftedMWObject[];
    activeItem?: CraftedMWObject;
    itemFilter: ItemFilter;
    onChangeItem: (value: string) => void;
    updateHighQuality: (value: boolean) => void;
    updateFilter: (value: ItemFilter) => void;
}

const classes = ["Barbarian", "Bard", "Cleric", "Fighter", "Paladin",
                 "Ranger", "Rogue", "Warlock", "Wizard"]

const types = ["Commissioned Item", "Gear", "Potion", "Supplement", "Tool"]

const slots = ["Armor", "Arms", "Belt", "Feet", "Head", "Main Hand",
               "N/A", "Neck", "Off-Hand", "Ring", "Waist"]

export function RecipeAvatar (props: RecipeAvatarProps) {
    let options = props.availableItems
        .filter((item) => {
            if(props.itemFilter.mwCategory
                    && props.itemFilter.mwCategory.length > 0
                    && !props.itemFilter.mwCategory.some((value) => value === item.mwCategory)
            ) {
                return false
            }
            if(props.itemFilter.type
                    && props.itemFilter.type.length > 0
                    && !props.itemFilter.type.some((value) => value === item.type)
            ) {
                return false
            }
            if(props.itemFilter.class) {
                if(!(item instanceof MWItem)) {
                    return false
                }
                else if(props.itemFilter.class.length > 0
                        && !item.requiredClasses.some((value) => props.itemFilter!.class!.includes(value))
                ) {
                    return false
                }
            }
            if(props.itemFilter.slot) {
                if(!(item instanceof MWItem)) {
                    return false
                }
                else if(props.itemFilter.slot.length > 0
                    && !props.itemFilter!.slot.some((value) => value == item.itemSlot)
                ) {
                    return false
                }
            }
            return true
        })
        .map((value: CraftedMWObject) => {
            return { key: value.name, value: value.name, text: value.name }
        })

    return (
    <div className="RecipeAvatar">
        <div style={{display: "flex"}}>
            <div style={{width: "fit-content", minWidth: "380px"}}>
                <Dropdown
                    placeholder='Filter by Masterwork Era'
                    fluid multiple selection
                    onChange={(event, data) => {
                        props.updateFilter({
                            ...props.itemFilter,
                            mwCategory: data.value as MWCategory[]
                        })
                    }}
                    options={[
                        { key: "Chultan Masterwork", text: "Chultan Masterwork", value: "Chultan Masterwork"},
                        { key: "Sharandar Masterwork", text: "Sharandar Masterwork", value: "Sharandar Masterwork"},
                        { key: "Menzoberranzan Masterwork", text: "Menzoberranzan Masterwork", value: "Menzoberranzan Masterwork"},
                    ]}
                />
            </div>
            <div style={{width: "fit-content", minWidth: "380px"}}>
                <Dropdown
                    placeholder='Filter by Class'
                    fluid multiple selection
                    onChange={(event, data) => {
                        props.updateFilter({
                            ...props.itemFilter,
                            class: data.value as MWCategory[]
                        })
                    }}
                    options={classes.map((value) => {
                        return { key: value, text: value, value: value }
                    })}
                />
            </div>
            <div style={{width: "fit-content", minWidth: "380px"}}>
                <Dropdown
                    placeholder='Filter by Item Category'
                    fluid multiple selection
                    onChange={(event, data) => {
                        props.updateFilter({
                            ...props.itemFilter,
                            type: data.value as string[]
                        })
                    }}
                    options={types.map((value) => {
                        return { key: value, text: value, value: value }
                    })}
                />
            </div>
            <div style={{width: "fit-content", minWidth: "380px"}}>
                <Dropdown
                    placeholder='Filter by Slot'
                    fluid multiple selection
                    onChange={(event, data) => {
                        props.updateFilter({
                            ...props.itemFilter,
                            slot: data.value as string[]
                        })
                    }}
                    options={slots.map((value) => {
                        return { key: value, text: value, value: value }
                    })}
                />
            </div>
        </div>
        <Grid>
            <Grid.Column width={7}>
                <Dropdown
                    placeholder='Select An Item'
                    fluid
                    search
                    selection
                    options={options}
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