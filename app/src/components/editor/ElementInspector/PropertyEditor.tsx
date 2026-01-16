import { AnyNodeItem } from "@/features/editor/types";
import { InspectorProperty } from "./types";

interface PropertyEditorProps {
    key: string;
    value: any;
    // onChange: (id: string, value: any) => void;
}

const PropertyEditor = ({ key, value }: PropertyEditorProps) => {
    // const id = `prop-${prop.id}`;

    return <></>;

    // switch (prop.type) {
    //     case "string":
    //         return (
    //             <div>
    //                 <label htmlFor={id}>{prop.name}</label>
    //                 <input id={id} value={prop.value ?? ""} onChange={(e) => onChange(prop.id, e.target.value)} />
    //             </div>
    //         );
    // }
};

export default PropertyEditor;
