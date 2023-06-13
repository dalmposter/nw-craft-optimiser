import React, { Component } from "react";
import { MWResource } from "../../lib/types/item";
import { findMwObject } from "../../lib/types/util";
import { Accordion, AccordionTitleProps, Checkbox, Icon, Input } from "semantic-ui-react";

interface SettingsPageProps {
    unlocked: boolean;
    resetCalculations: () => void;
    setUnlocked: (unlocked: boolean) => void;
}

interface SettingsPageState {
    activeIndex: number;
}

export default class SettingsPage extends Component<SettingsPageProps, SettingsPageState> {

    constructor(props: SettingsPageProps) {
        super(props)
        this.state = {
            activeIndex: 0
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
                    <div>
                        <Checkbox
                            label="Enable speculative recipes"
                            onChange={(e, data) => this.props.setUnlocked(!!data.checked)}
                            checked={this.props.unlocked}
                        />
                    </div>
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
                        <div style={{display: "flex"}}>
                            <p style={{marginRight: "24px"}}>{resource.name}: </p>
                            <Input
                                focus
                                value={resource.price}
                                onChange={(event) => {
                                    let newPrice = Number(event.target.value)
                                    console.log(`Set price of ${resource.name} to ${newPrice}`)
                                    findMwObject(resource.name).price = newPrice
                                    this.props.resetCalculations()
                                }}
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