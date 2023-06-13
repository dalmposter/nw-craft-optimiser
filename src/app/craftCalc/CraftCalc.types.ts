import { CraftedMWObject } from "../../lib/types/item";
import { MWRecipe } from "../../lib/types/recipe";


export interface CraftCalcProps {
    availableItems: CraftedMWObject[];
    unlocked: boolean;
}

export type MWCategory = "Menzoberranzan Masterwork" | "Sharandar Masterwork" | "Chultan Masterwork"

export interface ItemFilter {
    class?: string[];
    type?: string[];
    slot?: string[];
    mwCategory?: MWCategory[];
}

export interface CraftCalcState {
    input: string;
    activeItem?: CraftedMWObject;
    isHighQuality: boolean;
    output?: string;
    outputList: [MWRecipe, number][];
    itemFilter: ItemFilter;
}