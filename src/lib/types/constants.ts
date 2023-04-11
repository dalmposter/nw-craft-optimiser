export const PROFESSIONS: string[] = [
    "Alchemy",
    "Armorsmithing",
    "Artificing",
    "Blacksmithing",
    "Jewelcrafting",
    "Leatherworking",
    "Tailoring"
]

export const ARTISAN_TYPES: Map<string, string> = new Map<string, string>([
    ["Alchemy", "Alchemist"],
    ["Armorsmithing", "Armorer"],
    ["Artificing", "Artificer"],
    ["Blacksmithing", "Blacksmith"],
    ["Jewelcrafting", "Jeweler"],
    ["Leatherworking", "Leatherworker"],
    ["Tailoring", "Tailor"]
])

export const FOCUS_MULTIPLIER: number = 1/430

// A list of objects and the quantity required
export type Recipe = Array<[number, string]>