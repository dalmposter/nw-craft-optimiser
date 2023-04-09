import React, { Component } from "react";

import { CraftCalcProps, CraftCalcState } from "./CraftCalc.types";
import { Artisan, MWRecipe, Supplement, Tool } from "../types/recipe";
import { CommissionItem, MWItem, MWResource } from "../types/item";
import { findMwItem, findMwObject } from "../types/util";
import { MWMaterial } from "../types/material";

export default class CraftCalc extends Component<CraftCalcProps, CraftCalcState> {
    fetchPromise?: Promise<boolean>;

    constructor(props: CraftCalcProps) {
        super(props);
        this.state = {
            input: ""
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
            .then(() => console.log("All CSV loaded"))
            .then(() => true);
    }

    craft() {
        let inputName = this.state.input;
        let highQuality = false;
        if(inputName.slice(-3) == " +1") {
            highQuality = true;
            inputName = inputName.slice(0, -3);
        }
        let item = findMwItem(inputName);
        let result = item.getOptimalRecipes(highQuality);
        result.then(MWRecipe.prettyPrintList);
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
            <input type="text" onChange={(event) => { this.state = { ...this.state, input: event.target.value } }}>
            </input>
            <button onClick={() => this.craft()}>
                Craft
            </button>
            <button onClick={() => {
                let testItem = findMwObject("Weeping Willow's Tears", false)
                console.log(testItem.name)
                console.log(testItem.price! * 100)
            }}>
                check number
            </button>
            <button onClick={() => {
                console.log(`Resources: `, MWResource.OBJECTS)
                console.log(`Materials: `, MWMaterial.OBJECTS)
                console.log(`Items: `, MWItem.OBJECTS)
                console.log(`Tools: `, Tool.OBJECTS)
                console.log(`Artisans: `, Artisan.OBJECTS)
                console.log(`Supplements: `, Supplement.OBJECTS)
            }}>
                check data
            </button>
        </div>
        )
    }
}