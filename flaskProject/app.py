from flask import Flask, request
import configparser
import logging
import os
from flask_sqlalchemy import SQLAlchemy
from pprint import pprint
config_file = f"config_{os.getenv('env',default='dev')}.cfg"
config = configparser.ConfigParser()
config.read(config_file)
logging_levels = {0:logging.FATAL,1:logging.ERROR,2:logging.WARN,3:logging.CRITICAL,4:logging.INFO,5:logging.DEBUG}
logging.basicConfig(filename=config.get("app","log_file"), level=logging_levels[config.getint("app","log_level")],
                    format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.get("app","db_uri")
db = SQLAlchemy(app)
session = db.session
class File(db.Model):
    __tablename__ = 'files'
    id = db.Column(db.String(36), primary_key=True)
    content = db.Column(db.String(255), nullable=False)


@app.route('/api/upload', methods=['POST',"GET"])
def get_projects():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return "No file part"
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            return "No selected file"
        if file:
            f = File(id=file.filename,content=file.read())
            session.add(f)
            db.session.commit()
            return f.id
    elif request.method == 'GET':
        f = File.query.filter_by(id=request.args.get('id')).first()
        return f.content
        # return "done"
    

@app.route('/api/differences', methods=['GET', "POST"])
def get_project_files():
    if request.method == 'GET':
        return "Hello World!"
    elif request.method == 'POST':
        return "Hello World!"
    pprint(request.__dict__)
    return "Hello World!"


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host=config.get("app","host"),port=config.getint("app","port"),debug=config.getboolean("app","debug"))