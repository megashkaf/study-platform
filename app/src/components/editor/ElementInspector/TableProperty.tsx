import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { actions as editorActions } from "@/features/editor/editorSlice";
import { AnyNodeItem } from "@/features/editor/types";

interface TablePropertyProps {
    prop: string;
    value: any;
    node: AnyNodeItem;
    // onChange: (id: string, value: any) => void;
}

const TableProperty = ({ prop, value, node }: TablePropertyProps) => {
    const [localValue, setLocalValue] = useState(value);
    const dispatch = useDispatch();

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // useEffect(() => {
    //     console.log(prop, value);
    // }, []);

    const handleBlur = () => {
        const updatedNode: AnyNodeItem = {
            ...node,
            [prop]: localValue,
        };
        dispatch(editorActions.updateNode(updatedNode));
    };

    switch (prop) {
        case "id":
        case "type":
            return (
                <tr>
                    <th>{prop}</th>
                    <td>{value}</td>
                </tr>
            );
        case "text":
            return (
                <tr>
                    <th>{prop}</th>
                    <td>
                        <input value={localValue} onChange={(e) => setLocalValue(e.target.value)} onBlur={handleBlur} />
                    </td>
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
