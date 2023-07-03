import { Popup } from "semantic-ui-react";
import { MWItem, MWResource } from "../../../../lib/types/item";
import React from "react";

import emptyIcon from "../../../../images/EmptyIcon.png"
import "./ItemIcon.scss"
import { getFileName, images } from "../icon";

export interface ItemIconProps {
    item: MWItem;
    highQuality?: boolean;
    onClick?: (name: string) => void;
}

interface ItemIconState {
    price: string;
}

export class ItemIcon extends React.Component<ItemIconProps, ItemIconState> {
    constructor(props: ItemIconProps) {
        super(props);

        this.state = {
            price: "..."
        }
    }

    componentDidMount() {
        this.props.item.getPrice().then(price => this.setState({
            price: Math.round(price).toLocaleString("en-US")
        }))
    }

    render () {

        let fileName = getFileName(this.props.item.name);
        let itemIcon = images.get(fileName);
        let highQualityFlair = images.get("high-quality-flair.png");

        let onClick = this.props.onClick !== undefined
                        ? () => this.props.onClick!(this.props.item.name)
                        : undefined
        let style = this.props.onClick !== undefined
                        ? { "cursor": "pointer" }
                        : {  }
    
        return (
        <div className="ItemIcon">
            <Popup
                className="ItemIconPopup"
                flowing hoverable
                trigger={
                    <div style={{position: "relative"}}>
                        { this.props.highQuality &&
                            <img style={
                                    {
                                        width: "25%",
                                        height: "25%",
                                        position: "absolute",
                                        left: "12.5%",
                                        top: "12.5%"
                                    }
                                }
                                src={highQualityFlair? highQualityFlair : emptyIcon}
                                alt="+1 Flair"
                            />
                        }
                        <img
                            style={{...style, "maxWidth": "100%", "maxHeight": "100%"}}
                            className="Icon"
                            src={itemIcon? itemIcon : emptyIcon}
                            alt={`${this.props.item.name} Icon`}
                            onClick={onClick}
                        />
                    </div>
                }
            >
                <h4>{this.props.item.name} [Material]</h4>
                <p>Source: {this.props.item.unlock}</p>
                <p>Cost to craft: {this.state.price} AD</p>
            </Popup>
        </div>
        )
    }
}

export interface ResourceIconProps {
    item: MWResource;
    highQuality?: boolean;
}

export function ResourceIcon (props: ResourceIconProps) {

    let fileName = getFileName(props.item.name);
    let itemIcon = images.get(fileName);
    let highQualityFlair = images.get("high-quality-flair.png");

    return (
    <div className="ResourceIcon">
        <Popup
            className="ResourceIconPopup"
            flowing hoverable
            trigger={
                <div style={{position: "relative"}}>
                    { props.highQuality &&
                        <img style={
                                {
                                    width: "25%",
                                    height: "25%",
                                    position: "absolute",
                                    left: "12.5%",
                                    top: "12.5%"
                                }
                            }
                            src={highQualityFlair? highQualityFlair : emptyIcon}
                            alt="+1 Flair"
                        />
                    }
                    <img
                        style={{"maxWidth": "100%", "maxHeight": "100%"}}
                        className="Icon"
                        src={itemIcon? itemIcon : emptyIcon}
                        alt={`${props.item.name} Icon`}
                    />
                </div>
            }
        >
            <h4>{props.item.name} [Resource]</h4>
            <p>Source: {props.item.source}</p>
            <p>AH Price: {props.item.price}</p>
        </Popup>
    </div>
    )
}