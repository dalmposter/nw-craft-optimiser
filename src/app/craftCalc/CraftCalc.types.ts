import { MWItem } from "../../lib/types/item";


export interface CraftCalcProps {

}

export interface CraftCalcState {
    input: string;
    activeItem?: MWItem;
    availableItems: string[];
    isHighQuality: boolean;
    output?: string;
}