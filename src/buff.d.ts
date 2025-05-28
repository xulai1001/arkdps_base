import { Dict, Blackboard } from "./akdataset";

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
