import React, { Component } from "react";

import { CraftCalcProps, CraftCalcState } from "./CraftCalc.types";
import { Artisan, MWRecipe, Supplement, Tool } from "../../lib/types/recipe";
import { CommissionItem, MWItem, MWResource } from "../../lib/types/item";
import { findMwItem, findMwObject } from "../../lib/types/util";
import { MWMaterial } from "../../lib/types/material";
import { Checkbox, Dropdown } from "semantic-ui-react";
import { RecipeAvatar } from "../components/avatars/recipe/RecipeAvatar";

import "./CraftCalc.scss"
import Footer from "../components/footer/Footer";
import { RecipeComboAvatar } from "../components/avatars/recipe/RecipeComboAvatar";
import { RecipeRanking } from "../components/avatars/recipe/RecipeRanking";
import Roadmap from "../roadmap/Roadmap";

export default class CraftCalc extends Component<CraftCalcProps, CraftCalcState> {
    fetchPromise?: Promise<boolean>;

    constructor(props: CraftCalcProps) {
        super(props);
        this.state = {
            input: "",
            availableItems: [],
            isHighQuality: false,
            output: "",
            outputList: []
        }
    }

    async fetchCsvs(): Promise<boolean> {
        return fetch(`${process.env.PUBLIC_URL}/input/resources.csv`)
            .then(res => res.text())
                .then(stringData => {
                    MWResource.loadCsv(stringData)
                })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/materials.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        MWMaterial.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/items.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        MWItem.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/artisans.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        Artisan.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/tools.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        Tool.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/supplements.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        Supplement.loadCsv(stringData)
            })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/commissions.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        CommissionItem.loadCsv(stringData)
                    })
            .then(() => {
                this.setState({
                    ...this.state,
                    availableItems: [...MWItem.OBJECTS.keys(), ...MWMaterial.OBJECTS.keys()]
                })
            })
            .then(() => console.debug("All CSV loaded"))
            // Quick hack to improve performance post-load: craft a couple of items to cache recipe results.
            .then(() => findMwItem("Silvervine Sceptor").craft())
            .then(() => findMwItem("Mastered Feathered Ilhuilli").craft())
            .then(() => true);
    }

    async craft(item: MWItem | undefined, highQuality: boolean) {
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

    componentDidMount() {
        if(this.fetchPromise) {
            return;
        }
        this.fetchPromise = this.fetchCsvs();
    }

    render() {
        return (
        <>
        <div className={`Panel`} id="craft-calc">
            <h1 style={{padding: "16px"}}>Neverwinter Masterwork Calculator</h1>
            <div className="flexbox">
                <div className="panel-content">
                    <RecipeAvatar
                        availableItems={this.state.availableItems}
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
                    { this.state.activeItem &&
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
                    </>
                    }
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
                </div>
            </div>
        </div>
        </>
        )
    }
}