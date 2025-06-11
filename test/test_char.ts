import { DpsCharacter } from "../src/objects/dps_character";
import { DpsInfo } from "../src/objects/dps_info";

const info = DpsInfo.make(
    "char_290_vigna", 2, 40, 5, 100,
    "skchr_vigna_2", 9,
    "uniequip_002_vigna", 2
);
console.log(info.explain());
const char = new DpsCharacter(info);
console.log(JSON.stringify(char));
