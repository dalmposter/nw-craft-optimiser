import { removeCookie, setCookie } from "typescript-cookie";
import { CraftedMWObject, MWObject, MWResource } from "../lib/types/item"
import { Artisan, Tool } from "../lib/types/recipe";

export const getPrice = (item: MWObject): string => {
    return shouldShowPrice(item) && item.price? `${item.price.toLocaleString("en-US")} AD` : "--- ---";
}

export const shouldShowPrice = (item: MWObject) : boolean => {
    if(item instanceof MWResource && item.mwTier === "Menzoberranzan") {
        return false;
    }
    if(item instanceof CraftedMWObject && item.mwCategory === "Menzoberranzan Masterwork") {
        return false;
    }
    return true;
}

export const VERSION_NUMBER: string = "v0.0.3";

export const priceCookieStarter = "Price_"

export const priceCookieName = (resourceName: string) => `${priceCookieStarter}${resourceName}`;

export const artisanAvailableCookieStarter = "ArtisanUnavailable_"

export const artisanAvailableCookieName = (artisanName: string, profession: string) => {
    return `${artisanAvailableCookieStarter}${profession}_${artisanName}`;
}

export const updateArtisanCookie = (artisan: Artisan, profession: string) => {
    if(!artisan.available) {
        setCookie(
            artisanAvailableCookieName(artisan.name, profession),
            false
        )
    } else {
        removeCookie(artisanAvailableCookieName(artisan.name, profession))
    }
}

export const toolAvailableCookieStarter = "ToolUnavailable_"

export const toolAvailableCookieName = (toolName: string) => {
    return `${toolAvailableCookieStarter}${toolName}`;
}

export const updateToolCookie = (tool: Tool) => {
    if(!tool.available) {
        setCookie(
            toolAvailableCookieName(tool.name),
            false
        )
    } else {
        removeCookie(toolAvailableCookieName(tool.name))
    }
}