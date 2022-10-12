import Mesh from "./meshes/Mesh";

export default class Scene {
    private elements: Mesh[] = [];

    constructor() {

    }

    /**
     * Adds mesh `element` to the scene
     * @param element mesh to add
     */
    public add(element: Mesh): void {
        this.elements.push(element);
    }

    /**
     * Removes mesh `element` from the scene
     * @param element mesh to remove
     */
    public remove(element: Mesh): void {
        const index: number = this.elements.findIndex(val => val === element);

        this.elements.splice(index, 1);
    }

    /**
     * @returns a list of all meshes present within the scene
     */
    public getElements(): Mesh[] {
        return this.elements;
    }
}