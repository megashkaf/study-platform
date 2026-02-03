import { AnyNodeItem } from "@/features/editor/types";
import { InspectorProperty } from "./types";
import { useEffect } from "react";

interface TablePropertyProps {
    prop: string;
    value: any;
    // onChange: (id: string, value: any) => void;
}

const TableProperty = ({ prop, value }: TablePropertyProps) => {
    let content: JSX.Element;

    useEffect(() => {
        console.log(prop, value);
    }, []);

    switch (prop) {
        case "id":
        case "type":
            return (
                <tr>
                    <th>{prop}</th>
                    <td>{value}</td>
                </tr>
            );
        case "transform":
            return (
                <>
                    <tr>
                        <th>position</th>
                        <td>
                            {value.x}, {value.y}
                        </td>
                    </tr>
                    <tr>
                        <th>rotation</th>
                        <td>{value.rotation}</td>
                    </tr>
                    <tr>
                        <th>scale</th>
                        <td>
                            {value.width}, {value.height}
                        </td>
                    </tr>
                    <tr>
                        <th>isLocked</th>
                        <td>{String(value.isLocked)}</td>
                    </tr>
                </>
            );
        default:
            return;
    }
};

export default TableProperty;
