import { useSelector, useDispatch } from "react-redux";
import { selectActiveLayerNodes, selectAllActiveIds } from "@/features/editor/selectors";
import { InspectorProperty } from "./types";
import TableProperty from "./TableProperty";

import "./element-inspector.css";

const ElementInspector = () => {
    const nodes = useSelector(selectActiveLayerNodes);
    const { activeNodeId } = useSelector(selectAllActiveIds);

    const node = nodes.find((node) => node.id == activeNodeId);

    const dispatch = useDispatch();

    return (
        <div className="element-inspector-container">
            <div className="element-inspector">
                {node && (
                    <table>
                        <thead className="visually-hidden">
                            <tr>
                                <th>Property</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(node).map(([prop, value]) => (
                                <TableProperty key={prop} prop={prop} value={value} node={node} />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ElementInspector;
