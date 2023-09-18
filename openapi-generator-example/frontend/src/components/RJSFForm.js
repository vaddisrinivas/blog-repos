import React from 'react';
import { Button } from '@mui/material';
import { Form } from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';

export default function RSJFForm({schema,formData,uiSchema, onSubmit, readonly,noValidate}) {
    return (<Form
                schema={schema}
                formData={formData}
                liveValidate
                validator={validator}
                uiSchema={uiSchema}
                onSubmit={(formData, e) => {console.log("submitting",formData.formData);onSubmit(formData.formData)}}
                readonly={readonly}
                noValidate={noValidate}
      >
        <Button type="submit">Submit</Button>
      </Form>)
}