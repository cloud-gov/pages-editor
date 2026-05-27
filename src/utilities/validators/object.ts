export const isNotEmpty = (obj: any): boolean => {
    if (obj === null || obj === undefined) {
        return false;
    }

    if (typeof obj === 'object') {
        if (obj === null) return false;

        if (obj instanceof Object) {
            return Object.keys(obj).length > 0;
        }
    }

    if (typeof obj === 'string') {
        return obj.trim().length > 0;
    }


    return true;
}