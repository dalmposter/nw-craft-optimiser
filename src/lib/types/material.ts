import { CraftedMWObject, MWItem } from "./item";
import { parse } from "csv-parse/browser/esm";
import { MWItemType, CraftedMWObjectType } from "./item.types";

export class MWMaterial extends CraftedMWObject {
    static OBJECTS: Map<string, MWMaterial> = new Map<string, MWMaterial>();

    constructor (data: CraftedMWObjectType) {
        super(data);
        this.type = "Material";
    }

    static loadCsv(csvString: string) {
        MWMaterial.OBJECTS = new Map<string, MWItem>();

        parse(csvString, {
            delimiter: "|",
            columns: true
        }, (error, result: CraftedMWObjectType[]) => {
            if(error) {
                console.error(error);
            }
            for(var materialInput of result) {
                let newMaterial = new MWMaterial(materialInput);
                MWMaterial.OBJECTS.set(newMaterial.name, newMaterial);
            }
        });
    }
}