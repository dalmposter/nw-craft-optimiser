import React, { Component } from "react";

import Footer from "../components/footer/Footer";

export default class Roadmap extends Component {
    render() {
        return (
        <>
        <div className={`Panel`} id="roadmap">
            <h1 style={{padding: "16px"}}>Project Roadmap</h1>
            <p>
                All is subject to change at my whim, and progress could be delayed for
                any reason. This is just a pet project for me.
            </p>
            <h3>Do Soon</h3>
            <ul>
                <li>Ability to view resource prices used by the calculator</li>
                <li>Optimise UI for smaller screens</li>
                <li>
                    Allow selecting of which specific Artisans/Tools/Supplements you have
                    and restrict the calculator to using only those when calculating prices
                </li>
            </ul>
            <h3>Do Next</h3>
            <ul>
                <li>Ability to customise the resource prices used by the calculator</li>
                <li>Source icons for resources, artisans, tool, and supplements</li>
                <li>Easier selection of items (filter by class and sharandar vs chult)</li>
                <li>Optimise UI for phones</li>
                <li>
                    Support for using +1 materials (from my testing, using all +1 mats
                    increases high quality chance by about 20%)
                </li>
            </ul>
            <h3>Do After</h3>
            <ul>
                <li>Include gold in the list of consumed resources</li>
                <li>Account for commission modifier and passion project in gold calculation</li>
                <li>
                    Allow selection of multiple items and show overall cost (MVP will
                    be to show prices for the weapon set of a given class)
                </li>
            </ul>
            <h3>Do Later</h3>
            <ul>
                <li>Allow ability to include morale cost in the calculations</li>
                <li>Account for miracle worker in the morale calculation</li>
                <li>
                    Interactive crafting functionality that allows you to choose specific
                    artisans, tools and supplements and see the calculations for that combo
                </li>
                <li>Dark mode</li>
                <li>Show stats of the crafted gear</li>
                <li>Add 'wiki' style pages explaining the mechanics of crafting</li>
                <li>Add 'wiki' style pages giving information about the resources</li>
            </ul>
        </div>
        </>
        )
    }
}