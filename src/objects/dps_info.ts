import { Dataset } from "../datafile";
export class BaseInfo {
    public id: string = "";
    public name: string = "empty";
    public level: number = 0;

    public explain(): string {
        // level+1
        return `${this.name} 等级 ${1+this.level}`;
    }
}

export class CharInfo extends BaseInfo {
    public phase: number = 0;
    public potentialRank: number = 0;
    public favor: number = 0;

    public explain(): string {
        return `${this.name} 精英 ${this.phase} 等级 ${this.level} 潜能 ${1+this.potentialRank} 信赖 ${this.favor}`;
    }
}

export class DpsInfo {
    public char: CharInfo;
    public equip?: BaseInfo;
    public skill?: BaseInfo;

    constructor(char: CharInfo, equip?: BaseInfo, skill?: BaseInfo) {
        this.char = char;
        this.equip = equip;
        this.skill = skill;
    }

    public static make(
        charId: string, phase: number, level: number, pot: number, favor: number,
        skillId?: string, skillLevel?: number,
        equipId?: string, equipLevel?: number
    ): DpsInfo {
        if (!(charId in Dataset)) {
            throw `charId not found: ${charId}`;
        }
        let data = Dataset[charId];
        let charName = data.char.name;
        let charInfo = new CharInfo();
        charInfo.name = charName;
        charInfo.id = charId;
        charInfo.phase = phase;
        charInfo.level = level;
        charInfo.potentialRank = pot;
        charInfo.favor = favor;
        let skill = undefined;
        if (skillId != null && skillLevel != null) {
            skill = new BaseInfo();
            skill.level = skillLevel;   // 0-9
            skill.id = skillId;
            skill.name = data.skill[skillId][skillLevel].name;
        }
        let equip = undefined;
        if (equipId != null && equipLevel != null) {
            equip = new BaseInfo();
            equip.level = equipLevel;   // 0-2
            equip.id = equipId;
            equip.name = data.equip[equipId].uniEquipName;
        }
        return new DpsInfo(charInfo, equip, skill);
    }

    public explain(): string {
        let ret = `角色: ${this.char.explain()}`;
        if (this.equip)
            ret += `\n模组: ${this.equip.explain()}`;
        if (this.skill)
            ret += `\n技能: ${this.skill.explain()}`;
        return ret;
    }
};