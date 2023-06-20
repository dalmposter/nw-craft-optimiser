import React from "react";


function importAll(r: __WebpackModuleApi.RequireContext) {
    return new Map(r.keys().map((fileName: string) => ([
		fileName.substr(2).replace(/\/index\.mdx$/, ''),
	    r(fileName)
	])))
}

function getFileName(itemName: string) {
    let fileName = itemName.replace(/[^a-zA-Z0-9 ]/g, "").replaceAll(" ", "-").toLowerCase();
    console.log(`Transformed ${itemName} into ${fileName}`)
    return fileName + ".png"
}
  
const images = importAll(require.context('../../../images/', false, /\.(png|jpe?g|svg)$/));

interface IconProps {
    name: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const Icon = (props: IconProps) => {
    
    let fileName = getFileName(props.name)
    let itemIcon = images.get(fileName)

    return <img
        src={itemIcon? itemIcon : images.get("EmptyIcon.png")}
        onClick={props.onClick}
        style={props.style}
    />
}