FROM public.ecr.aws/lambda/python:latest
RUN pip install -r requirements.txt
WORKDIR ${LAMBDA_TASK_ROOT}
COPY pynotion.py .
CMD [ "pynotion.main" ]