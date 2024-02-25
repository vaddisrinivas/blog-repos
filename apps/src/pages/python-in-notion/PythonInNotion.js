import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { decompressFromEncodedURIComponent, compressToEncodedURIComponent } from 'lz-string';
import 'prismjs/themes/prism.css';
import CodeEditor from './CodeEditor'; // Ensure you have this component
import OutputDisplay from './OutputDisplay'; // Ensure you have this component
import Snackbar from '@mui/material/Snackbar';

const runScript = async () => {
  const pyodide = await window.loadPyodide();
  return pyodide;
};

export default function PythonInNotion() {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('m')){

  }
  const hasOutput = searchParams.get('o') !== undefined ? searchParams.get('o') : '';
  const hasCode = searchParams.get('c') !== undefined ? searchParams.get('c') : '';
  const needsPython = searchParams.get('p') !== undefined;
  const [generateLink, setGenerateLink] = useState(false);

  const isIframe = window.location !== window.parent.location;
  const [runPython, setRunsPython] = useState(false);
  const [code, setCode] = useState(
    hasCode ? decompressFromEncodedURIComponent(hasCode) : `def hello():\n    return "Hello world"\nhello()`
  );
  const [codeOutput, setCodeOutput] = useState(
    hasOutput ? decompressFromEncodedURIComponent(hasOutput) : ''
  );
  const [pyodide, setPyodide] = useState(null);
  const [touched, setTouched] = useState(false);
  const label = 'Make it runnable when shared';

  useEffect(() => {
    async function main() {
      if (needsPython && !pyodide) {
        const loadedPyodide = await runScript();
        setPyodide(loadedPyodide);
        setTouched(true);
      }
    }
    main();
  }, [needsPython, pyodide]);

  const handleChangePy = () => {
    setRunsPython(!runPython);
  };

  function extractPackages(code) {
    const regex = /^(?:import|from) (\S+)(?: import \S+)?/gm;
    let match;
    const packages = new Set();
    while ((match = regex.exec(code)) !== null) {
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      packages.add(match[1].split('.')[0]);
    }
    return Array.from(packages);
  }

  const adaptiveCompress = (input) => {
    let compressed = compressToEncodedURIComponent(input);
    let count = 1;
    while (true) {
      const furtherCompressed = compressToEncodedURIComponent(compressed);
      if (furtherCompressed.length < compressed.length * 0.9) {
        compressed = furtherCompressed;
        count++;
      } else {
        break;
      }
    }
    return { compressed, count };
  };

  const generate = (code, codeOutput) => {
    const { compressed: compressedCode, count: codeCompressionCount } = adaptiveCompress(code);
    const { compressed: compressedOutput, count: outputCompressionCount } = adaptiveCompress(codeOutput);
    const urlParams = [
      `c=${compressedCode}`,
      `o=${compressedOutput}`,
      `cc=${codeCompressionCount}`,
      `oc=${outputCompressionCount}`,
      runPython ? 'p' : '',
    ];
    return '?' + urlParams.join('&');
  };

  const setOp = async () => {
    if (!pyodide) return;

    const originalConsoleLog = console.log;
    let capturedLogs = '';
    const neededPackages = extractPackages(code);
    for (const pkg of neededPackages) {
      try {
        await pyodide.loadPackage(pkg);
      } catch (error) {
        console.error(`Error loading package ${pkg}:`, error);
      }
    }

    console.log = (...args) => {
      capturedLogs += args.join(' ') + '\n';
      originalConsoleLog.apply(console, args);
    };

    try {
      setCodeOutput('');
      const op = await pyodide.runPython(code);
      const additionalOutput = op!==undefined ? op.toString() : '';
      setCodeOutput(capturedLogs + additionalOutput);
    } catch (error) {
      console.error(error);
      setCodeOutput(prev => prev + '\nError: ' + error.toString());
    } finally {
      console.log = originalConsoleLog;
    }
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
          Python in your browser!
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
        <CodeEditor code={code} onCodeChange={setCode} />
        <br></br>
        {needsPython && touched && (
          <Button variant="text" onClick={setOp}>
            Run!
          </Button>
        )}
        <br></br>
        {codeOutput !== undefined && (
          <OutputDisplay codeOutput={codeOutput} />
        )}
        {!isIframe && (
          <>
            <br></br>
            <FormControlLabel
              control={<Checkbox checked={runPython} onChange={handleChangePy} name="antoine" />}
              label={label}
            />
          </>
        )}
        <br></br>
        {!isIframe && (
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.href + '/'+
                  generate(code, codeOutput)
              );
              setGenerateLink(true);
            }}
          >
            Get Link!
          </Button>
        )}
        <Snackbar
          open={generateLink}
          autoHideDuration={6000}
          onClose={() => {
            setGenerateLink(false);
          }}
          message="Link generated and copied to clipboard"
        />
      </div>
    </>
  );
}
