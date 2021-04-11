export function formatValue(value: object) {
    if (typeof value === 'undefined') {
        return '';
    }
    if (Number.isInteger(value)) {
        return value;
    }
    if (typeof value === 'number') {
        return (value as number).toFixed(2);
    }
    if (typeof value === 'object' && typeof Array.isArray(value)) {
        let array = value as Array<object>;
        if (array.length > 0 && typeof array[0] === 'number') {
            array = (array.map((element) => ((element as unknown) as number).toFixed(2)) as unknown) as Array<object>;
        }
        return '[' + array.join(', ') + ']';
    }
    return value;
}
