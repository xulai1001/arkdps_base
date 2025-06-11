import { camelCase } from 'change-case';
import { FramePair, AttrFrame, CharPotential, Dict, Blackboard } from "../arkdps";
import { Common } from "../common";

export class AttributeFrame implements AttrFrame {
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

    /** 把切片的所有潜能叠加到AttributeFrame上 */
    public static fromPotentialRanks(pot: CharPotential[]): AttributeFrame {
        let ret = new AttributeFrame();
        pot.forEach(p => {
            switch (p.type) {
                case "BUFF":
                    if (p.attributeType) {
                        let attrKey = camelCase(p.attributeType);
                        if (p.formulaItem == "ADDITION") {
                            ret.add({ [attrKey]: p.value });
                        }
                        else {
                            console.log("Unknown potential formula: ", p.formulaItem);
                        }
                    }
                    break;
                case "CUSTOM":
                    // 天赋效果提高，不处理
                    break;
                default:
                    console.log("Unknown potential type: ", p.type);
                    break;
                }
            }
        );
        return ret;
    }

    /** 把Blackboard处理成属性值。key需要转为camelCase，value必须都是数字 */
    public static fromBlackboard(b: Blackboard): AttributeFrame {
        var ret = new AttributeFrame();
        for (const key in b) {
            let camelKey = camelCase(key);
            if (camelKey in ret && typeof b[key] == "number") {
                let k = camelKey as keyof AttrFrame;
                ret[k] = b[key];
            } else {
                console.log(`Skip key ${key}`)
            }
        }
        return ret;
    }

    public static interpolate([first, last]: FramePair, level: number): AttributeFrame {
        var rate = (level - first.level) / (last.level - first.level);
        var ret = {} as AttrFrame;
        for (const key in first) {
            const k = key as keyof AttrFrame;   // type annotation
            ret[k] = first[k] * (1-rate) + last[k] * rate;
        }
        ret.level = level;  // level不参与插值
        return new AttributeFrame(ret);
    }

    public add(b: AttrFrame | Dict<number>): AttributeFrame {
        for (const key in b) {
            if (key != "level") {   // 不改变level
                const k = key as keyof AttrFrame;
                this[k] += b[k];
            }
        }
        return this;
    }

    public asDict(): Dict<number> {
        return this as AttrFrame as Dict<number>;
    }

    public explain(): string {
        let ret = [];
        for (const key in this) {
            const k = key as keyof AttrFrame;
            if (this[k] != 0 && k != "level") {
                ret.push(`${key} ${Common.fmtNumber(this[k])}`);
            }
        }
        return ret.join(", ");
    }
}
