import { CraftedMWObject, MWObject, MWResource } from "../lib/types/item"

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

export const VERSION_NUMBER: string = "v0.0.1";

export const priceCookieStarter = "Price_"

export const priceCookieName = (resourceName: string) => `${priceCookieStarter}${resourceName}`;