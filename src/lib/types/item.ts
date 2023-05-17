import { Lock } from "../util/lock";
import { Recipe, PROFESSIONS, ARTISAN_TYPES, FOCUS_MULTIPLIER } from "./constants";
import { CommissionItemType, MWItemType, MWResourceType } from "./item.types";
import { MWMaterial } from "./material";
import { Artisan, Tool, Supplement, MWRecipe } from "./recipe";
import { findMwObject, aggregateTupleLists } from "./util";
import { parse } from "csv-parse/browser/esm";

/**
 * A generic Masterwork object.
 * 
 * Could represent a resource, material, or item.
 */
export abstract class MWObject {
    static OBJECTS: Map<string, MWObject> = new Map<string, MWObject>()

    name?: string;
    canDabHand: boolean;
    //TODO: Remove price from MWObject and put only on MWResource
    price?: number;

    constructor(name?: string, price?: number) {
        this.name = name;
        this.price = price;
        this.canDabHand = false;
    }

    /** Load the list of this classes objects from a CSV file. */
    static loadCsv(file_loc: string): void {
        throw new Error("Unimplemented MWObject.loadCsv() static method used.")
    }

    /**
     * Craft this item and it's input resource recursively.
     * 
     * @param artisan 
     * @param tool 
     * @param supplement 
     * @param quantity 
     * @param highQuality 
     * @returns a recipe representing the cost to craft this item.
     */
    async craft(
        artisan?: Artisan,
        tool?: Tool,
        supplement?: Supplement,
        quantity?: number,
        highQuality?: boolean,
    ): Promise<MWRecipe> {
        let output = new MWRecipe(this, quantity, artisan, tool, supplement, highQuality)
        return output
    }
}

/**
 * A Masterwork object that is considered a final result (not a material).
 */
export class MWItem extends MWObject {
    static OBJECTS: Map<string, MWItem> = new Map<string, MWItem>();

    name: string;

    quantity: number;
    proficiency: number;
    focus: number;
    unlock: string;
    profession: string;
    recipe: Recipe;
    commission: number;
    /** List of the top recipes to craft this item, and their total AD cost. */
    optimalRecipes?: [MWRecipe, number][];
    /** List of the top recipes to craft this item in high quality, and their total AD cost. */
    hqOptimalRecipes?: [MWRecipe, number][];

    private lock: Lock;

    constructor(data: MWItemType) {
        super();
        this.name = data.name;
        this.quantity = Number(data.quantity);
        this.canDabHand = data.canDabHand.toLowerCase() == "true";
        this.proficiency = Number(data.proficiency);
        this.focus = Number(data.focus);
        this.unlock = data.unlock;
        this.profession = data.profession
        this.recipe = eval(data.recipe)
        this.commission = Number(data.commission);

        this.lock = new Lock()
    }

    static loadCsv(csvString: string) {
        MWItem.OBJECTS = new Map<string, MWItem>();

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

    async getOptimalRecipes(highQuality: boolean): Promise<[MWRecipe, number][]> {
        const RECIPE_QUANTITY = 10;

        if(highQuality && this.hqOptimalRecipes != undefined) {
            return this.hqOptimalRecipes.slice(0, RECIPE_QUANTITY);
        }
        if(!highQuality && this.optimalRecipes != undefined) {
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
        if(highQuality && this.hqOptimalRecipes != undefined) {
            await this.lock.release()
            return this.hqOptimalRecipes[0][0];
        } else if(!highQuality && this.optimalRecipes != undefined) {
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
                        if(supplement.name == this.name) {
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
                rankingList.sort((a, b) => a[1] - b[1]);
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
            throw new Error(`MWItem.craft() received ${artisan} ${tool} ${supplement}`
                          + " but they must either all be provided, or none.")
        }
        let output = await super.craft(artisan, tool, supplement, quantity, highQuality);

        let successChance = (artisan.proficiency + tool.proficiency + supplement.proficiency)/this.proficiency;
        let focusDifferential = this.focus - artisan.focus - tool.focus - supplement.focus;
        let highQualityChance = Math.max(
            1 - (FOCUS_MULTIPLIER * focusDifferential),
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

        let quantityMultiplier = (1 + ((expectedAttempts - 1) * (1 - recycleChance)));

        if(highQuality) {
            // If we're crafting +1 version, divide multiplier by +1 chance.
            // This must be done after calculating quantity multiplier because you can
            // only recycle actual failures, not just unwanted normal results.
            quantityMultiplier = quantityMultiplier / highQualityChance;
            expectedAttempts = expectedAttempts / highQualityChance;
        }
        // Adjust multiplier based on quantity to craft and quantity output by the recipe
        quantityMultiplier = (quantityMultiplier * quantity) / this.quantity;
        expectedAttempts = (expectedAttempts * quantity) / this.quantity;

        // Start with the supplements needed for final craft
        output.supplements = [[expectedAttempts, supplement.name]];
        // Go through all the items in the recipe and add up their costs
        for(var recipeEntry of this.recipe) {
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
    name: string;

    constructor(data?: MWResourceType, name?: string) {
        super();
        this.price = 0;
        this.name = "N/A";
        if(name != undefined) {
            this.name = name;
        }
        if(data != undefined) {
            this.name = data.name;
            this.price = Number(data.price);
        }
    }

    static loadCsv(csvString: string) {
        MWResource.OBJECTS = new Map<string, MWResource>();
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
        let output = await super.craft(artisan, tool, supplement, quantity, highQuality);
        // Resources are only gathered. They cannot be failed, dabbed or recycled.
        output.materials = [[quantity, this.name]];
        return output;
    }
}

/** A crafted item requested by Stryker Bronzepin */
export class CommissionItem {
    static OBJECTS: Map<string, CommissionItem> = new Map<string, CommissionItem>();

    name: string;
    commissionValue: number;
    object: MWObject;

    constructor(data: CommissionItemType) {
        this.name = data.name;
        this.commissionValue = Number(data.commissionValue);
        this.object = findMwObject(this.name);
    }

    static loadCsv(csvString: string) {
        CommissionItem.OBJECTS = new Map<string, CommissionItem>();

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
        let recipe = await this.object.craft();
        let commissionPerAd = recipe.getCost() / this.commissionValue;
        let rank: [MWRecipe, number] = [recipe, commissionPerAd];
        return rank;
    }

    prettyPrint(): string {
        return `${this.name} (${this.commissionValue})`
    }
}