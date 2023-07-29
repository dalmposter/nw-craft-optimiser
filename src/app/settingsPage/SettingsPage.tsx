import React, { Component } from "react";
import { MWResource } from "../../lib/types/item";
import { findMwObject } from "../../lib/types/util";
import { Accordion, AccordionTitleProps, Button, Checkbox, Icon, Input } from "semantic-ui-react";
import { setCookie, getCookies, removeCookie } from "typescript-cookie";

import "./settings.scss";
import { artisanAvailableCookieName, priceCookieName, shouldShowPrice, toolAvailableCookieName } from "../constants";
import { Artisan, Tool } from "../../lib/types/recipe";
import { EntityAvatar } from "../components/avatars/entity/EntityAvatar";

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
            activeIndex: 3,
            renders: 0
        }
    }

    onAccordionClick(titleProps: AccordionTitleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index as number
    
        this.setState({ activeIndex: newIndex })
    }

    rerender() {
        // Hack to force this component to re-render with the new price
        this.setState({...this.state, renders: this.state.renders+1})
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
                    Available Artisans
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 1}>
                    <p>
                        I do apologise for this awful settings page.
                        For now I recommend using ctrl+f to locate specific artisans
                    </p>
                    {[...Artisan.OBJECTS.entries()].map(([profession, artisans]) => <>
                    
                        <h2>{profession}</h2>
                        <div
                            style={{marginBottom: "24px", display: "flex", flexWrap: "wrap"}}
                            key={`artisan-selectors-${profession}`}
                        >
                            {artisans.sort((a, b) => {
                                let rarityMap = new Map(Object.entries({ "Epic": 3, "Rare": 2, "Common": 1 }));
                                const getN = (rarity: string) => rarityMap.has(rarity) ? rarityMap.get(rarity)! : 0;
                                return getN(b.rarity) - getN(a.rarity);
                            }).map((artisan: Artisan) => 
                                <div
                                    key={`artisan-selector-${artisan.name}`}
                                    className="Artisan Selector"
                                >
                                    <div style={{position: "relative", marginRight: "12px", marginLeft: "12px"}}>
                                        <Checkbox
                                            className="centered-element"
                                            checked={artisan.available}
                                            onChange={(event, data) => {
                                                artisan.available = !!data.checked;
                                                if(!artisan.available) {
                                                    setCookie(
                                                        artisanAvailableCookieName(artisan.name, profession),
                                                        false
                                                    )
                                                } else {
                                                    removeCookie(artisanAvailableCookieName(artisan.name, profession))
                                                }
                                                this.rerender()
                                                this.props.resetCalculations()
                                            }}
                                        />
                                    </div>
                                    <EntityAvatar size="horizontal" entity={artisan} />
                                </div>
                            )}
                        </div>
                        </>
                    )}
                </Accordion.Content>

                <Accordion.Title
                    active={this.state.activeIndex === 2}
                    index={2}
                    onClick={(e, titleProps) => this.onAccordionClick(titleProps)}
                >
                    <Icon name='dropdown' />
                    Available Tools
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 2}>
                    {[...Tool.OBJECTS.values()].map((tool) =>
                        <div
                            key={`tool-selector-${tool.name}`}
                            className="Selector"
                        >
                            <div style={{position: "relative", marginRight: "12px", marginLeft: "12px"}}>
                                <Checkbox
                                    className="centered-element"
                                    checked={tool.available}
                                    onChange={(event, data) => {
                                        tool.available = !!data.checked;
                                        if(!tool.available) {
                                            setCookie(
                                                toolAvailableCookieName(tool.name),
                                                false
                                            )
                                        } else {
                                            removeCookie(toolAvailableCookieName(tool.name))
                                        }
                                        this.rerender()
                                        this.props.resetCalculations()
                                    }}
                                />
                            </div>
                            <EntityAvatar size="horizontal" entity={tool} />
                        </div>
                    )}
                </Accordion.Content>

                <Accordion.Title
                    active={this.state.activeIndex === 3}
                    index={3}
                    onClick={(e, titleProps) => this.onAccordionClick(titleProps)}
                >
                    <Icon name='dropdown' />
                    Customise Resource Prices
                </Accordion.Title>
                <Accordion.Content active={this.state.activeIndex === 3}>
                    <p>
                        I do apologise for this awful settings page.
                        For now I recommend using ctrl+f to locate specific resources
                    </p>
                    <Button onClick={() => {
                        for(let resource of MWResource.OBJECTS.values()) {
                            resource.resetPrice()
                        }
                        this.rerender()
                        this.props.resetCalculations();
                    }}>
                        Reset all prices
                    </Button>
                    <p>
                        Please be aware that modifying the prices will save the changes to a Cookie.
                        To reset any prices back to those I provide, you will need to clear all
                        custom prices using the above button. (this functionality is still being
                        refined).
                    </p>
                    {[...MWResource.OBJECTS.values()].filter(resource => shouldShowPrice(resource)).map(resource =>
                        <div
                            style={{display: "flex", marginBottom: "12px"}}
                            key={`price-input-${resource.name}`}
                        >
                            <Input
                                className="setting"
                                focus
                                value={resource.price}
                                onChange={(event) => {
                                    let newPrice = Number(event.target.value)
                                    if(isNaN(newPrice)) {
                                        console.warn(`User entered NaN:`, event.target.value);
                                        return;
                                    }
                                    console.log(`Set price of ${resource.name} to ${newPrice}`)
                                    findMwObject(resource.name).price = newPrice
                                    setCookie(priceCookieName(resource.name), newPrice)
                                    this.rerender()
                                    this.props.resetCalculations()
                                }}
                                label={`${resource.name}`}
                                labelPosition="right"
                            />
                            { resource.originalPrice !== resource.price &&
                            <div style={{
                                marginLeft: "256px", display: "flex", height: "min-content",
                                marginTop: "auto", marginBottom: "auto"
                            }}>
                                <p style={{marginTop: "auto", marginBottom: "auto", marginRight: "32px"}}>
                                    Price customised. Original: {resource.originalPrice}
                                </p>
                                <Button
                                    size="mini"
                                    onClick={() => {
                                        resource.resetPrice()
                                        this.rerender()
                                        this.props.resetCalculations()
                                    }}
                                >
                                    Reset price
                                </Button>
                            </div>
                            }
                        </div>
                    )}
                </Accordion.Content>
            </Accordion>
        </div>
        </>
        )
    }
}