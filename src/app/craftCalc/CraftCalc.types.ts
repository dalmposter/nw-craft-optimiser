import { MWItem } from "../../lib/types/item";
import { MWRecipe } from "../../lib/types/recipe";


export interface CraftCalcProps {
    availableItems: string[];
}

export interface CraftCalcState {
    input: string;
    activeItem?: MWItem;
    isHighQuality: boolean;
    output?: string;
    outputList: [MWRecipe, number][];
}