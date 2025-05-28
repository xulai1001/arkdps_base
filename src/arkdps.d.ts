import { Blackboard, Dict } from "./akdataset";

/** 描述选择信息 */
export type CharacterInfo = {
    char: CharInfo,
    equip?: EquipInfo,
    skill?: SkillInfo
}

export type CharInfo = {
    charId: string,
    level: number,
    phase: number,
    potentialRank: number
};

export type EquipInfo = {
    equipId: string,
    level: number
};

export type SkillInfo = {
    skillId: string,
    level: number
};

