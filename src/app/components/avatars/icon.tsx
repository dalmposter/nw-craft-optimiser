/** Module for getting item icon images. */

function importAll(r: __WebpackModuleApi.RequireContext) {
    return new Map(r.keys().map((fileName: string) => ([
		fileName.substr(2).replace(/\/index\.mdx$/, ''),
	    r(fileName)
	])))
}

export function getFileName(itemName?: string) {
    if(itemName === undefined) return "EmptyIcon.png"
    let fileName = itemName.replace(/[^a-zA-Z0-9 ]/g, "").replaceAll(" ", "-").toLowerCase();
    console.log(`Transformed ${itemName} into ${fileName}`)
    return fileName + ".png"
}
  
export const images = importAll(require.context('../../../images/', false, /\.(png|jpe?g|svg)$/));