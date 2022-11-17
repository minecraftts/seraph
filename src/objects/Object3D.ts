import EventEmitter from "events";
import { vec3 } from "gl-matrix";

export default abstract class Object3D<Events extends {[key: string]: (...args: any) => void} = {}> extends (EventEmitter as new () => any) {
    protected position: vec3;
    protected rotation: vec3;

    protected transformDirty: boolean;

    constructor() {
        super();

        this.position = vec3.create();
        this.rotation = vec3.create();

        this.transformDirty = false;
    }

    public setPosition(x: number, y: number = 0, z: number = 0): this {
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;

        this.transformDirty = false;

        return this;
    }

    public setRotation(x: number, y: number = 0, z: number = 0): this {
        this.rotation[0] = x;
        this.rotation[1] = y;
        this.rotation[2] = z;

        this.transformDirty = true;

        return this;
    }

    public move(x: number, y: number = 0, z: number = 0): this {
        this.position[0] += x;
        this.position[1] += y;
        this.position[2] += z;

        this.transformDirty = false;

        return this;
    }

    public rotate(x: number, y: number = 0, z: number = 0): this {
        this.rotation[0] += x;
        this.rotation[1] += y;
        this.rotation[2] += z;

        this.transformDirty = true;

        return this;
    }

    public isTransformDirty(): boolean {
        return this.transformDirty;
    }

    // typings taken from typed-emitter
    public addListener<E extends keyof Events>(event: E, listener: Events[E]): this {
        return super.addListener(<string>event, listener);
    }

    public on<E extends keyof Events>(event: E, listener: Events[E]): this {
        return super.on(<string>event, listener);
    }

    public once<E extends keyof Events> (event: E, listener: Events[E]): this {
        return super.once(<string>event, listener);
    }

    public prependListener<E extends keyof Events> (event: E, listener: Events[E]): this {
        return super.prependListener(event, listener);
    }

    public prependOnceListener<E extends keyof Events> (event: E, listener: Events[E]): this {
        return super.prependOnceListener(event, listener)
    }

    public off<E extends keyof Events>(event: E, listener: Events[E]): this {
        return super.off(event, listener);
    }

    public removeAllListeners<E extends keyof Events> (event?: E): this {
        return super.removeAllListeners(event);
    }

    public removeListener<E extends keyof Events> (event: E, listener: Events[E]): this {
        return super.removeListener(event, listener);
    }

    public emit<E extends keyof Events> (event: E, ...args: Parameters<Events[E]>): boolean {
        return super.emit(event, ...(<any[]>args));
    }

    public eventNames (): (keyof Events | string | symbol)[] {
        return super.eventNames();
    }

    public rawListeners<E extends keyof Events> (event: E): Events[E][] {
        return super.rawListeners(event);
    }

    public listeners<E extends keyof Events> (event: E): Events[E][] {
        return super.listeners(event);
    }

    public listenerCount<E extends keyof Events> (event: E): number {
        return super.listenerCount(event);
    }

    public getMaxListeners (): number {
        return super.getMaxListeners();
    }

    public setMaxListeners (maxListeners: number): this {
        return super.setMaxListeners(maxListeners);
    }
}