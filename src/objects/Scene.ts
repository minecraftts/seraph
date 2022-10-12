import Mesh from "./meshes/Mesh";

export default class Scene {
    private elements: Mesh[] = [];

    constructor() {

    }

    public add(element: Mesh): void {
        this.elements.push(element);
    }

    public remove(element: Mesh): void {
        const index: number = this.elements.findIndex(val => val === element);

        this.elements.splice(index, 1);
    }

    public getElements(): Mesh[] {
        return this.elements;
    }
}