import { CraftedMWObject } from "../../lib/types/item";
import { MWRecipe } from "../../lib/types/recipe";


export interface CraftCalcProps {
    availableItems: CraftedMWObject[];
}

export interface CraftCalcState {
    input: string;
    activeItem?: CraftedMWObject;
    isHighQuality: boolean;
    output?: string;
    outputList: [MWRecipe, number][];
}