import { MWItem } from "../../lib/types/item";
import { MWRecipe } from "../../lib/types/recipe";


export interface CraftCalcProps {

}

export interface CraftCalcState {
    input: string;
    activeItem?: MWItem;
    availableItems: string[];
    isHighQuality: boolean;
    output?: string;
    outputList: [MWRecipe, number][];
    page: string;
}