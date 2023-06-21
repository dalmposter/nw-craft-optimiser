import { Popup } from "semantic-ui-react";
import { MWItem, MWResource } from "../../../../lib/types/item";
import React from "react";

import "./ItemIcon.scss"
import { getFileName, images } from "../icon";

export interface ItemIconProps {
    item: MWItem;
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

        let onClick = this.props.onClick !== undefined
                        ? () => this.props.onClick!(this.props.item.name)
                        : undefined
        let style = this.props.onClick !== undefined
                        ? { "cursor": "pointer" }
                        : {  }
    
        return (
        <Popup
            className="ItemIcon"
            flowing hoverable
            trigger={
                <img
                    src={itemIcon? itemIcon : images.get("EmptyIcon.png")}
                    onClick={onClick}
                    style={style}
                />
            }
        >
            <h4>{this.props.item.name} [Material]</h4>
            <p>Source: {this.props.item.unlock}</p>
            <p>Cost to craft: {this.state.price} AD</p>
        </Popup>
        )
    }
}

export interface ResourceIconProps {
    item: MWResource;
}

export function ResourceIcon (props: ResourceIconProps) {

    let fileName = getFileName(props.item.name);
    let itemIcon = images.get(fileName);

    return (
    <Popup
        className="ResourceIcon"
        flowing hoverable
        trigger={
            <img
                src={itemIcon? itemIcon : images.get("EmptyIcon.png")}
            />
        }
    >
        <h4>{props.item.name} [Resource]</h4>
        <p>Source: {props.item.source}</p>
        <p>AH Price: {props.item.price}</p>
    </Popup>
    )
}