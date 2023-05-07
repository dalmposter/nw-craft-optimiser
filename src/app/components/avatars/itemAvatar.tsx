interface ItemAvatarProps {
    quantity?: number;
    itemName: string;
    itemIcon?: React.Component;
}

export function ItemAvatar (props: ItemAvatarProps) {
    return (
    <div className="ItemAvatarProps">
        {props.quantity && <>{props.quantity}x </>}
        {props.itemIcon && <>{props.itemIcon}</>}
        {props.itemName}
    </div>
    );
}