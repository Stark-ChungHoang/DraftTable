import { useCallback, useEffect, useRef,useState } from "react";
import { Editor, SyntheticKeyboardEvent } from "react-draft-wysiwyg";
import {
  AtomicBlockUtils,
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
import { TABLETYPE } from "./constant";


const customBlockRenderMap = Map(blockRenderMap);
const extendedBlockRenderMap =
  DefaultDraftBlockRenderMap.merge(customBlockRenderMap);

function App() {
  const editor = useRef(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [readOnly,setReadOnly] = useState(false)

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
    const contentState = editorState.getCurrentContent();

    const columnsMapped = Array.from({ length: size.cols }).map((_, i) => ({
      key: `Column${i}`,
      value: `Column ${i + 1}`,
    }));
  
    const rowsMapped = Array.from({ length: size.rows }).map((_, i) => ({
      key: `Row${i}`,
      value: Array.from({ length: size.cols }).map((__, j) => ({
        key: `Row${i}Cell${j}`,
        value: `Cell ${j}`,
      })),
    }));
  
    const contentStateWithEntity = contentState.createEntity(
     TABLETYPE,
      'IMMUTABLE',
      { columns: columnsMapped, rows: rowsMapped }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
   
    const res = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    onChange(res)
      
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
  const getEditorState = () => {
    return editorState;
  };
  const blockRendererFn = getBlockRendererFn(editor?.current!, getEditorState, onChange,setReadOnly);
  useEffect(() => {
    console.log("read",readOnly)
  },[readOnly])
  return (
    <Editor
      ref={editor}
      //@ts-ignore
      
      blockRendererFn={blockRendererFn}
      readOnly={readOnly}
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
