import React, { Component } from "react";

import { CraftCalcProps, CraftCalcState } from "./CraftCalc.types";
import { Artisan, MWRecipe, Supplement, Tool } from "../../lib/types/recipe";
import { CommissionItem, CraftedMWObject, MWItem, MWResource } from "../../lib/types/item";
import { findMwItem } from "../../lib/types/util";
import { MWMaterial } from "../../lib/types/material";
import { RecipeAvatar } from "../components/avatars/recipe/RecipeAvatar";
import { RecipeRanking } from "../components/avatars/recipe/RecipeRanking";

import "./CraftCalc.scss"

export default class CraftCalc extends Component<CraftCalcProps, CraftCalcState> {
    fetchPromise?: Promise<boolean>;

    // TODO: Move some state into App class
    INITIAL_STATE = {
        input: "",
        isHighQuality: false,
        output: "",
        outputList: [],
        itemFilter: {}
    }

    constructor(props: CraftCalcProps) {
        super(props);
        this.state = this.INITIAL_STATE;
    }

    async craft(item: CraftedMWObject | undefined, highQuality: boolean) {
        if (item === undefined) {
            console.log("craft called with undefined item. Returning")
            return
        }
        let result = item.getOptimalRecipes(highQuality);
        return result.then((output) => {
            console.log(MWRecipe.prettyPrintList(output));
            this.setState({
                ...this.state,
                output: MWRecipe.prettyPrintList(output),
                outputList: output
            })
        });
    }

    arePricesViewable = (item: CraftedMWObject) => {
        return item.mwCategory != "Menzoberranzan Masterwork" || this.props.unlocked
    }

    render() {
        return (
        <>
        <div className={`Panel`} id="craft-calc">
            <h1 style={{padding: "16px"}}>Neverwinter Masterwork Calculator</h1>
            { false &&
                <p style={{fontSize: "80%", color: "darkred", marginBottom: 0}}>
                    Please be aware that although I present the Menzoberranzan recipes, they are
                    not yet finalised. In addition, the recipes for intermediate materials, such
                    as Mushroom Lumber, are not actually revealed. The recipes I present are
                    extrapolations I have made based on those we do know. Also, the prices are
                    only shown for illustration purposes (and because this app would be confused
                    by all items costing 0). The items are not available yet so there is no
                    market price.
                </p>
            }
            <div className="flexbox">
                <div className="panel-content">
                    <RecipeAvatar
                        availableItems={this.props.availableItems}
                        itemFilter={this.state.itemFilter}
                        updateFilter={(filter) => this.setState({
                            ...this.state,
                            itemFilter: filter
                        })}
                        onChangeItem={(value) => {
                            try {
                                this.setState(
                                    {
                                        ...this.state,
                                        input: value,
                                        activeItem: value != ""? findMwItem(value) : undefined
                                    },
                                    () => this.craft(this.state.activeItem, this.state.isHighQuality)
                                )
                            } catch {
                                console.log("User clicked a resource. Not updating active item.")
                            }
                        }}
                        updateHighQuality={(value: boolean) => {
                            this.setState(
                                {
                                    ...this.state,
                                    isHighQuality: value
                                },
                                () => this.craft(this.state.activeItem, this.state.isHighQuality)
                            )
                        }}
                        activeItem={this.state.activeItem}
                    />
                    { this.state.activeItem && this.arePricesViewable(this.state.activeItem) &&
                    <>
                        <p>
                            {this.state.isHighQuality ?
                                `Calculated cost to craft 1 ${this.state.activeItem.name} +1`
                                + " (normal quality results are considered 'waste'). Overall cost will be"
                                + " for 1 high quality result plus the displayed quantity of normal results."
                                + " Showing cheapest 10 combinations of Artisan + Tool + Supplement."
                                :
                                `Calculated cost to craft 1 ${this.state.activeItem.name} of either quality.`
                                + " The overall cost will be for 1 item of any quality. On average they will"
                                + " be obtained in the displayed ratio of normal and high quality versions."
                                + " Showing cheapest 10 combinations of Artisan + Tool + Supplement."
                            }
                        </p>
                        <p>
                            Note that the expected attempts can be less than 1. This
                            is correct because if the recipe yield is more than one
                            then you only need a fraction of a success to obtain 1
                            item. Likewise if dab hand is in play then you also need
                            less than 1 success to obtain 1 item.
                        </p>
                        <RecipeRanking
                            orderedRecipes={this.state.outputList}
                            onItemClick={(name: string) => {
                                try {
                                    this.setState({
                                        ...this.state,
                                        activeItem: findMwItem(name)
                                    })
                                } catch {
                                    console.log("User clicked on a resource. Not updating active item.")
                                }
                            }}
                        />
                    </>
                    }
                    { this.state.activeItem && !this.arePricesViewable(this.state.activeItem) &&
                        <h3>
                            Prices and intermediate recipes for Menzoberranzan MW are currently unknown.
                            Enable speculative recipes on the settings page to view potentially inaccurate information
                        </h3>
                    }
                </div>
            </div>
        </div>
        </>
        )
    }
}