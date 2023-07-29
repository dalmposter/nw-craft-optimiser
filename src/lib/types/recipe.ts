import { Recipe } from "./constants";
import { CraftedMWObject, MWResource } from "./item";
import { findMwObject, aggregateTupleLists } from "./util";
import { ToolType, SupplementType, ArtisanType } from "./recipe.types"
import "stream-browserify"
import { parse } from "csv-parse/browser/esm";

export class Tool {
    static OBJECTS: Map<string, Tool> = new Map<string, Tool>();

    profession: string;
    name: string;
    proficiency: number;
    focus: number;
    dabHandChance: number;
    recycleChance: number;
    virtuosoChance: number;
    miracleWorkerChance: number;
    passionProjectChance: number;
    available: boolean;

    constructor(data: ToolType) {
        this.available = true;
        this.profession = data.profession;
        this.name = data.name;
        this.proficiency = Number(data.proficiency);
        this.focus = Number(data.focus);
        // Extract the special ability for this tool (if any)
        this.dabHandChance = Number(data.dabHandChance);
        this.recycleChance = Number(data.recycleChance);
        this.virtuosoChance = Number(data.virtuosoChance);
        this.miracleWorkerChance = Number(data.miracleWorkerChance);
        this.passionProjectChance = Number(data.passionProjectChance);
    }

    getSkill(): [string, number] {
        if(this.dabHandChance > 0) return ["Dab Hand", this.dabHandChance]
        if(this.recycleChance > 0) return ["Recycle", this.recycleChance]
        if(this.virtuosoChance > 0) return ["Virtuoso", this.virtuosoChance]
        if(this.miracleWorkerChance > 0) return ["Miracle Worker", this.miracleWorkerChance]
        if(this.passionProjectChance > 0) return ["Passion Project", this.passionProjectChance]

        return ["None", 0]
    }

    static loadCsv(csvString: string) {
        parse(csvString, {
            delimiter: "|",
            columns: true
        }, (error, result: ToolType[]) => {
            if(error) {
                console.error(error);
            }
            for(var toolInput of result) {
                let newTool = new Tool(toolInput);
                Tool.OBJECTS.set(newTool.name, newTool)
            }
        });
    }

    /** Print this tools stats. */
    prettyPrint(): string {
        let abilityString = "";
        if(this.dabHandChance > 0) {
            abilityString = ` ${this.dabHandChance}d`;
        } else if(this.recycleChance > 0) {
            abilityString = ` ${this.recycleChance}r`;
        }
        return `${this.name} (${this.proficiency}/${this.focus}${abilityString})`;
    }
}

export class Supplement {
    static OBJECTS: Map<string, Supplement> = new Map<string, Supplement>();

    highQuality: boolean;
    supplementRecipe?: MWRecipe;
    name: string;
    proficiency: number;
    focus: number;
    dabHandChance: number;
    recycleChance: number;
    virtuosoChance: number;
    miracleWorkerChance: number;
    passionProjectChance: number;
    object: CraftedMWObject | MWResource;

    constructor(data: SupplementType) {
        this.highQuality = data.highQuality.toLowerCase() === "true";
        this.name = data.name;
        this.proficiency = Number(data.proficiency);
        this.focus = Number(data.focus);
        this.dabHandChance = Number(data.dabHandChance);
        this.recycleChance = Number(data.recycleChance);
        this.virtuosoChance = Number(data.virtuosoChance);
        this.miracleWorkerChance = Number(data.miracleWorkerChance);
        this.passionProjectChance = Number(data.passionProjectChance);
        this.object = findMwObject(this.name);
    }

    getSkill(): [string, number] {
        if(this.dabHandChance > 0) return ["Dab Hand", this.dabHandChance]
        if(this.recycleChance > 0) return ["Recycle", this.recycleChance]
        if(this.virtuosoChance > 0) return ["Virtuoso", this.virtuosoChance]
        if(this.miracleWorkerChance > 0) return ["Miracle Worker", this.miracleWorkerChance]
        if(this.passionProjectChance > 0) return ["Passion Project", this.passionProjectChance]

        return ["None", 0]
    }

    static loadCsv(csvString: string) {
        parse(csvString, {
            delimiter: "|",
            columns: true
        }, (error, result: SupplementType[]) => {
            if(error) {
                console.error(error);
            }
            for(var supInput of result) {
                let newSupplement = new Supplement(supInput);
                Supplement.OBJECTS.set(newSupplement.name, newSupplement)
            }
        })
    }

    /** Print this supplements stats. */
    prettyPrint(): string {
        let supplementAbility = ""
        if(this.dabHandChance > 0) {
            supplementAbility = ` ${this.dabHandChance}d`
        } else if(this.recycleChance > 0) {
            supplementAbility = ` ${this.recycleChance}r`
        }
        return `${this.name} (${this.proficiency}/${this.focus}${supplementAbility})`
    }

    /**
     * Calculate the resource costs for crafting this supplement.
     * 
     * Hard coded to use Beatrice (best +1 recycle crafter), Gond Hammer, and Wintergreen
     * Tea +1. Intentionally never using any MW Supplements to prevent recursion in
     * calculations. This is the best setup for crafting supplements without using a MW
     * supplement to do it.
     * 
     * @param quantity 
     */
    async craft(quantity: number = 1): Promise<MWRecipe> {
        // Supplements made out of crafted materials return hard-coded result when crafted
        // in the context of being used as a supplement. This prevents infinite recursion in
        // crafting, while still allowing the results to be based on market prices.
        if(this.name === "Workman's Incense") {
            let out = new MWRecipe(this.object, 1);
            out.supplementMaterials = [];
            out.materials = [[15, "Bronzewood Log"], [1.25, "Tincal"]];
            out.highQuality = false;
            out = out.multiply(quantity);
            return out
        }
        if(this.name === "Workman's Incense +1") {
            let out = new MWRecipe(this.object, 1);
            out.supplementMaterials = [];
            out.materials = [[37.5, "Bronzewood Log"], [3.625, "Tincal"]];
            out.highQuality = true;
            out = out.multiply(quantity);
            return out
        }
        if(this.name === "Hermit's Incense") {
            let out = new MWRecipe(this.object, 1);
            out.supplementMaterials = [];
            out.materials = [[4.85, "Hardened Blight Bark"], [4.85, "Troll's Earwax Resin"], [15, "Feywood Log"], [1.25, "Soulfire Flies"]];
            out.highQuality = false;
            out = out.multiply(quantity);
            return out
        }
        if(this.name === "Hermit's Incense +1") {
            let out = new MWRecipe(this.object, 1);
            out.supplementMaterials = [];
            out.materials = [[12.125, "Hardened Blight Bark"], [12.125, "Troll's Earwax Resin"], [37.5, "Feywood Log"], [3.625, "Soulfire Flies"]];
            out.highQuality = false;
            out = out.multiply(quantity);
            return out
        }
        if(this.name === "Dreamer's Incense") {
            let out = new MWRecipe(this.object, 1);
            out.supplementMaterials = [];
            out.materials = [[10.0, "Mushroom Log"], [4.5, "Faerzress Rock"], [4.5, "Menzoberranzan Faerzress Crystal"], [1.15, "Drider Leg"], [0.85, "Mushroom Droplet"]];
            out.highQuality = false;
            out = out.multiply(quantity);
            return out
        }
        if(this.name === "Dreamer's Incense +1") {
            let out = new MWRecipe(this.object, 1);
            out.supplementMaterials = [];
            out.materials = [[22.0, "Mushroom Log"], [10, "Faerzress Rock"], [10, "Menzoberranzan Faerzress Crystal"], [2.5, "Drider Leg"], [1.85, "Mushroom Droplet"]];
            out.highQuality = false;
            out = out.multiply(quantity);
            return out
        }
        // TODO: do we want to use wintergreen tea +1? balm?
        if(this.supplementRecipe === undefined) {
            this.supplementRecipe = await this.object.craft(
                Artisan.OBJECTS.get("Alchemist")!.filter((value: Artisan) => value.name === "Beatrice")[0],
                Tool.OBJECTS.get("Forgehammer of Gond"),
                Supplement.OBJECTS.get(this.highQuality? "Wintergreen Tea +1" : "Wintergreen Balm +1"),
                1,
                this.highQuality
            )
        }
        let out = this.supplementRecipe!.multiply(quantity/this.supplementRecipe!.quantity);
        return out;
    }
}

export class Artisan {
    static OBJECTS: Map<string, Artisan[]> = new Map<string, Artisan[]>([
        ["Adventurer", []],
        ["Alchemist", []],
        ["Armorer", []],
        ["Artificer", []],
        ["Blacksmith", []],
        ["Jeweler", []],
        ["Leatherworker", []],
        ["Tailor", []],
    ]);

    profession: string;
    name: string;
    rarity: string
    dabHandChance: number;
    recycleChance: number;
    virtuosoChance: number;
    miracleWorkerChance: number;
    passionProjectChance: number;
    proficiency: number;
    focus: number;
    commissionModifier: number;
    speedModifier: number;
    available: boolean;

    constructor(data: ArtisanType) {
        this.available = true;
        this.profession = data.profession;
        this.name = data.name;
        this.rarity = data.rarity;
        this.dabHandChance = Number(data.dabHandChance);
        this.recycleChance = Number(data.recycleChance);
        this.virtuosoChance = Number(data.virtuosoChance);
        this.miracleWorkerChance = Number(data.miracleWorkerChance);
        this.passionProjectChance = Number(data.passionProjectChance);
        this.proficiency = Number(data.proficiency);
        this.focus = Number(data.focus);
        this.commissionModifier = Number(data.commissionModifier)
        this.speedModifier = Number(data.speedModifier)
    }

    getSkill(): [string, number] {
        if(this.dabHandChance > 0) return ["Dab Hand", this.dabHandChance]
        if(this.recycleChance > 0) return ["Recycle", this.recycleChance]
        if(this.virtuosoChance > 0) return ["Virtuoso", this.virtuosoChance]
        if(this.miracleWorkerChance > 0) return ["Miracle Worker", this.miracleWorkerChance]
        if(this.passionProjectChance > 0) return ["Passion Project", this.passionProjectChance]

        return ["None", 0]
    }

    static loadCsv(csvString: string) {
        parse(csvString, {
            delimiter: "|",
            columns: true
        }, (error, result: ArtisanType[]) => {
            if(error) {
                console.error(error);
            }
            for(var artisanInput of result) {
                let newArtisan = new Artisan(artisanInput);
                if(newArtisan.profession === "Any") {
                    for(var key in Artisan.OBJECTS) {
                        Artisan.OBJECTS.get(key)!.push(newArtisan)
                    }
                } else if(Artisan.OBJECTS.has(newArtisan.profession)) {
                    Artisan.OBJECTS.get(newArtisan.profession)!.push(newArtisan)
                } else {
                    Artisan.OBJECTS.set(newArtisan.profession, [newArtisan])
                }
            }
        });
    }

    /** Return the details of this artisan, nicely formatted for printing. */
    prettyPrint(): string {
        let artisanAbilityString = ""
        if(this.dabHandChance > 0) {
            artisanAbilityString = ` ${this.dabHandChance}d`
        }
        if(this.recycleChance > 0) {
            artisanAbilityString = ` ${this.recycleChance}r`
        }
        return `${this.name} [${this.rarity}] (${Number(this.proficiency)}/${this.focus}${artisanAbilityString})`
    }
}

/**
 * Represents a way of crafting a given item, and the associated costs.
 * 
 * Contains the artisan, tool, and supplement used, as well as the material cost to craft
 * the given quantity including the material cost for all supplements that would be
 * consumed. Also provides stats about the crafting such as how many failures would be
 * expected, how many normal or +1 results would be made as a by-product.
 */
export class MWRecipe {
    result: CraftedMWObject | MWResource;
    quantity: number;
    artisan?: Artisan;
    tool?: Tool;
    supplement?: Supplement;
    materials: Recipe;
    supplements: Recipe;
    supplementMaterials: Recipe;
    highQuality: boolean;
    failures: number = -1;
    normalResults: number = -1;
    highQualityResults: number = -1;
    attempts: number = -1;
    totalDabHandChance: number = -1;
    totalRecycleChance: number = -1;
    successChance: number = -1;
    highQualityChance: number = -1;

    constructor(
        result: CraftedMWObject | MWResource,
        quantity?: number,
        artisan?: Artisan,
        tool?: Tool,
        supplement?: Supplement,
        highQuality?: boolean
    ) {
        this.result = result;
        this.quantity = quantity === undefined? 1 : quantity;
        this.artisan = artisan;
        this.tool = tool;
        this.supplement = supplement;
        this.materials = [];
        this.supplements = [];
        this.supplementMaterials = []; //TODO: Replace this with cost of supplements
        this.highQuality = highQuality === undefined? false : highQuality;
    }

    /** Calculates the total cost of this recipe. */
    getCost(): number {
        let cost: number = 0;
        for(var entry of this.materials) {
            let matObject = findMwObject(entry[1]);
            if(matObject !== undefined && matObject.price !== undefined) {
                cost += entry[0] * matObject.price;
            } else {
                console.debug(`Failed to find price of mw object for ${entry[1]}`);
            }
        }
        for(var supplementMatEntry of this.supplementMaterials) {
            let supObject = findMwObject(supplementMatEntry[1]);
            if(supObject !== undefined && supObject.price !== undefined) {
                cost += supplementMatEntry[0] * supObject.price;
            } else {
                console.debug(`Failed to find price of supplement for ${supplementMatEntry[1]}`);
            }
        }
        return cost;
    }

    /** Multiply the contents of this recipe by a number. */
    multiply(quantity: number): MWRecipe {
        //TODO: Implement custom copy and deepcopy function to replace this
        let output = new MWRecipe(
            this.result,
            this.quantity,
            this.artisan,
            this.tool,
            this.supplement,
            this.highQuality
        );
        output.materials = JSON.parse(JSON.stringify(this.materials));
        output.supplements = JSON.parse(JSON.stringify(this.supplements));
        output.supplementMaterials = JSON.parse(JSON.stringify(this.supplementMaterials));
        
        // Perform the multiplication
        output.quantity = output.quantity * quantity;
        output.materials.forEach((matEntry: [number, string]) => {
            matEntry[0] = matEntry[0] * quantity;
        });
        output.supplements.forEach((supEntry: [number, string]) => {
            supEntry[0] = supEntry[0] * quantity;
        });
        output.supplementMaterials.forEach((supMatEntry: [number, string]) => {
            supMatEntry[0] = supMatEntry[0] * quantity;
        });
        return output;
    }

    /** Add a recipes entries to this one. */
    absorb(recipe: MWRecipe) {
        aggregateTupleLists(this.materials, recipe.materials);
        aggregateTupleLists(this.supplements, recipe.supplements);
        aggregateTupleLists(this.supplementMaterials, recipe.supplementMaterials);
    }

    /**
     * Print details for a list of recipes one after the other.
     * 
     * The first one will have a full pretty print, while the rest will have a more
     * concise output.
     * 
     * @param intput 
     */
    static prettyPrintList(input: [MWRecipe, number][]): string {
        let stringBuilder: string[] = []
        stringBuilder.push(
            input[0][0].prettyPrint(),
            "\n",
            "-----------------------------------------------------------",
            "\n"
        );
        input.forEach((recipeRank: [MWRecipe, number]) => {
            let recipe = recipeRank[0];
            let cost = recipeRank[1];
            stringBuilder.push(`\n${Math.round(cost).toLocaleString("en-US")} AD`);
            stringBuilder.push(` (${Math.round(recipe.normalResults * 100) / 100} Normal,`);
            stringBuilder.push(` ${Math.round(recipe.highQualityResults * 100) / 100} +1):`);
            if(recipe.artisan !== undefined && recipe.supplement !== undefined) {
                stringBuilder.push(
                    ` ${recipe.artisan.prettyPrint()} + ${recipe.supplement.prettyPrint()}`
                );
            }
        });
        return stringBuilder.join("")
    }

    /**
     * Print in the console a pretty representation of this recipe.
     * 
     * Includes the Artisan and Supplement used (Tool is always assumed to be Gond Hammer).
     * Also shows the normal:+1 result ratio and the full list of materials consumed and
     * their overall cost.
     */
    prettyPrint(): string {
        let stringBuilder: string[] = [];
        stringBuilder.push(`\n${this.result.name}${this.highQuality? " +1" : ""}`);
        stringBuilder.push("-----------------------------------------------------------");
        if(this.artisan !== undefined && this.supplement !== undefined) { //TODO: Fix MWResource craft
            stringBuilder.push(`${this.artisan.prettyPrint()} + ${this.supplement.prettyPrint()}`
                             + ` : ${Math.round(this.attempts * 100) / 100} Attempts`);
        }
        stringBuilder.push(`${Math.round(this.failures * 100) / 100} Failures, `
                    + `${Math.round(this.normalResults * 100) / 100} Normal Results, `
                    + `${Math.round(this.highQualityResults * 100) / 100} High Quality Results`);
        stringBuilder.push("\nMaterials used:");
        let cost = 0;
        for(var matEntry of this.materials) {
            let roundedQuantity = Math.round(matEntry[0] * 100) / 100;
            stringBuilder.push(`  ${roundedQuantity}x ${matEntry[1]}`);
            let matObject = findMwObject(matEntry[1]);
            if(matObject !== undefined && matObject.price !== undefined) {
                cost += matEntry[0] * matObject.price;
            }
        }
        stringBuilder.push(`Material AD cost: ${Math.round(cost).toLocaleString("en-US")}`);
        stringBuilder.push("\nSupplements used:");
        for(var supplementEntry of this.supplements) {
            let roundedQuantity = Math.round(supplementEntry[0] * 100) / 100;
            stringBuilder.push(`  ${roundedQuantity}x ${supplementEntry[1]}`);
        }
        let supplementCost = 0;
        stringBuilder.push("Materials consumed by supplements:");
        for(var supplementMatEntry of this.supplementMaterials) {
            let roundedQuantity = Math.round(supplementMatEntry[0] * 100) / 100;
            stringBuilder.push(`  ${roundedQuantity}x ${supplementMatEntry[1]}`);
            let supMatObject = findMwObject(supplementMatEntry[1]);
            if(supMatObject !== undefined && supMatObject.price !== undefined) {
                supplementCost += supplementMatEntry[0] * supMatObject.price;
            }
        }
        stringBuilder.push(`Supplement AD Cost: ${Math.round(supplementCost).toLocaleString("en-US")}`);
        stringBuilder.push(`\nTotal AD cost: ${Math.round(cost + supplementCost).toLocaleString("en-US")}`);
        return stringBuilder.join("\n")
    }
}