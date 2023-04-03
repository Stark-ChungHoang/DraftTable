import { EditorState } from 'draft-js';
import { Table } from './components/Table';

export const blockRenderMap = {
  unstyled: {
    element: 'div',
  },
  table: {
    element: 'div',
  },
};


export const getBlockRendererFn = (editor:EditorState) => (block:any) => {
  const type = block.getType();
  switch (type) {
    case 'table':
      return {
        component: Table,
        editable: true,
        props: {
          editor,
        },
      };
    default:
      return null;
  }
};
