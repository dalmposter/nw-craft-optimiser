import React, { Component } from "react";

import { CraftCalcProps, CraftCalcState } from "./CraftCalc.types";
import { Artisan, MWRecipe, Supplement, Tool } from "../../lib/types/recipe";
import { CommissionItem, MWItem, MWResource } from "../../lib/types/item";
import { findMwItem, findMwObject } from "../../lib/types/util";
import { MWMaterial } from "../../lib/types/material";
import { ItemAvatar } from "../components/avatars/ItemAvatar";
import { Checkbox, Dropdown } from "semantic-ui-react";
import { RecipeAvatar } from "../components/avatars/RecipeAvatar";
import { RecipeComboAvatar } from "../components/avatars/RecipeComboAvatar";

import "./CraftCalc.scss"
import Footer from "../components/footer/Footer";

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
            .then(() => true);
    }

    craft(item: MWItem | undefined, highQuality: boolean) {
        if (item === undefined) {
            console.log("craft called with undefined item. Returning")
            return
        }
        let result = item.getOptimalRecipes(highQuality);
        result.then((output) => {
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
        <div className="craft-calc" >
            <div className={`Panel`}>
                <h1 style={{padding: "16px"}}>Neverwinter Masterwork Calculator</h1>
                <div className="flexbox">
                    <div className="panel-content">
                        <RecipeAvatar
                            availableItems={this.state.availableItems}
                            onChangeItem={(value) => {
                                this.setState({
                                    ...this.state,
                                    input: value,
                                    activeItem: value != ""? findMwItem(value) : undefined
                                })}
                            }
                            updateHighQuality={(value: boolean) => {
                                this.setState({
                                    ...this.state,
                                    isHighQuality: value
                                })
                            }}
                            activeItem={this.state.activeItem}
                        />
                        <div>
                            <button onClick={() => this.craft(this.state.activeItem, this.state.isHighQuality)}>
                                Craft
                            </button>
                        </div>
                        <div>
                            { /* <textarea cols={120} rows={35} value={this.state.output} /> */ }
                            {this.state.outputList.map(
                                (value, index) => <RecipeComboAvatar
                                                        rank={index + 1}
                                                        cost={value[1]}
                                                        recipe={value[0]}
                                                        key={`craftCalc-rcAvatar-${index}`}
                                                    />
                            )}
                        </div>
                    </div>
                </div>
            </div>
		    <Footer />
        </div>
        </>
        )
    }
}