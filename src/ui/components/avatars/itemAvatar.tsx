interface ItemAvatarProps {
    itemName: string;
}

export function ItemAvatar (props: ItemAvatarProps) {
    return (
    <div className="ItemAvatarProps">
        {props.itemName}
    </div>
    );
}