import { FramePair, AttrFrame } from "./akdataset";

export function interpolateAttr([first, last]: FramePair, level: number): AttrFrame {
    var rate = (level - first.level) / (last.level - first.level);
    var ret = {} as AttrFrame;
    for (const key in first) {
        const k = key as keyof AttrFrame;   // type annotation
        ret[k] = first[k] * (1-rate) + last[k] * rate;
    }
    return ret;
}