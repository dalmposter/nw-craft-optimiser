import React, { Component } from "react";
import { MWResource } from "../../lib/types/item";
import { findMwObject } from "../../lib/types/util";

interface SettingsPageProps {
    resetCalculations: () => void;
}

export default class SettingsPage extends Component {
    render() {
        return (
        <>
        <div className={`Panel`} id="settings">
            <h1 style={{padding: "16px"}}>Customise Settings</h1>
            {[...MWResource.OBJECTS.values()].map(resource =>
                <div style={{display: "flex"}}>
                    <p>{resource.name}: </p>
                    <input
                        defaultValue={resource.price}
                        type="text"
                        onChange={(event) => {
                            let newPrice = Number(event.target.value)
                            console.log(`Set price of ${resource.name} to ${newPrice}`)
                            findMwObject(resource.name).price = newPrice
                        }}
                    />
                </div>
            )}
        </div>
        </>
        )
    }
}