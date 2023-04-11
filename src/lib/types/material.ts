import { MWItem } from "./item";
import { parse } from "csv-parse/browser/esm";
import { MWItemType } from "./item.types";

export class MWMaterial extends MWItem {
    static OBJECTS: Map<string, MWMaterial> = new Map<string, MWMaterial>();

    static loadCsv(csvString: string) {
        MWMaterial.OBJECTS = new Map<string, MWItem>();

        parse(csvString, {
            delimiter: "|",
            columns: true
        }, (error, result: MWItemType[]) => {
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