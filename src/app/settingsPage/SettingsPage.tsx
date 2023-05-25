import React, { Component } from "react";
import { MWResource } from "../../lib/types/item";

export default class SettingsPage extends Component {
    render() {
        return (
        <>
        <div className={`Panel`} id="settings">
            <h1 style={{padding: "16px"}}>Customise Settings</h1>
            {[...MWResource.OBJECTS.values()].map(resource => <p>{resource.name}: {resource.price}</p>)}
        </div>
        </>
        )
    }
}