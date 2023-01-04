export interface IComponent extends Record<string, boolean | number | string | [] | object> {
    type: string;
}