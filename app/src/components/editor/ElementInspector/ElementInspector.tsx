import { useSelector, useDispatch } from "react-redux";
import { selectActiveLayerNodes, selectAllActiveIds } from "@/features/editor/selectors";
import { InspectorProperty } from "./types";
import PropertyEditor from "./PropertyEditor";

import "./element-inspector.css";

const ElementInspector = () => {
    const nodes = useSelector(selectActiveLayerNodes);
    const { activeNodeId } = useSelector(selectAllActiveIds);

    const node = nodes.find((node) => node.id == activeNodeId);

    const dispatch = useDispatch();

    return (
        <div className="element-inspector-container">
            <div className="element-inspector">
                <form aria-label="Element inspector" className="inspector">
                    {node && (
                        <table className="inspector-table">
                            <thead className="visually-hidden">
                                <tr>
                                    <th>Property</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(node).map(([key, value]) => (
                                    <tr key={key}>
                                        <th scope="row">{key}</th>
                                        <td>
                                            <PropertyEditor key={key} value={value} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ElementInspector;
