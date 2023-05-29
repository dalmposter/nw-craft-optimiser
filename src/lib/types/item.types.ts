import { Recipe } from "./constants";

export interface MWItemType {
    name: string;
    quantity: string;
    canDabHand: string;
    proficiency: string;
    focus: string;
    unlock: string;
    profession: string;
    commission: string;
    recipe: string;
}

export interface MWResourceType {
    price: string;
    name: string;
    source: string;
}

export interface CommissionItemType {
    name: string;
    commissionValue: string;
}