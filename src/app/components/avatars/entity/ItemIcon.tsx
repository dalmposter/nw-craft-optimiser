import { Popup } from "semantic-ui-react";
import { MWItem, MWResource } from "../../../../lib/types/item";
import React from "react";

import "./ItemIcon.scss"
import { Icon } from "../icon";

export interface ItemIconProps {
    item: MWItem;
    onClick: (name: string) => void;
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
        return (
        <Popup
            className="ItemIcon"
            flowing
            trigger={<Icon
                        name={this.props.item.name}
                        onClick={() => this.props.onClick(this.props.item.name)}
                    />}
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
    return (
    <Popup
        className="ResourceIcon"
        flowing
        trigger={<Icon name={props.item.name} />}
    >
        <h4>{props.item.name} [Resource]</h4>
        <p>Source: {props.item.source}</p>
        <p>AH Price: {props.item.price}</p>
    </Popup>
    )
}