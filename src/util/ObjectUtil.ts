/**
 * Utility class for objects
 */
export default class ObjectUtil {
    /**
     * Shallow merges `other` into `target`
     * @param target {Object} target object to merge into
     * @param other {Object} object to merge into `target`
     * @param replaceEmpty {boolean} whether to replace empty values (null, undefined) in `target` with values in `other`
     * @returns {T}
     */
    public static merge<T extends {} = any>(target: T, other: any, replaceEmpty?: boolean): T {
        for (const [key, value] of Object.entries(other)) {
            if (!(key in target) || ((typeof (<any>target)[key] === "undefined" || (<any>target)[key] === "null") && replaceEmpty)) {
                (<any>target)[key] = value;
            }
        }

        return target;
    }

    /**
     * Deep merges `other` into `target`
     * @param target {Object} target object to merge into
     * @param other {Object} object to merge into `target`
     * @param replaceEmpty {boolean} whether to replace empty values (null, undefined) in `target` with values in `other`
     * @returns {T}
     */
    public static deepMerge<T extends {} = any>(target: T, other: any, replaceEmpty?: boolean): T {
        for (const [key, value] of Object.entries(other)) {
            if (!(key in target) || ((typeof (<any>target)[key] === "undefined" || (<any>target)[key] === "null") && replaceEmpty)) {
                if (typeof value === "object" && !(target instanceof Array)) {
                    (<any>target)[key] = this.deepMerge({}, value);
                } else {
                    (<any>target)[key] = value;
                }
            } else {
                if (typeof value === "object" && !(target instanceof Array)) {
                    (<any>target)[key] = this.deepMerge((<any>target)[key], value);
                }
            }
        }

        return target;
    }
}