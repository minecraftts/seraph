export default interface IDeletable {
    deleted: boolean;

    delete(): void;
}