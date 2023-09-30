import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { decompressFromEncodedURIComponent, compressToEncodedURIComponent } from 'lz-string';
import 'prismjs/themes/prism.css';
import CodeEditor from './CodeEditor';
import OutputDisplay from './OutputDisplay';
import Snackbar from '@mui/material/Snackbar';
const runScript = async () => {
  const pyodide = await window.loadPyodide();
  return pyodide;
};

export default function Home() {
  const searchParams = new URLSearchParams(window.location.search);
  // console.log(searchParams.toString());
  const hasOutput = searchParams.get('o')!== undefined ? searchParams.get('o') : '';
  const hasCode = searchParams.get('c') !==  undefined? searchParams.get('c') : '';
  const needsPython = searchParams.get('p') !== undefined? true : false;
  const [generateLink, setGenerateLink] = useState(false);

  const isIframe = window.location !== window.parent.location;
  const [runPython, setRunsPython] = useState(false);
  console.log(hasCode, hasOutput, needsPython,generateLink,isIframe,runPython);
  const [code, setCode] = useState(
    hasCode !==null
      ? decompressFromEncodedURIComponent(hasCode)
      : `def hello(): \n return "Hello world"\nhello()`
  );
  const [codeOutput, setCodeOutput] = useState(
    hasOutput !==null ? decompressFromEncodedURIComponent(searchParams.get('o')) : ''
  );
  const [pyodide, setPyodide] = useState('');
  const [touched, setTouched] = useState(false);
  const label = 'Make it runnable when shared';
  const setOp = () => {
    try {
      const op = pyodide.runPython(code);
      // console.log(op);
      setCodeOutput(op);
    } catch (error) {
      console.error(error);
      // console.log('Error evaluating Python code. See console for details.' + error);
      setCodeOutput(error);
    }
  };
  useEffect(() => {
    if (pyodide !== '' && !touched) {
      setTouched(true);
    }
    async function main() {
      if (needsPython && pyodide === '') {
        setPyodide(await runScript());
        localStorage.setItem('loadPyodide', true);
      }
    }
    main();
  }, [pyodide]);

  const handleChangePy = async () => {
    setRunsPython(!runPython);
  };

  const generate = (code, codeOutput) => {
    // console.log('clicked generate link');
    // console.log(code);
    // console.log(codeOutput);
    const c = compressToEncodedURIComponent(code.toString());
    const o = compressToEncodedURIComponent(codeOutput.toString());
    // console.log(decompressFromEncodedURIComponent(c));
    // console.log(decompressFromEncodedURIComponent(o));
    const urlParams = [
      `c=${c}`,
      `o=${o}`,
      runPython ? 'p' : '',
    ];
    // console.log(urlParams.join('&'));
    return '?' + urlParams.join('&');
  };

  return (
    <>
      {!isIframe && (
        <Typography
          style={{
            textAlign: 'center',
            width: '70%',
            paddingLeft: '5%',
            marginLeft: '10%',
            paddingRight: '5%',
            marginRight: '10%',
            paddingTop: '2%',
            marginTop: '3%',
          }}
          variant="h3"
        >
          {isIframe ? '' : 'Python in your browser!'}
        </Typography>
      ) || (
        <Typography
          style={{
            textAlign: 'center',
            width: '70%',
            paddingLeft: '5%',
            marginLeft: '10%',
            paddingRight: '5%',
            marginRight: '10%',
            paddingTop: '2%',
            marginTop: '3%',
          }}
          variant="h6"
        >
          Run Python in an iFrame
        </Typography>
      )}
      <div
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          width: '70%',
          paddingLeft: '5%',
          marginLeft: '10%',
          paddingRight: '5%',
          marginRight: '10%',
          paddingTop: '2%',
          marginTop: '3%',
          paddingBottom: '2%',
          marginBottom: '3%',
          overflowY: 'auto',
        }}
      >
        <Collapse in={needsPython && !touched}>
          <Alert sx={{ mb: 2 }}>Pyodide is loading</Alert>
        </Collapse>
        <br></br>
        <Typography variant="h6">Snippet : </Typography>
        <br></br>
        <br></br>
        <CodeEditor code={code} onCodeChange={setCode} />

        <br></br>
        {needsPython && touched && (
          <Button variant="text" onClick={setOp}>
            Run!
          </Button>
        )}
        <br></br>
        
        <div>
          {codeOutput !== undefined && !codeOutput.toString().includes('data:image/png') && (
            <OutputDisplay codeOutput={codeOutput} />
          )}
        </div>
        <br></br>
        <br></br>
        <FormControlLabel
          control={<Checkbox checked={runPython} onChange={handleChangePy} name="antoine" />}
          label={label}
        />
        <br></br>
        {needsPython && (
          <Button
            onClick={() => { navigator.clipboard.writeText(window.location.protocol + "//" + window.location.host + "/" + generate(code,codeOutput)); setGenerateLink(true); }}
          >
            Get Link!
          </Button>
        )}
        <Snackbar open={generateLink} autoHideDuration={6000} onClose={()=>{setGenerateLink(false)}} message="Link generated and copied to clipboard"/>
      </div>
    </>
  );
}
