import fs from 'node:fs';
import { CharacterInfo, AkDataset, AttrFrame, Blackboard, CharacterData, Dict, AkBuff } from "../akdataset";
import AttributeFrame from "./attribute_frame";

const DataRoot = "/home/ubuntu/arkdps_data_collection/output/";

/** 用于DPS计算的Character类型，包括所有数值 */
export class DpsCharacter {
    public info: CharacterInfo;
    public dataset: AkDataset;
    public option?: string[];
    public buffs: AkBuff[];
    public attr: AttributeFrame;

    constructor(ch: CharacterInfo) {
        this.info = ch;
        this.dataset = JSON.parse(fs.readFileSync(DataRoot+ch.char.charId, 'utf-8')) as AkDataset;
        this.option = this.dataset.custom.options?.tags;
        this.buffs = [];
        let frames = this.charData.phases[this.phase].attributesKeyFrames;
        this.attr = AttributeFrame.interpolate(frames, this.level);
        this.attr.add(this.potentialFrame);
        this.attr.add(this.favorFrame);
    }
    get charData() {
        return this.dataset.char;
    }
    get equipData() {
        return this.dataset.equip;
    }
    get skillData() {
        return this.dataset.skill;
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
    get charId() {
        return this.info.char.charId;
    }
    get favor() {
        return this.info.char.favor;
    }
    get favorFrame() {
        return AttributeFrame.interpolate(this.dataset.char.favorKeyFrames, this.favor / 100);
    }
    get potentialFrame() {
        return AttributeFrame.from_potential(this.charData.potentialRanks[this.potentialRank]);
    }
};