import { Blackboard, CharTalent, Dict, SkillData } from "../arkdps";
import { CharInfo } from "./dps_info";

export enum BuffZone {
    /** 符文加算 */
    RUNE_ADD,
    /** 符文乘算 */
    RUNE_MUL,
    /** 直接加算 */
    ADD,
    /** 直接乘算 */
    MUL,
    /** 最终加算 */
    FINAL_ADD,
    /** 最终乘算 */
    FINAL_MUL
};

export type BuffMapping = {
    /** 映射到属性的哪个key上 */
    key: string,
    /** 乘区 */
    zone: BuffZone,
    /** 是否为乘算比例 */
    rate: boolean,
    /** 是否为减算 */
    minus: boolean
};

export type BuffSource = {
    type: string,
    id: string,
    name: string,
    phase?: number,
    level?: number
};


export class DpsBuff {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public blackboard: Blackboard,
        public mapping: Dict<BuffMapping>,
        public target: string,
        public source: BuffSource
    ) {}
    public static fromTalent(prefabKey: string, talent: CharTalent, char: CharInfo): DpsBuff {
        let blackboard = {...talent.blackboard} as Blackboard;
        for (var key in ["rangeId", "tokenKey"]) {
            let k = key as keyof CharTalent;
            if (talent[k])
                blackboard[k] = talent[k] as string;
        }
        let ty = (prefabKey.includes("trait") ? "trait" : "talent");
        let source = {
            type: ty,
            id: char.id,
            name: char.name,
            phase: char.phase,
            level: char.level
        } as BuffSource;
        return new DpsBuff(
            prefabKey, talent.name, talent.description, blackboard, {}, "self", source
        )
    }

    public static fromSkill(skill: SkillData, level: number): DpsBuff {
        let source = {
            type: "skill",
            id: skill.prefabId,
            name: skill.name,
            level: level
        } as BuffSource;
        return new DpsBuff(
            skill.prefabId, skill.name, skill.description, skill.blackboard,
            {}, "self", source
        )
    }
}
