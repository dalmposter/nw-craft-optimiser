import React, { Component } from "react";
import { MWResource } from "../../lib/types/item";
import { findMwObject } from "../../lib/types/util";
import { Accordion, AccordionTitleProps, Checkbox, Icon, Input } from "semantic-ui-react";

import "./settings.scss";

interface SettingsPageProps {
    unlocked: boolean;
    resetCalculations: () => void;
}

interface SettingsPageState {
    activeIndex: number;
    renders: number;
}

export default class SettingsPage extends Component<SettingsPageProps, SettingsPageState> {

    constructor(props: SettingsPageProps) {
        super(props)
        this.state = {
            activeIndex: 1,
            renders: 0
        }
    }

    onAccordionClick(titleProps: AccordionTitleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index as number
    
        this.setState({ activeIndex: newIndex })
    }

    render() {
        return (
        <>
        <div className={`Panel`} id="settings">
            <h1 style={{padding: "16px"}}>Customise Settings</h1>
            <Accordion fluid styled>
                <Accordion.Title
                    active={this.state.activeIndex === 0}
                    index={0}
                    onClick={(e, titleProps) => this.onAccordionClick(titleProps)}
                >
                    <Icon name='dropdown' />
                    General Settings
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 0}>
                </Accordion.Content>
                <Accordion.Title
                    active={this.state.activeIndex === 1}
                    index={1}
                    onClick={(e, titleProps) => this.onAccordionClick(titleProps)}
                >
                    <Icon name='dropdown' />
                    Customise Resource Prices
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 1}>
                    {[...MWResource.OBJECTS.values()].map(resource =>
                        <div style={{display: "flex", marginBottom: "12px"}}>
                            <Input
                                className="setting"
                                focus
                                value={resource.price}
                                onChange={(event) => {
                                    let newPrice = Number(event.target.value)
                                    console.log(`Set price of ${resource.name} to ${newPrice}`)
                                    findMwObject(resource.name).price = newPrice
                                    // Hack to force this component to re-render with the new price
                                    this.setState({...this.state, renders: this.state.renders+1})
                                    this.props.resetCalculations()
                                }}
                                label={`${resource.name}`}
                                labelPosition="right"
                            />
                        </div>
                    )}
                </Accordion.Content>
            </Accordion>
        </div>
        </>
        )
    }
}