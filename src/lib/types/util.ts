import { CraftedMWObject, MWItem, MWResource } from "./item"
import { MWMaterial } from "./material"

/**
 * Find a MW object by name.
 * 
 * Searches the following lists in order:
 *  - MW Items (gear etc)
 *  - MW Materials (crafted materials)
 *  - MW Resources (raw materials)
 * If no corresponding item is found it is assumed to be a resource with 0 value.
 * 
 * @param name The name of the object to search for, with correct capitalisation.
 * @param assumeResource Set to false to return None instead of a 0 value resource if no
 *                       match is found.
 * 
 * @raises Error if no matching object is found and assumeResource is false.
 */
export const findMwObject = (name: string, assumeResource: boolean = true): CraftedMWObject | MWResource => {
    if(name.slice(-3) === " +1") {
        name = name.slice(0, -3)
    }
    if(MWItem.OBJECTS.has(name)) {
        return MWItem.OBJECTS.get(name)!
    }
    if(MWMaterial.OBJECTS.has(name)) {
        return MWMaterial.OBJECTS.get(name)!
    }
    if(MWResource.OBJECTS.has(name)) {
        return MWResource.OBJECTS.get(name)!
    }
    if(assumeResource) {
        return new MWResource(undefined, name)
    }

    throw new Error(`No matching MW Object found for ${name}`)
}

/**
     * 
     * @param name 
     * @returns 
     * 
     * @raises Error if no material or item matches given name,
     */
export const findMwItem =(name: string): CraftedMWObject => {
    console.debug(`Finding MW item ${name}`)
    if(name.slice(-3) === " +1") {
        name = name.slice(0, -3)
    }
    if(MWItem.OBJECTS.has(name)) {
        return MWItem.OBJECTS.get(name)!
    }
    if(MWMaterial.OBJECTS.has(name)) {
        return MWMaterial.OBJECTS.get(name)!
    }

    throw new Error(`No matching MW Item found for ${name}.`)
}

/**
 * Combine two lists of number, string tuples by adding the numbers together for entries
 * where the strings are equal. Mutates the target list in place.
 * 
 * @param target 
 * @param source 
 */
export const aggregateTupleLists = (target: [number, string][], source: [number, string][]) => {

    for(var sourceEntry of source) {
        // eslint-disable-next-line no-loop-func
        let matches = target.filter((value: [number, string]) => value[1] === sourceEntry[1])
        if(matches.length > 0) {
            matches[0][0] += sourceEntry[0]
        } else {
            target.push(sourceEntry)
        }
    }
}

export const round = (input: number, dp: number) => {
    return Math.round(input * (Math.pow(10, dp))) / Math.pow(10, dp)
}

/** loads all the data files containing resources, recipes, artisans etc. */
export const loadAllFiles = () => {
    /* python
    cwd = os.path.dirname(os.path.dirname(__file__))
    
    # Load resources
    resource_loc = f"{cwd}/Input/Resources.csv"
    logger.info(f"Loading resources from {resource_loc}.")
    MWResource.load_csv(resource_loc)

    # Load materials
    material_loc = f"{cwd}/Input/MW Recipes.csv"
    logger.info(f"Loading materials from {material_loc}.")
    MWMaterial.load_csv(material_loc)

    # Load items
    items_loc = f"{cwd}/Input/MW Recipes.csv"
    logger.info(f"Loading materials from {items_loc}.")
    MWItem.load_csv(items_loc)

    # Load weapons
    weapons_loc = f"{cwd}/Input/MW Items.csv"
    logger.info(f"Loading weapons from {weapons_loc}.")
    MWWeapon.load_csv(weapons_loc)

    # Load artisans
    artisan_loc = f"{cwd}/Input/Artisans.csv"
    logger.info(f"Loading artisans from {artisan_loc}.")
    Artisan.load_csv(artisan_loc)

    # Load tools
    tools_loc = f"{cwd}/Input/Tools.csv"
    logger.info(f"Loading tools from {tools_loc}.")
    Tool.load_csv(tools_loc)

    # Load supplements
    supplement_loc = f"{cwd}/Input/Supplements.csv"
    logger.info(f"Loading supplements from {supplement_loc}.")
    Supplement.load_csv(supplement_loc)
    
    # Load commission items
    commission_loc = f"{cwd}/Input/Commissions.csv"
    logger.info(f"Loading commissions from {commission_loc}.")
    item.CommissionItem.load_csv(commission_loc)
    */
}