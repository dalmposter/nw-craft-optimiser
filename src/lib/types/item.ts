import { removeCookie } from "typescript-cookie";
import { Lock } from "../util/lock";
import { Recipe, ARTISAN_TYPES, FOCUS_MULTIPLIER, FOCUS_BREAKPOINT } from "./constants";
import { CommissionItemType, CraftedMWObjectType, MWItemType, MWResourceType } from "./item.types";
import { Artisan, Tool, Supplement, MWRecipe } from "./recipe";
import { findMwObject, aggregateTupleLists, findMwItem } from "./util";
import { parse } from "csv-parse/browser/esm";
import { priceCookieName } from "../../app/constants";

/**
 * A generic Masterwork object.
 * 
 * Could represent a resource, material, or item.
 */
export abstract class MWObject {
    static OBJECTS: Map<string, MWObject> = new Map<string, MWObject>()

    name: string;
    canDabHand: boolean;
    //TODO: Remove price from MWObject and put only on MWResource
    price?: number;

    constructor(name: string, price?: number) {
        this.name = name;
        this.price = price;
        this.canDabHand = false;
    }

    /** Load the list of this classes objects from a CSV file. */
    static loadCsv(file_loc: string): void {
        throw new Error("Unimplemented MWObject.loadCsv() static method used.")
    }
}

/**
 * A Masterwork object that is considered a final result (not a material).
 */
export class CraftedMWObject extends MWObject {
    static OBJECTS: Map<string, CraftedMWObject> = new Map<string, CraftedMWObject>();

    quantity: number;
    proficiency: number;
    focus: number;
    unlock: string;
    profession: string;
    mwCategory: string;
    recipe: Recipe;
    commission: number;
    /** List of the top recipes to craft this item, and their total AD cost. */
    optimalRecipes?: [MWRecipe, number][];
    /** List of the top recipes to craft this item in high quality, and their total AD cost. */
    hqOptimalRecipes?: [MWRecipe, number][];

    type: string;

    private lock: Lock;

    constructor(data: CraftedMWObjectType) {
        let name = data.name;
        //console.debug(`Loading ${data.name}`);
        super(name);
        this.type = "unknown";
        this.quantity = Number(data.quantity);
        this.canDabHand = data.canDabHand.toLowerCase() === "true";
        this.proficiency = Number(data.proficiency);
        this.focus = Number(data.focus);
        this.unlock = data.unlock;
        this.mwCategory = data.unlock.split(" - ")[0];
        this.profession = data.profession
        this.recipe = eval(data.recipe)
        this.commission = Number(data.commission);

        this.lock = new Lock()
    }

    clearCalculations() {
        this.optimalRecipes = undefined;
        this.hqOptimalRecipes = undefined;
    }

    async getOptimalRecipes(highQuality: boolean): Promise<[MWRecipe, number][]> {
        const RECIPE_QUANTITY = 10;

        if(highQuality && this.hqOptimalRecipes !== undefined) {
            return this.hqOptimalRecipes.slice(0, RECIPE_QUANTITY);
        }
        if(!highQuality && this.optimalRecipes !== undefined) {
            return this.optimalRecipes.slice(0, RECIPE_QUANTITY);
        } else {
            await this.getOptimalRecipe(highQuality);
            if(highQuality) {
                return this.hqOptimalRecipes!.slice(0, RECIPE_QUANTITY);
            } else {
                return this.optimalRecipes!.slice(0, RECIPE_QUANTITY);    
            }
        }
    }

    /**
     * Calculate the most cost effective setup for crafting this item.
     * Attempt to craft this item with every known combination of artisan, tool and
     * supplement. Then rank the results by lowest cost.
     * In the process it will also calculate the optimal recipe for all required
     * materials, and use the best one in calculating this recipe.
     * @param highQuality whether to craft a high quality result or a normal.
     * 
     * @raises Error if this item does not belong to a known profession.
     */
    async getOptimalRecipe(highQuality: boolean): Promise<MWRecipe> {
        await this.lock.acquire()
        // First check if we already calculated the optimal recipes for this item.
        // This prevents massive runtimes by caching the best recipes once calculated.
        if(highQuality && this.hqOptimalRecipes !== undefined) {
            await this.lock.release()
            return this.hqOptimalRecipes[0][0];
        } else if(!highQuality && this.optimalRecipes !== undefined) {
            await this.lock.release()
            return this.optimalRecipes[0][0];
        } else {
            console.debug(`Calculating optimal recipe for ${this.name}`);
            // Determine the best artisan, tool and supplement to use
            let artisanType = ARTISAN_TYPES.get(this.profession)
            if(artisanType === undefined) {
                throw new Error(`Tried to craft ${this.name} belonging to unkown profession ${this.profession}`)
            }
            let artisans = Artisan.OBJECTS.get(artisanType)!;

            // Generate a thread for each combination of artisan, tool and supplement
            let threads = [];
            // Define function for threads to execute
            /** Craft this item with the given setup and append to the output list. */
            let addCraftToList = async (
                artisan: Artisan,
                tool: Tool,
                supplement: Supplement,
                quantity: number,
                hq: boolean
            ): Promise<[MWRecipe, number]> =>
                this.craft(artisan, tool, supplement, quantity, hq)
                    .then((value: MWRecipe) =>[value, value.getCost()])

            for(var artisan of artisans) {
                for(var [toolKey, tool] of Tool.OBJECTS) {
                    for(var [supKey, supplement] of Supplement.OBJECTS) {
                        if(supplement.name === this.name) {
                            continue;
                        }
                        let thread = addCraftToList(artisan, tool, supplement, 1, highQuality);
                        threads.push(thread);
                    }
                }
            }

            let rankingList: [MWRecipe, number][] = [];
            // Wait for all the threads
            await Promise.all(threads).then((value: [MWRecipe, number][]) => {
                rankingList = value;
                // Sort by price, with a tiebreaker on +1 chance
                rankingList.sort((a, b) => a[1] - b[1] || b[0].highQualityChance - a[0].highQualityChance);
            });

            if(highQuality) {
                this.hqOptimalRecipes = rankingList;
                await this.lock.release()
                return rankingList[0][0];
            } else {
                this.optimalRecipes = rankingList;
                await this.lock.release()
                return rankingList[0][0];
            }
        }
    }

    async getPrice(highQuality: boolean = false) {
        let optimalRecipe = await this.getOptimalRecipe(highQuality)
        return optimalRecipe.getCost()
    }

    /**
     * Craft a given quantity of this item using the given artisan, tool and supplement.
     * 
     * If no setup is provided, it will instead return the optimal recipe for this item.
     * 
     * @param artisan 
     * @param tool 
     * @param supplement 
     * @param quantity 
     * @param highQuality 
     * 
     * @raises Error if only some of artisan, tool, supplement are provided.
     */
    async craft(
        artisan?: Artisan,
        tool?: Tool,
        supplement?: Supplement,
        quantity: number = 1,
        highQuality: boolean = false
    ): Promise<MWRecipe> {
        if(artisan === undefined && tool === undefined && supplement === undefined) {
            let optimalRecipe = await this.getOptimalRecipe(highQuality === undefined? false : highQuality);
            return optimalRecipe.multiply(quantity);
        }
        if(artisan === undefined || tool === undefined || supplement === undefined) {
            throw new Error(`CraftedMWObject.craft() received ${artisan} ${tool} ${supplement}`
                          + " but they must either all be provided, or none.")
        }
        let output = new MWRecipe(this, quantity, artisan, tool, supplement, highQuality)

        let successChance = (artisan.proficiency + tool.proficiency + supplement.proficiency)/this.proficiency;
        successChance = Math.min(successChance, 1) // Don't let success chance go over 100%
        let focusDifferential = this.focus - artisan.focus - tool.focus - supplement.focus;
        let focusMultiplier = 1/(this.focus - FOCUS_BREAKPOINT);
        let highQualityChance = Math.max(
            1 - (focusMultiplier * focusDifferential),
            0.0000001
        );
        let recycleChance = 1 - ((1-artisan.recycleChance) * (1-supplement.recycleChance) * (1-tool.recycleChance));
        let dabHandChance = 1 - ((1-artisan.dabHandChance) * (1-supplement.dabHandChance) * (1-tool.dabHandChance));

        // Calculate expected number of attempts to get a success of any quality
        let expectedAttempts = 1 / successChance;

        if(this.canDabHand) {
            // If the recipe can dab hand divide the expected attempts appropriately
            expectedAttempts = expectedAttempts / (1+dabHandChance);
        }

        if(highQuality) {
            // If we're crafting +1 version, divide expected attempts by +1 chance.
            expectedAttempts = expectedAttempts / highQualityChance;
        }
        // Adjust multiplier based on quantity to craft and quantity output by the recipe
        expectedAttempts = (expectedAttempts * quantity) / this.quantity;

        // Calculate quantity multiplier (how many crafts we have to pay resources for)
        let failures = expectedAttempts * (1-successChance);
        let recycles = failures * recycleChance;
        let quantityMultiplier = expectedAttempts - recycles;

        // Start with the supplements needed for final craft
        output.supplements = [[expectedAttempts, supplement.name]];
        // Go through all the items in the recipe and add up their costs
        for(var recipeEntry of this.recipe) {
            try {
                let recipeEntryName = recipeEntry[1]
                let recipeEntryQuantity = recipeEntry[0]
                let thisOutput = await findMwObject(recipeEntryName).craft(
                    undefined,
                    undefined,
                    undefined,
                    recipeEntryQuantity * quantityMultiplier,
                    false
                )
                output.absorb(thisOutput);
                // Clear the supplement materials. They are summed up fresh at the end
                output.supplementMaterials = [];
            } catch (e) {
                console.warn(`Caught error ${e} trying to craft ${this.name} with recipe`, this.recipe);
            }
        }

        // Go through all the supplements and sum up their costs
        for(var supplementEntry of output.supplements) {
            let supplementEntryName = supplementEntry[1];
            let supplementEntryQuantity = supplementEntry[0];
            let supplementObject = Supplement.OBJECTS.get(supplementEntryName);
            if(supplementObject === undefined) {
                console.warn("Supplement not found. Assuming 0 value.");
                continue;
            }
            let overallQuantity = supplementEntryQuantity * quantity;
            let thisOutput = await supplementObject.craft(overallQuantity);
            aggregateTupleLists(output.supplementMaterials, thisOutput.materials);
        }

        // Add meta-data to recipe
        output.attempts = expectedAttempts;
        output.failures = expectedAttempts * (1-successChance);
        output.normalResults = expectedAttempts * (successChance * (1-highQualityChance)) * this.quantity;
        output.highQualityResults = expectedAttempts * (successChance * highQualityChance) * this.quantity;
        output.totalDabHandChance = dabHandChance;
        output.totalRecycleChance = recycleChance;
        output.successChance = successChance;
        output.highQualityChance = highQualityChance;
        if(output.result.canDabHand) {
            output.normalResults *= (1+dabHandChance);
            output.highQualityResults *= (1+dabHandChance);
        }

        return output;
    }
}

/** A raw material used in crafting. */
export class MWResource extends MWObject {
    static OBJECTS: Map<string, MWResource> = new Map<string, MWResource>();

    price: number;
    originalPrice: number; // The original price for this resource provided by the server
    source: string;
    mwTier: string;

    constructor(data?: MWResourceType, name?: string) {
        super("N/A");
        this.price = 0;
        this.originalPrice = 0;
        this.source = "-";
        this.mwTier = "N/A";
        if(name !== undefined) {
            this.name = name;
        }
        if(data !== undefined) {
            this.name = data.name;
            this.price = Number(data.price);
            this.originalPrice = this.price;
            this.source = data.source
            this.mwTier = data.mwTier
        }
    }

    static loadCsv(csvString: string) {
        parse(csvString, {
            delimiter: "|",
            columns: true
        }, (error, result: MWResourceType[]) => {
            if(error) {
                console.error(error);
            }
            for(var resourceInput of result) {
                let newResource = new MWResource(resourceInput);
                MWResource.OBJECTS.set(newResource.name, newResource);
            }
        });
    }

    async craft(
        artisan?: Artisan,
        tool?: Tool,
        supplement?: Supplement,
        quantity: number = 1,
        highQuality: boolean = false
    ): Promise<MWRecipe> {
        let output = new MWRecipe(this, quantity, artisan, tool, supplement, highQuality)
        // Resources are only gathered. They cannot be failed, dabbed or recycled.
        output.materials = [[quantity, this.name]];
        return output;
    }

    resetPrice() {
        this.price = this.originalPrice;
        removeCookie(priceCookieName(this.name))
    }
}

export class MWItem extends CraftedMWObject {

    static OBJECTS: Map<string, MWItem> = new Map<string, MWItem>();

    itemType: string;
    requiredClasses: string[];
    itemSlot: string;
    equipBonus: string;

    constructor(data: MWItemType) {
        super(data)

        this.itemType = data.type;
        this.requiredClasses = data.class.split(", ");
        this.itemSlot = data.slot;
        this.equipBonus = data.equipBonus;
    }
    
    static loadCsv(csvString: string) {
        parse(csvString, {
            delimiter: "|",
            columns: true
        }, (error, result: MWItemType[]) => {
            if(error) {
                console.error(error);
            }
            for(var itemInput of result) {
                let newItem = new MWItem(itemInput);
                MWItem.OBJECTS.set(newItem.name, newItem)
            }
        });
    }
}

/** A crafted item requested by Stryker Bronzepin */
export class CommissionItem {
    static OBJECTS: Map<string, CommissionItem> = new Map<string, CommissionItem>();

    name: string;
    commissionValue: number;
    item: CraftedMWObject;

    constructor(data: CommissionItemType) {
        this.name = data.name;
        this.commissionValue = Number(data.commissionValue);
        this.item = findMwItem(this.name);
    }

    static loadCsv(csvString: string) {
        parse(csvString, {
            delimiter: "|",
            columns: true
        }, (error, result: CommissionItemType[]) => {
            if(error) {
                console.error(error);
            }
            for(var commissionInput of result) {
                let newItem = new CommissionItem(commissionInput);
                CommissionItem.OBJECTS.set(newItem.name, newItem);
            }
        })
    }

    async calculateRank(): Promise<[MWRecipe, number]> {
        let recipe = await this.item.craft();
        let commissionPerAd = recipe.getCost() / this.commissionValue;
        let rank: [MWRecipe, number] = [recipe, commissionPerAd];
        return rank;
    }

    prettyPrint(): string {
        return `${this.name} (${this.commissionValue})`
    }
}