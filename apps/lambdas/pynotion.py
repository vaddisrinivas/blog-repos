import json
import lzstring
import os
import logging

def adaptive_compress(input_string):
    lz = lzstring.LZString()
    compressed = lz.compressToEncodedURIComponent(input_string)
    count = 1
    while True:
        further_compressed = lz.compressToEncodedURIComponent(compressed)
        if len(further_compressed) < len(compressed) * 0.9:
            compressed = further_compressed
            count += 1
        else:
            break
    return compressed, count

def main(payload, context):
    code, code_output, run_python = payload.get('code'), payload.get('output'), payload.get('python', False)
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    compressed_code, code_compression_count = adaptive_compress(code) if code else (None, 0)
    compressed_output, output_compression_count = adaptive_compress(code_output) if code_output else (None, 0)
    url_params = []
    if compressed_code:
        url_params.append(f'c={compressed_code}')
        url_params.append(f'cc={code_compression_count}')
    if compressed_output:
        url_params.append(f'o={compressed_output}')
        url_params.append(f'oc={output_compression_count}')
    if run_python:
        url_params.append('p')
   
    body_string = os.environ.get('APPS_TTC_PY') + '?' + ('&'.join(url_params) if url_params else '')
    logging.info(f"Generated URL: {body_string}")
    return body_string