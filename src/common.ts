
function fmtNumber(x: number, precision?: number): string {
    let r = precision ? x.toFixed(precision) : Math.round(x).toString();
    return x>0 ? `+${r}` : r;
}

export const Common = {
    fmtNumber
};
