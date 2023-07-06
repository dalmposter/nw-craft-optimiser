import { CraftedMWObject, MWObject, MWResource } from "../lib/types/item"

export const getPrice = (item: MWObject): string => {
    return shouldShowPrice(item)? `${String(item.price)} AD` : "--- ---";
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