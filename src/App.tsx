import { useCallback, useRef,useState } from "react";
import { Editor, SyntheticKeyboardEvent } from "react-draft-wysiwyg";
import {
  ContentBlock,
  ContentState,
  DefaultDraftBlockRenderMap,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
  genKey,
} from "draft-js";
import TableOutlined from "@ant-design/icons/TableOutlined";
import { Dropdown, MenuProps } from "antd";
import { Map } from "immutable";

import TableGrid from "./tableUtils/components/tableGrid";
import { blockRenderMap, getBlockRendererFn } from "./tableUtils/renderConfig";

import "antd/dist/reset.css";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./App.scss";


const customBlockRenderMap = Map(blockRenderMap);
const extendedBlockRenderMap =
  DefaultDraftBlockRenderMap.merge(customBlockRenderMap);

function App() {
  const editor = useRef(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const isTable =
    editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getAnchorKey())
      .getType() === "table";

  const onChange = useCallback((newEditorState: EditorState) => {
    const selection = newEditorState.getSelection();
    let content = newEditorState.getCurrentContent();
    if (
      selection.isCollapsed() &&
      RichUtils.getCurrentBlockType(newEditorState) === "table"
    ) {
      content = Modifier.applyEntity(content, selection, " ");

      const block = content.getBlockForKey(selection.getAnchorKey());

      if (!block.getLength()) {
        content = Modifier.insertText(content, selection, " ");
        newEditorState = EditorState.push(
          newEditorState,
          content,
          "insert-characters"
        );
      }
    }

    setEditorState(newEditorState);
  }, []);

  //insert table
  const insertTable = (size: { cols: number; rows: number }) => {
    let selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      return null;
    }
    // prevent insert a table within a table
    if (
      editorState
        .getCurrentContent()
        .getBlockForKey(selection.getAnchorKey())
        .getType() === "table"
    ) {
      return null;
    }

    const defaultCellStyle = {
      border: "1px solid rgba(0, 0, 0, 0.2)",
      padding: "6px 10px",
      height: 36,
      "text-align": "center",
      background: "#FAFAFA",
    };
    const cols = Array(20).fill(1);
    const tableShape: any = Array(20)
      .fill(cols)
      .map((row) =>
        row.map(() => ({ element: "td", style: { ...defaultCellStyle } }))
      );

    const tableKey = genKey();

    const newBlocks = [];
    tableShape.forEach((row: any, i: number) => {
      row.forEach((cell: any, j: number) => {
        let data = Map({
          tableKey,
          tablePosition: `${tableKey}-${i}-${j}`,
          "text-align": "center",
        });
        if (i === 0 && j === 0) {
          data = data
            .set("tableShape", tableShape)
            .set("tableStyle", {
              "border-collapse": "collapse",
              margin: "15px 0",
            } as any)
            .set("tableSize", { rows: size.rows, cols: size.cols } as any)
            .set("rowStyle", [] as any);
        }
        const newBlock = new ContentBlock({
          key: genKey(),
          type: "table",
          text: " ",
          data,
        });

        newBlocks.push(newBlock);
      });
    });
    const selectionKey = selection.getAnchorKey();
    let contentState = editorState.getCurrentContent();

    contentState = Modifier.splitBlock(contentState, selection);
    const blockArray = contentState.getBlocksAsArray();

    const currBlock = contentState.getBlockForKey(selectionKey);
    const index = blockArray.findIndex((block) => block === currBlock);
    const isEnd = index === blockArray.length - 1;

    if (blockArray[index]?.getType() === "table") {
      newBlocks.unshift(new ContentBlock({ key: genKey() }));
    }

    if (blockArray[index + 1]?.getType() === "table") {
      newBlocks.push(new ContentBlock({ key: genKey() }));
    }
    blockArray.splice(index + 1, 0, ...newBlocks);
    if (isEnd) {
      blockArray.push(new ContentBlock({ key: genKey() }));
    }

    const entityMap = contentState.getEntityMap();

    contentState = ContentState.createFromBlockArray(blockArray, entityMap);

    let newEditorState = EditorState.push(
      editorState,
      contentState,
      "insert-fragment"
    );

    const key = newBlocks[0].getKey();
    selection = SelectionState.createEmpty(key);
    newEditorState = EditorState.acceptSelection(newEditorState, selection);
    onChange(newEditorState);
  };


  const CustomToolbar = () => (
    <div
      style={{
        opacity: isTable ? 0.5 : 1,
        cursor: isTable ? "not-allowed" : "pointer",
        height: "100%",
      }}
      className="rdw-option-wrapper"
    >
      <Dropdown
        disabled={isTable ? true : false}
        menu={{ items }}
        placement="bottom"
        trigger={["click"]}
        arrow
      >
        <div onClick={(e) => e.preventDefault()} className="">
          <TableOutlined />
        </div>
      </Dropdown>
    </div>
  );

  const items: MenuProps["items"] = [
    {
      key: "insertTable",
      label: <TableGrid handleSubmit={insertTable} />,
    },
  ];

  const handleReturn = (
    e: SyntheticKeyboardEvent,
    editorState: EditorState
  ) => {
    //handle enter text
    if (e.shiftKey) {
      const newEditorState = RichUtils.insertSoftNewline(editorState);
      const contentState = Modifier.replaceText(
        newEditorState.getCurrentContent(),
        newEditorState.getSelection(),
        " "
      );
      onChange(
        EditorState.push(newEditorState, contentState, "insert-characters")
      );
      return "handled";
    } else if (RichUtils.getCurrentBlockType(editorState) === "table") {
      onChange(RichUtils.insertSoftNewline(editorState));
      return "handled";
    }
    return "not-handled";
  };

  const blockRendererFn = getBlockRendererFn(editor?.current!);

  return (
    <Editor
      ref={editor}
      //@ts-ignore
      blockRendererFn={blockRendererFn}
      editorState={editorState}
      blockRenderMap={extendedBlockRenderMap}
      spellCheck={true}
      toolbarCustomButtons={[<CustomToolbar />]}
      onEditorStateChange={(editorState) => onChange(editorState)}
      handleReturn={(e, editorState) => handleReturn(e, editorState) as any}
    />
  );
}

export default App;
