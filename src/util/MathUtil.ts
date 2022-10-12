export default class MathUtil {
    /**
     * Helper function to convert degrees to radians
     * @param deg degrees
     * @returns radians
     */
    public static degreesToRad(deg: number): number {
        return deg * (Math.PI / 180);
    }
}