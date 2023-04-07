import { Recipe, PROFESSIONS, ARTISAN_TYPES, FOCUS_MULTIPLIER } from "./constants";
import { Artisan, Tool, Supplement, MWRecipe } from "./recipe.types";
import { findMwObject, aggregateTupleLists } from "./util";

/**
 * A generic Masterwork object.
 * 
 * Could represent a resource, material, or item.
 */
export abstract class MWObject {
    static OBJECTS: Map<string, MWObject> = new Map<string, MWObject>()

    name?: string;
    price?: number;

    constructor(name?: string, price?: number) {
        this.name = name;
        this.price = price;
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

    quantity: number;
    canDabHand: boolean;
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

    constructor(data: [string]) {
        super();
        this.name = data[0][1];
        this.quantity = Number(data[0][5].slice(0, -1));
        this.canDabHand = data[0][17] == "Yes";
        this.proficiency = Number(data[0][7]);
        this.focus = Number(data[0][8]);
        this.unlock = data[0][18];
        this.profession = "N/A"
        for(var profession of PROFESSIONS) {
            if(this.unlock.includes(profession)) {
                this.profession = profession;
            }
        }
        // Each row contains one entry of the recipe
        this.recipe = [];
        for(var row of data) {
            let quantity = Number(row[3].slice(0, -1));
            let item_name = row[4];
            this.recipe.push([quantity, item_name]);
        }
        this.commission = Number(data[0][16]);
        
        this.optimalRecipes = undefined;
        this.hqOptimalRecipes = undefined;
    }

    static loadCsv(fileLoc: string) {
        MWItem.OBJECTS = new Map<string, MWItem>();

        /* python
        with open(file_loc) as f:
            csvreader = csv.reader(f)
            header = next(csvreader)
            current_item: List[List[str]] = []
            can_dab_hand = False
            for row in csvreader:
                if row[2] is not None and row[2] != "":
                    # If the name (col 6) is not empty then this is the start of a recipe
                    # Create object for the previous recipe
                    if not can_dab_hand and current_item != []:
                        # If the item can't be dab handed it is an item and not a material
                        new_item = MWItem(current_item)
                        cls.OBJECTS[new_item.name] = MWItem(current_item)
                    # Collect data for next recipe
                    can_dab_hand = row[17] == "Yes"
                    current_item = [row]
                else:
                    current_item.append(row)
            # Flush the last item
            if can_dab_hand:
                # If the item can't be dab handed it is an item and not a material
                new_item = MWItem(current_item)
                cls.OBJECTS[new_item.name] = MWItem(current_item)
        */
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
        // First check if we already calculated the optimal recipes for this item.
        // This prevents massive runtimes by caching the best recipes once calculated.
        if(highQuality && this.hqOptimalRecipes != undefined) {
            return this.hqOptimalRecipes[0][0];
        } else if(!highQuality && this.optimalRecipes != undefined) {
            return this.optimalRecipes[0][0];
        } else {
            console.debug(`Calculating optimal recipe for ${this.name}`);
            // Determine the best artisan, tool and supplement to use
            let artisanType = ARTISAN_TYPES.get(this.profession)
            if(artisanType === undefined) {
                throw new Error(`Tried to craft ${this.name} belonging to unkown profession ${this.profession}`)
            }
            let artisans = Artisan.OBJECTS.get(artisanType)!;
            let tools = Tool.OBJECTS.values();
            let supplements = Supplement.OBJECTS.values();

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
            ): Promise<[MWRecipe, number]> => {
                let newRecipe = await this.craft(artisan, tool, supplement, quantity, hq);
                return [newRecipe, newRecipe.getCost()];
            };

            for(var artisan of artisans) {
                for(var tool of tools) {
                    for(var supplement of supplements) {
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
                return rankingList[0][0];
            } else {
                this.optimalRecipes = rankingList;
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
        let focusDifferential = this.focus - artisan.focus - tool.focus;
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
        quantityMultiplier = quantityMultiplier * quantity / this.quantity;

        // Start with the supplements needed for final craft
        output.supplements = [[expectedAttempts * quantity / this.quantity, supplement.name]];
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
            let thisOutput = await supplementObject.craft(quantity=overallQuantity);
            aggregateTupleLists(output.supplementMaterials, thisOutput.materials);
        }

        // Add meta-data to recipe
        output.attempts = expectedAttempts;
        output.failures = expectedAttempts * (1-successChance);
        output.normalResults = expectedAttempts * (successChance * (1-highQualityChance)) * (1+dabHandChance);
        output.highQualityResults = expectedAttempts * (successChance * highQualityChance) * (1+dabHandChance);

        return output;
    }
}

/** A raw material used in crafting. */
export class MWResource extends MWObject {
    static OBJECTS: Map<string, MWResource> = new Map<string, MWResource>();

    price: number;
    name: string;

    constructor(data?: string[], name?: string) {
        super();
        this.price = 0;
        this.name = "N/A";
        if(name != undefined) {
            this.name = name;
        }
        if(data != undefined) {
            this.name = data[1];
            this.price = data[4] != ""? Number(data[4].replaceAll(",", "")) : 0;
        }
    }

    static loadCsv(fileLoc: string) {
        MWResource.OBJECTS = new Map<string, MWResource>();
        /*python
        with open(file_loc) as f:
            csvreader = csv.reader(f)
            header = next(csvreader)
            for row in csvreader:
                source = row[6]
                if any(prof in source for prof in PROFESSIONS):
                    # If the item comes from any profession it is actually a material.
                    # Do not add it to the resources list.
                    continue
                new_resource = MWResource(row)
                cls.OBJECTS[new_resource.name] = new_resource
        */
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

    constructor(data: string[]) {
        this.name = data[2].slice(4, -1);
        this.commissionValue = Number(data[3]);
        this.object = findMwObject(this.name);
    }

    loadCsv(fileLoc: string) {
        CommissionItem.OBJECTS = new Map<string, CommissionItem>();
        /*python
        with open(file_loc) as f:
            csvreader = csv.reader(f)
            header = next(csvreader)
            for row in csvreader:
                new_item = CommissionItem(row)
                cls.OBJECTS[new_item.name] = new_item
        */
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