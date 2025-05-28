import fs from 'node:fs';
import { CharacterInfo } from "./arkdps";
import { AkDataset, AttrFrame, Blackboard, CharacterData } from "./akdataset";
import { AkBuff } from "./buff";

const DataRoot = "/home/ubuntu/arkdps_data_collection/output/";

/** 用于DPS计算的Character类型，包括所有数值 */
export class DpsCharacter {
    public info: CharacterInfo;
    public dataset: AkDataset;
    public option?: string[];
    public buffs: AkBuff[];
    public attr: AttrFrame;

    constructor(ch: CharacterInfo) {
        this.info = ch;
        this.dataset = JSON.parse(fs.readFileSync(DataRoot+ch.char.charId, 'utf-8')) as AkDataset;
        this.option = this.dataset.custom.options?.tags;
        this.buffs = [];
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
};