// CodeEditor.js
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import './App.css';
function CodeEditor({ code, onCodeChange }) {
  return (
    <CodeMirror className='code-editor'
      onChange={onCodeChange}
      value={code}
      options={{
        mode: 'python',
      }}
      basicSetup={{
        foldGutter: false,
        dropCursor: true,
        allowMultipleSelections: false,
        indentOnInput: false,
        bracketMatching: true,
        autocompletion: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        history: true,
      }}
      extensions={[langs.python()]}
    />
  );
}

export default CodeEditor;
