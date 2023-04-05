import {
  ColumnWidthOutlined,
  DeleteColumnOutlined,
  DeleteRowOutlined,
  InsertRowBelowOutlined,
} from "@ant-design/icons";
import { Dropdown, Tooltip } from "antd";
import { EditorBlock, EditorState } from "draft-js";
import { Map } from "immutable";
import { camelCase } from "lodash";
import { Key, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Editor, SyntheticKeyboardEvent } from "react-draft-wysiwyg";
import "./style.scss";
export const Table = (props: any) => {
  const {
    block,
    blockProps: { editor },
  } = props;
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  if (
    block.getData().get("tablePosition") &&
    !block.getData().get("tableShape")
  ) {
  
    return null;
  }

  const data = block.getData();

  const tableKey = data.get("tableKey");
  const tableSize = data.get("tableSize");
  const dataTableShape = data.get("tableShape");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tableShape, setTableShape] = useState<any>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentCol, setCurrentCol] = useState(tableSize.cols);

  const handleTableShape = (data_: any[]) => {
    const rowTable = data_?.filter(
      (e: any, index: number) => index < data.get("tableSize")?.rows
    );
    let table = [];
    for (let i = 0; i < rowTable.length; i++) {
      let col = rowTable[i];
      const cols = col?.filter(
        (e: any, index: number) => index < data.get("tableSize")?.cols
      );
      table.push(cols);
    }
    setTableShape(table);
    return table;
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    handleTableShape(data.get("tableShape"));
  }, []);

  const tableStyle = Map(data.get("tableStyle"))
    .mapKeys((k) => camelCase(k as any))
    .toJS();

  const colgroup = data.get("tableColgroup");

  const insertColumn = () => {
    let table = [];
    for (let i = 0; i < tableShape.length; i++) {
      const current = dataTableShape[i][currentCol];
      const tableItem = [...tableShape[i], current];
      table.push(tableItem);
    }
    setCurrentCol(currentCol + 1);
    setTableShape(table);
  };

  const deleteColumn = () => {
    let table = [];
    for (let i = 0; i < tableShape.length; i++) {
      const col = tableShape[i].filter(
        (e: any, index: number) => index !== tableShape[i].length - 1
      );
      table.push(col);
    }
    setCurrentCol(currentCol - 1);
    setTableShape(table);
  };
const onChange = (editorState:any) => {
  setEditorState(editorState);
};
  const insertRow = () => {
    const currentRow = tableShape?.length;
    let rowAdded = dataTableShape[currentRow - 1];
    if (!rowAdded) return;
    const row = rowAdded.filter((e: any, index: number) => index < currentCol);

    const table = [...tableShape, row];
    setTableShape(table);
  };
  const deleteRow = () => {
    const currentRow = tableShape.filter(
      (e: any, index: number) => index !== tableShape.length - 1
    );
    setTableShape(currentRow);
  };

  const dataTooltip = [
    {
      title: "Insert Colum",
      icon: <ColumnWidthOutlined />,
      action: insertColumn,
    },
    {
      title: "Insert Row",
      icon: <InsertRowBelowOutlined />,
      action: insertRow,
    },
    {
      title: "Delete Column",
      icon: <DeleteColumnOutlined />,
      action: deleteColumn,
    },
    {
      title: "Delete Row",
      icon: <DeleteRowOutlined />,
      action: deleteRow,
    },
  ];

  const items = [
    {
      label: (
        <div className="label-tooltip-table">
          {dataTooltip.map((item, index) => (
            <Tooltip
              key={index}
              placement="bottom"
              title={item.title}
              arrow={true}
            >
              <div
                className={
                  index === 0 ? "table-tooltip-first" : "table-tooltip"
                }
                onClick={item.action}
              >
                {item.icon}
              </div>
            </Tooltip>
          ))}
        </div>
      ),
      key: "0",
    },
  ];
  if (Array.isArray(tableShape)) {
    return (
      <>
        <Dropdown placement="bottom" trigger={["click"]} arrow menu={{ items }}>
          <table key={tableKey} style={tableStyle} id={tableKey}>
            {colgroup && (
              <colgroup
                dangerouslySetInnerHTML={{ __html: colgroup }}
              ></colgroup>
            )}
            <tbody>
              {!!tableShape &&
                tableShape?.map((row, i) => (
                  <tr key={i}>
                    {row.map(
                      (
                        cell: {
                          style: Immutable.Iterable.Keyed<unknown, unknown>;
                          element: string;
                          colspan: number | undefined;
                          rowspan: number | undefined;
                        },
                        j: Key | null | undefined
                      ) => {
                        const cellStyle = Map(cell.style)
                          .mapKeys((k) => camelCase(k as any))
                          .toJS();
                        if (cell.element === "th") {
                          return (
                            <th
                              key={j}
                              style={cellStyle}
                              colSpan={cell.colspan}
                              rowSpan={cell.rowspan}
                              data-position={`${tableKey}-${i}-${j}`}
                            >
                              {!!(i === 0 && j === 0) && (
                                <EditorBlock {...props} />
                              )}
                            </th>
                          );
                        }
                        return (
                          <td
                            key={j}
                            style={{ ...cellStyle, minWidth: 120 }}
                            colSpan={cell.colspan}
                            rowSpan={cell.rowspan}
                            data-position={`${tableKey}-${i}-${j}`}
                          >
                           <Editor
          editorState={editorState}
          
     
        />
                             
                             
                            
                          </td>
                        );
                      }
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </Dropdown>
      </>
    );
  } else {
    return <EditorBlock {...props} />;
  }
};
