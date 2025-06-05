import fs from 'node:fs';
import { AkDataset } from '../src/arkdps';

const dir = "/home/ubuntu/arkdps_data_collection/output/";
const files = fs.readdirSync(dir);
files.forEach(file => {
    if (file.endsWith(".json")) {
        console.log(file);
        const data = JSON.parse(fs.readFileSync(dir+file, 'utf-8')) as AkDataset;
    }
});
console.log("ok");

