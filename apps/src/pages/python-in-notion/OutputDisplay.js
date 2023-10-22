// OutputDisplay.js
import React from 'react';
import Typography from '@mui/material/Typography';

function OutputDisplay({ codeOutput }) {
  return (
    <>
      <Typography variant="h6">Output: </Typography>
      <br></br>
      <div>
        {/* Display code output here */}
        {/* You can include the code for displaying images if needed */}
        <pre>
          <code className="language-python">
            {codeOutput !== undefined ? codeOutput.toString() : 'Error: Check console output for more details'}
          </code>
        </pre>
      </div>
      <br></br>
    </>
  );
}

export default OutputDisplay;
