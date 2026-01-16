export type PropertyType = "string" | "number" | "boolean" | "enum" | "color" | "json";
export interface InspectorProperty {
    id: string;
    name: string;
    type: PropType;
    value: any;
    options?: string[]; // для enum
    group?: string;
    readonly?: boolean;
}
