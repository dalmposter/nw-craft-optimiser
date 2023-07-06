import React, { Component } from "react";

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
            <p>This page is now deprecated. I will be tracking features and progress on trello.
                <a
                    href="https://trello.com/b/wfj8Dy3C/nw-craft-optimiser-development"
                    target="_blank"
                    rel="noreferrer"
                > Click here to check it out</a>
            </p>
            <h3>Done :)</h3>
            <ul>
                <li><s>Ability to view resource prices used by the calculator</s></li>
                <li><s>Ability to customise the resource prices used by the calculator</s></li>
                <li><s>Add Menzoberranzan Masterwork Tier</s> (Current recipes are part speculation)</li>
                <li><s>Easier selection of items (filter by class and sharandar vs chult)</s></li>
            </ul>
            <h3>Do Soon</h3>
            <ul>
                <li>Allow inspection of selected item and items in the dropdown (to view stats)</li>
                <li>Prettify the settings page</li>
                <li>Optional saving of custom prices to cookies</li>
                <li>Allow updating of resource prices in-line (without going to settings page)</li>
                <li>Improve filters (allow clearing, allow hiding)</li>
            </ul>
            <h3>Do Next</h3>
            <ul>
                <li>Allow displaying of more results than the top 10 (pages or select quantity)</li>
                <li>
                    Allow selecting of which specific Artisans/Tools/Supplements you have
                    and restrict the calculator to using only those when calculating prices
                </li>
                <li>Optimise UI for smaller screens</li>
                <li>Source icons for resources, artisans, tool, and supplements</li>
            </ul>
            <h3>Do After</h3>
            <ul>
                <li>Improve performance of initial data load</li>
                <li>
                    Support for using +1 materials (from my testing, using all +1 mats
                    increases high quality chance by about 20%)
                </li>
                <li>Optimise UI for phones</li>
                <li>Include gold in the list of consumed resources</li>
                <li>Account for commission modifier and passion project in gold calculation</li>
                <li>
                    Allow selection of multiple items and show overall cost (MVP will
                    be to show prices for the weapon set of a given class)
                </li>
            </ul>
            <h3>Do Later</h3>
            <ul>
                <li>Improve performance of calculations</li>
                <li>Allow ability to include morale cost in the calculations</li>
                <li>Account for miracle worker in the morale calculation</li>
                <li>
                    Interactive crafting functionality that allows you to choose specific
                    artisans, tools and supplements and see the calculations for that combo
                </li>
                <li>Dark mode</li>
                <li>Add 'wiki' style pages explaining the mechanics of crafting</li>
                <li>Add 'wiki' style pages giving information about the resources</li>
            </ul>
        </div>
        </>
        )
    }
}