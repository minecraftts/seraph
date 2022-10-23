/**
 * Utility class for objects
 */
export default class ObjectUtil {
    /**
     * Shallow merges `other` into `target`
     * @param target {Object} target object to merge into
     * @param other {Object} object to merge into `target`
     * @returns {T}
     */
    public static merge<T extends {} = any>(target: T, other: any): T {
        for (const [key, value] of Object.entries(other)) {
            if (!(key in target)) {
                (<any>target)[key] = value;
            }
        }

        return target;
    }

    /**
     * Deep merges `other` into `target`
     * @param target {Object} target object to merge into
     * @param other {Object} object to merge into `target`
     * @returns {T}
     */
    public static deepMerge<T extends {} = any>(target: T, other: any): T {
        for (const [key, value] of Object.entries(other)) {
            if (!(key in target)) {
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