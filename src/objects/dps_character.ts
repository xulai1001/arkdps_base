import { Dataset } from "../datafile";
import { AkDataset, CharacterData, Dict, CharTalent, BattleEquipData, SkillData, UnlockCondition } from "../arkdps";
import { DpsBuff } from "./dps_buff";
import { AttributeFrame}  from "./attribute_frame";
import { DpsInfo } from "./dps_info";

/** DPS计算使用的Character类型，完成基础属性计算后的数据 */
export class DpsCharacter {
    public info: DpsInfo;
    public dataset: AkDataset;
    public charData: CharacterData;
    public equipData?: BattleEquipData = undefined;
    public skillData?: SkillData = undefined;
    public traitData?: CharTalent;
    public talentData: Array<CharTalent | undefined>;
    public option: string[] = [];
    public buffList: DpsBuff[] = [];
    public basicFrame: AttributeFrame;
    constructor(info: DpsInfo) {
        this.info = info;
        this.dataset = Dataset[info.char.id];
        this.charData = this.dataset.char;
        this.option = this.dataset.custom.options?.tags ?? [];
        this.equipData = this.getEquip();
        this.skillData = this.getSkill();
        // 计算基础数值
        this.basicFrame = this.calcBasicFrame();
        this.traitData = this.calcTrait();
        this.talentData = this.calcTalents();
        // 计算Buff信息
        this.buffList = this.calcBuffList();
    }
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
    get skillLevel() {
        return this.info.skill?.level;
    }
    get equipLevel() {
        return this.info.equip?.level;
    }
    /** which从1开始，或者是"trait" */
    public talentId(which: number | string) {
        return this.charId.replace("char_", "tachr_") + "_" + which;
    }
    public getEquip(): BattleEquipData | undefined {
        if (this.info.equip) {
            let equipId = this.info.equip.id;
            let equipLevel = this.info.equip.level;
            let battleEquip = this.dataset.equip[equipId].battle;
            if (battleEquip) {
                return battleEquip[equipLevel];
            }
        }
    }    
    public getSkill(): SkillData | undefined { 
        if (this.info.skill) {
            let skillId = this.info.skill.id;
            let skillLevel = this.info.skill.level;
            return this.dataset.skill[skillId][skillLevel];
        }
    }
    public meetsCondition(cond: UnlockCondition): boolean {
        //return this.phase > cond.phase || 
        //    (this.phase == cond.phase && this.level >= cond.level);
        // 放宽解锁条件，只判断精英化等级
        return this.phase >= cond.phase;
    }
    calcTrait(): CharTalent | undefined {
        const trait = this.charData.trait;
        if (trait) {
            let ret;
            for (var i = trait.length-1; i>=0; i--) {
                if (this.potentialRank >= trait[i].requiredPotentialRank && this.meetsCondition(trait[i].unlockCondition)) {
                    ret = {...trait[i]} as CharTalent;
                    break;
                }
            }
            // override trait
            if (ret && this.equipData) {
                for (var part of this.equipData.parts) {
                    if (!part.overrideTraitDataBundle) continue;
                    for (var i=part.overrideTraitDataBundle.length - 1; i>=0; i--) {
                        let bundle = part.overrideTraitDataBundle[i];
                        if (this.potentialRank >= bundle.requiredPotentialRank && this.meetsCondition(bundle.unlockCondition)) {
                            ret.override = true;
                            if (bundle.overrideDescripton)
                                ret.description = bundle.overrideDescripton;
                            if (bundle.additionalDescription)
                                ret.description += bundle.additionalDescription;
                            if (bundle.blackboard) {
                                Object.assign(ret.blackboard, bundle.blackboard);
                                console.log("模组覆盖特性", ret.blackboard);
                            }
                            break;
                        }
                    }
                }
            }
            return ret;
        }
    }

    calcTalents(): Array<CharTalent | undefined> {
        if (!this.charData.talents) return [];
        let ret = [];
        for (var which=0; which<this.charData.talents.length; which++) {
            let candidates = this.charData.talents[which];
            let talent;
            for (var i=candidates.length-1; i>=0; i--) {
                if (this.potentialRank >= candidates[i].requiredPotentialRank && this.meetsCondition(candidates[i].unlockCondition)) {
                    talent = {...candidates[i]} as CharTalent;
                    break;
                }
            }
            if (talent) {
                // override
                if (this.equipData) {
                    for (var part of this.equipData.parts) {
                        if (!part.addOrOverrideTalentDataBundle) continue;
                        for (var j=part.addOrOverrideTalentDataBundle.length-1; j>=0; j--) {
                            let bundle = part.addOrOverrideTalentDataBundle[j];
                            if (bundle.talentIndex == which &&
                                this.potentialRank >= bundle.requiredPotentialRank && this.meetsCondition(bundle.unlockCondition)) {
                                talent.override = true;
                                talent.description = bundle.upgradeDescription;
                                talent.rangeId = bundle.rangeId;
                                Object.assign(talent.blackboard, bundle.blackboard);
                                console.log(`模组覆盖天赋 ${bundle.prefabKey}: `, talent.blackboard);
                                break;
                            }
                        }
                    }
                }                
            }
            ret.push(talent);
        } // for which
        return ret;
    }

    calcBasicFrame(): AttributeFrame {
        let frames = this.charData.phases[this.phase].attributesKeyFrames;
        let attr = AttributeFrame.interpolate(frames, this.level);
        let potentialFrame = AttributeFrame.fromPotentialRanks(this.charData.potentialRanks.slice(0, this.potentialRank+1));
        let favorFrame = AttributeFrame.interpolate(this.charData.favorKeyFrames, this.favor/2);
        
        console.log("潜能", potentialFrame.explain());
        attr.add(potentialFrame);
        console.log("信赖", favorFrame.explain());
        attr.add(favorFrame);
        if (this.equipData) {
            let equipFrame = AttributeFrame.fromBlackboard(this.equipData.attributeBlackboard);
            console.log("模组", equipFrame.explain());
            attr.add(equipFrame);
        }
        return attr;
    }

    calcBuffList(): DpsBuff[] {
        let ret = [];
        let traitBuff = this.traitData ?
            DpsBuff.fromTalent(this.talentId("trait"), this.traitData, this.info.char) : undefined;
        let talentBuffs = [] as DpsBuff[];
        this.talentData.forEach(t => {
            if (t) {
                let buff = DpsBuff.fromTalent(this.talentId(t.prefabKey), t, this.info.char);
                talentBuffs.push(buff);
            }
        });
        let skillBuff = (this.skillData && this.skillLevel) ?
            DpsBuff.fromSkill(this.skillData, this.skillLevel) : undefined;
        return [traitBuff, ...talentBuffs, skillBuff].filter((x): x is DpsBuff => x != null);
    }
};