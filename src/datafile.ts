import fs from 'node:fs';
import { AkDataset, Dict } from './arkdps';

export const DataRoot = "G:/AKDATA_Project/arkdps_data_collection/output/";
export const AllChars = (() => {
    const files = fs.readdirSync(DataRoot);
    let ret = [] as string[];
    files.forEach(f => {
        if (f.endsWith(".json")) {
            ret.push(f.replace(".json", ""));
        }
    });
    console.log("AllChars: ", ret.length);
    return ret;
})();

export function loadChar(id: string): AkDataset | null {
    let filename = DataRoot + id + ".json";
    if (fs.existsSync(filename)) {
        //console.log("Load ", filename);
        return JSON.parse(fs.readFileSync(filename, 'utf-8')) as AkDataset;
    } else return null;
}

export const Dataset = (() => {
    let ret = {} as Dict<AkDataset>;
    AllChars.forEach(c => {
        let data = loadChar(c);
        if (data) {
            ret[c] = data;
        } else {
            console.log("Failed to load", c);
        }
    });
    console.log(`Loaded ${Object.keys(ret).length} into dataset.`);
    return ret;
})();
