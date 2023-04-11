import React, { Component } from "react";

import { CraftCalcProps, CraftCalcState } from "./CraftCalc.types";
import { Artisan, MWRecipe, Supplement, Tool } from "../lib/types/recipe";
import { CommissionItem, MWItem, MWResource } from "../lib/types/item";
import { findMwItem, findMwObject } from "../lib/types/util";
import { MWMaterial } from "../lib/types/material";
import { ItemAvatar } from "./components/avatars/itemAvatar";
import { Checkbox, Dropdown } from "semantic-ui-react";

export default class CraftCalc extends Component<CraftCalcProps, CraftCalcState> {
    fetchPromise?: Promise<boolean>;

    constructor(props: CraftCalcProps) {
        super(props);
        this.state = {
            input: "",
            availableItems: [],
            isHighQuality: false,
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

    craft() {
        let inputName = this.state.input;
        let highQuality = this.state.isHighQuality;
        let item = findMwItem(inputName);
        let result = item.getOptimalRecipes(highQuality);
        result.then((output) => {
            console.log(MWRecipe.prettyPrintList(output));
            this.setState({...this.state, output: MWRecipe.prettyPrintList(output)})
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
        <div className="CraftCalc" >
            <ItemAvatar itemName={this.state.input}></ItemAvatar>
            <Dropdown
                placeholder='Select An Item'
                fluid
                search
                selection
                options={
                    this.state.availableItems.map((value: string) => {
                        return {
                            key: value, value: value, text: value
                        }
                    })
                }
                onChange={(event, data) => {
                    this.setState({
                        ...this.state,
                        input: data.value? data.value as string : ""
                    })}
                }
            />
            <Checkbox label="High Quality?" toggle onChange={(event, data) => {
                this.setState({
                    ...this.state,
                    isHighQuality: data.checked? data.checked : false
                })
            }} />
            <button onClick={() => this.craft()}>
                Craft
            </button>
            <textarea cols={120} rows={40} value={this.state.output} />
        </div>
        )
    }
}