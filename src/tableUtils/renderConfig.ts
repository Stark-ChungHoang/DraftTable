import { EditorState } from 'draft-js';
import { Table } from './components/Table';
import { TABLETYPE } from '../constant';
import TableTest from './Table/Table';
import {
  editColumn,
  editCell,
  removeRow,
  addRow,
  addColumn,
  removeColumn,
} from './editTable';
export const blockRenderMap = {
  unstyled: {
    element: 'div',
  },
  table: {
    element: 'div',
  },
};


export const getBlockRendererFn = (editor:EditorState, getEditorState:any, setEditorState:any,setReadOnly:(e:boolean)=>void) => (block:any) => {
 
try {
  const contentState = getEditorState().getCurrentContent();

  const entity = contentState.getEntity(block.getEntityAt(0));
  if (!entity) {
    return null;
  }
  const type = entity.getType();
          const { columns, rows } = entity.getData();
          if (type === TABLETYPE) {
            return {
              component: TableTest,
              editable: true,
              props: {
                columns,
                rows,
                getEditorState,
                setEditorState,
                setReadOnly,
                editColumn,
                editCell,
                addColumn,
                removeColumn,
                removeRow,
                addRow,
              },
            };
          }
}
catch(e){
return null
  
}
};
