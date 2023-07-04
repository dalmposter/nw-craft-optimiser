export interface CraftedMWObjectType {
    name: string;
    quantity: string;
    canDabHand: string;
    proficiency: string;
    focus: string;
    unlock: string;
    profession: string;
    commission: string;
    recipe: string;
    type: string;
}

export interface MWItemType extends CraftedMWObjectType {
    type: string;
    class: string;
    slot: string;
    equipBonus: string;
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