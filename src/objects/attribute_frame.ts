import { camelCase } from 'change-case';
import { FramePair, AttrFrame, CharPotential, Dict } from "../arkdps";

class AttributeFrame implements AttrFrame {
    atk: number = 0;
    attackSpeed: number = 0;
    baseAttackTime: number = 0;
    baseForceLevel: number = 0;
    blockCnt: number = 0;
    cost: number = 0;
    def: number = 0;
    hpRecoveryPerSec: number = 0;
    level: number = 0;
    magicResistance: number = 0;
    massLevel: number = 0;
    maxDeckStackCnt: number = 0;
    maxDeployCount: number = 0;
    maxHp: number = 0;
    respawnTime: number = 0;
    spRecoveryPerSec: number = 0;
    tauntLevel: number = 0;

    constructor(f?: AttrFrame) {
        if (f) {
            Object.keys(f).forEach(key => {
                const k = key as keyof AttrFrame;   // type annotation
                this[k] = f[k];
            });
        }
    }

    static from_potential(p: CharPotential): AttributeFrame {
        let ret = new AttributeFrame();
        switch (p.type) {
            case "BUFF":
                let attrKey = camelCase(p.attributeType);
                if (p.formulaItem == "ADDITION")
                    ret.add({attrKey: p.value});
                else {
                    console.log("Unknown potential formula: ", p.formulaItem);
                }
                break;
            case "CUSTOM":
                // 天赋效果提高，不处理
                break;
            default:
                console.log("Unknown potential type: ", p.type);
                break;
        }
        return ret;
    }

    static interpolate([first, last]: FramePair, level: number): AttributeFrame {
        var rate = (level - first.level) / (last.level - first.level);
        var ret = {} as AttrFrame;
        for (const key in first) {
            const k = key as keyof AttrFrame;   // type annotation
            ret[k] = first[k] * (1-rate) + last[k] * rate;
        }
        return new AttributeFrame(ret);
    }

    add(b: AttrFrame | Dict<number>): AttributeFrame {
        for (const key in b) {
            const k = key as keyof AttrFrame;   // type annotation
            this[k] += b[k];
        }
        return this;
    }

    as_dict(): Dict<number> {
        return this as AttrFrame as Dict<number>;
    }
}

export default AttributeFrame;
