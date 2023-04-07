import React, { Component } from "react";

import { CraftCalcProps, CraftCalcState } from "./CraftCalc.types";

export default class CraftCalc extends Component<CraftCalcProps, CraftCalcState> {
    constructor(props: CraftCalcProps) {
        super(props);
        this.state = {
            input: "",
            toolsCsv: ""
        }
    }

    fetchCsvs() {
        fetch(`${process.env.PUBLIC_URL}/input/artisans_new.csv`)
            .then(res => res.text())
            .then(stringData => {
                this.state = { ...this.state, toolsCsv: stringData }
            })
    }

    craft() {

    }

    componentDidMount() {
        this.fetchCsvs()
    }

    render() {
        return (
        <div className="CraftCalc" >
            <input type="text" onChange={(event) => { this.state = { ...this.state, input: event.target.value } }}>
            </input>
            <button onClick={() => { console.debug(`Craft: ${this.state.input}. URL: ${process.env.PUBLIC_URL}. Tools: ${this.state.toolsCsv}`) }}>
                Craft
            </button>
        </div>
        )
    }
}