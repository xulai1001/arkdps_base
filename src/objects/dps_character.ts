import { Dataset } from "../datafile";
import { AkDataset, CharacterData, Dict, AkBuff, BattleEquipData, SkillData } from "../arkdps";
import AttributeFrame from "./attribute_frame";
import { DpsInfo } from "./dps_info";

/** 用于DPS计算的Character类型，包括所有数值 */
export class DpsCharacter {
    public info: DpsInfo;
    public dataset: AkDataset;
    public charData: CharacterData;
    public equipData?: BattleEquipData;
    public skillData?: SkillData;
    public option?: string[];
    public buffs: AkBuff[];
    public attr: AttributeFrame;

    constructor(info: DpsInfo) {
        this.info = info;
        this.dataset = {...Dataset[info.char.id]};
        this.charData = this.dataset.char;
        this.equipData = undefined;
        if (this.info.equip) {
            let equipId = this.info.equip.id;
            let equipLevel = this.info.equip.level;
            let battleEquip = this.dataset.equip[equipId].battle;
            if (battleEquip) {
                this.equipData = battleEquip[equipLevel];
            }
        }
        this.skillData = undefined;
        if (this.info.skill) {
            let skillId = this.info.skill.id;
            let skillLevel = this.info.skill.level;
            this.skillData = this.dataset.skill[skillId][skillLevel];
        }
        this.option = this.dataset.custom.options?.tags;
        this.buffs = [];
        let frames = this.charData.phases[this.phase].attributesKeyFrames;
        this.attr = AttributeFrame.interpolate(frames, this.level);
        //console.log(this.attr);
        console.log("潜能", this.potentialFrame.explain());
        this.attr.add(this.potentialFrame);
        console.log("信赖", this.favorFrame.explain());
        this.attr.add(this.favorFrame);
        //console.log("add favor", this.attr);
        if (this.equipData) {
            let equipFrame = AttributeFrame.fromBlackboard(this.equipData.attributeBlackboard);
            this.attr.add(equipFrame);
            console.log("模组", equipFrame.explain());
        }
    }
    /*
    get equipId() {
        return this.info.equip?.id;
    }
    get equipLevel() {
        return this.info.equip?.level;
    }
    get skillId() {
        return this.info.skill?.id;
    }
    get skillLevel() {
        return this.info.skill?.level;
    }
        */
    get charId() {
        return this.info.char.id;
    }
    get phase() {
        return this.info.char.phase;
    }
    get level() {
        return this.info.char.level;
    }
    get potentialRank() {
        return this.info.char.potentialRank;
    }
    get favor() {
        return this.info.char.favor;
    }
    get favorFrame() {
        // max favor in data is 50
        return AttributeFrame.interpolate(this.dataset.char.favorKeyFrames, this.favor/2);
    }
    get potentialFrame() {
        return AttributeFrame.fromPotential(this.charData.potentialRanks.slice(0, this.potentialRank+1));
    }
};