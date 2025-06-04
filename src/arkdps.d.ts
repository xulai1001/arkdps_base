export type Dict<T> = {
    [key: string]: T
};

export type AkDataset = {
    char: CharacterData,
    custom: CustomData,
    equip: Dict<EquipData>,
    skill: Dict<SkillData[]>
};

/** 预处理后的blackboard部分 */
export type Blackboard = Dict<string | number>;
export type FramePair = [first: AttrFrame, last: AttrFrame];

/** 预处理的角色数据 character_table.json */
export type CharacterData = {
    allSkillLvlup: Dict<number>[],
    description: string,
    favorKeyFrames: FramePair,
    isSpChar: boolean,
    itemObtainApproach: string,
    name: string,
    phases: CharPhase[],
    potentialRanks: CharPotential[],
    profession: string,
    rarity: string,
    skills: CharSkill[],
    subProfessionId: string,
    talents: CharTalent[][],
    trait: CharTalent[]
};

/** 属性关键帧 */
export type AttrFrame = {
    atk: number,
    attackSpeed: number,
    baseAttackTime: number,
    baseForceLevel: number,
    blockCnt: number,
    cost: number,
    def: number,
    hpRecoveryPerSec: number,
    level: number,
    magicResistance: number,
    massLevel: number,
    maxDeckStackCnt: number,
    maxDeployCount: number,
    maxHp: number,
    respawnTime: number,
    spRecoveryPerSec: number,
    tauntLevel: number
};

/** 精英化等级 */
export type CharPhase = {
    attributesKeyFrames: FramePair,
    characterPrefabKey: string,
    evolveCost?: Dict<number>,
    maxLevel: number,
    rangeId: string 
};

/** 潜能。一部分可以改为Enum */
export type CharPotential = {
    attributeType?: string,
    description: string,
    formulaItem?: string,
    type: string,
    value: number
};

/** CharacterData里的技能消耗部分 */
export type CharSkill = {
    levelUpCostCond: Dict<number>[],
    overridePrefabKey?: string,
    overrideTokenKey?: string,
    skillId: string
};

/** 天赋和特性数据 */
export type CharTalent = {
    blackboard: Blackboard,
    description: string,
    name: string,
    prefabKey: string,
    rangeId?: string,
    requiredPotentialRank: number,
    tokenKey?: string,
    unlockCondition: UnlockCondition
};

/** 技能、天赋、模组解锁条件 */
export type UnlockCondition = {
    level: number,
    phase: string
};

export type CustomData = {
    anim?: Dict<number | Dict<number>>,
    options?: DpsOption,
    spec?: Dict<Blackboard>
};

/** dps_options.json数据 */
export type DpsOption = {
    tags: string[],
    cond_info?: number | Dict<string>
};

/** 模组数据 uniequip_table.json */
export type EquipData = {
    battle?: BattleEquipData[],
    charId: string,
    itemCost?: Dict<Dict<number>>,
    typeIcon: string,
    uniEquipId: string,
    uniEquipName: string
};

/** 模组战斗数据 battle_equip_table.json */
export type BattleEquipData = {
    attributeBlackboard: Blackboard,
    equipLevel: number,
    parts: EquipPart[],
    tokenAttributeBlackboard: Dict<Blackboard>
};

/** 模组词条 */
export type EquipPart = {
    addOrOverrideTalentDataBundle?: EquipTalent[],
    isToken: boolean,
    overrideTraitDataBundle?: EquipTrait[],
    resKey: string,
    target: string,
    validInGameTag?: string
};

/** 模组的 overrideTraitDataBundle */
export type EquipTrait = {
    additionalDescription?: string,
    overrideDescripton?: string,    // yj手癌
    blackboard: Blackboard,    
    prefabKey?: string,
    rangeId?: string,
    requiredPotentialRank: number,
    unlockCondition: UnlockCondition
};

/** 模组的 addOrOverrideTalentDataBundle */
export type EquipTalent = {
    blackboard: Blackboard,
    description?: string,
    displayRangeId: boolean,
    isHideTalent: boolean,
    name: string,
    prefabKey: string,
    rangeId?: string,
    requiredPotentialRank: number,
    talentIndex: number,
    tokenKey?: string,
    unlockCondition: UnlockCondition,
    upgradeDescription: string
};

/** skill_table.json数据 */
export type SkillData = {
    blackboard: Blackboard,
    description: string,
    duration: number,
    durationType: string,
    name: string,
    prefabId: string,
    rangeId?: string,
    skillType: string,
    spData: SkillSpData
};

/** 技力信息 */
export type SkillSpData = {
    increment: number,
    initSp: number,
    levelUpCost?: string,
    maxChargeTime: number,
    spCost: number,
    spType: string
};

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
    potentialRank: number,
    favor: number
};

export type EquipInfo = {
    equipId: string,
    level: number
};

export type SkillInfo = {
    skillId: string,
    level: number
};

export type AkBuff = {
    /** Buff名 */
    name: string,
    /** 描述 */
    description: string,
    /** 原始面板 */
    blackboard: Blackboard,
    /** 面板到属性词条的映射关系和乘区 */
    mapping: Dict<BuffMapping?>,
    /** 持续时间(秒) */
    duration: number,
    /** 优先级，同一乘区内越大越先结算 */    
    priority: number,
    /** 目标：角色，召唤物或敌人 */
    target: string,
    /** 来源信息 */
    source: BuffSource
};

export type BuffMapping = {
    /** 映射到属性的哪个key上 */
    key: string,
    /** 乘区 */
    zone: string,
    /** 算法 */
    formula: string
};

export type BuffSource = {
    type: string,
    id: string,
    name: string,
    level?: number  
};

