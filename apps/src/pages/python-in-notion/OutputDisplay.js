// OutputDisplay.js
import React from 'react';
import Typography from '@mui/material/Typography';
import Image from '@mui/material/ImageListItem';
function OutputDisplay({ codeOutput }) {
  const hasImage = codeOutput !== undefined && codeOutput.toString().includes('data:image');

  return (
    <>
      <Typography variant="h6">Output: </Typography>
      <br></br>
      {hasImage && (
        <div>
          <Image src={codeOutput} alt="output" />
        </div>
      )}
      {!hasImage && (
        <div>
        <pre>
          <code className="language-python">
            {codeOutput !== undefined ? codeOutput.toString() : 'Error: Check console output for more details'}
          </code>
        </pre>
      </div>
      )}
      <br></br>
    </>
  );
}

export default OutputDisplay;
