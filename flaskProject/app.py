from flask import Flask, request, jsonify
from sqlalchemy.exc import IntegrityError
import configparser
import logging
import os
from flask_sqlalchemy import SQLAlchemy
from pprint import pprint
from models import File, Project, Team, db
# from flask_restplus import Api, Resource

config_file = f"config_{os.getenv('env',default='dev')}.cfg"
config = configparser.ConfigParser()
config.read(config_file)
logging_levels = {0:logging.FATAL,1:logging.ERROR,2:logging.WARN,3:logging.CRITICAL,4:logging.INFO,5:logging.DEBUG}
logging.basicConfig(filename=config.get("app","log_file"), level=logging_levels[config.getint("app","log_level")],
                    format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.get("app","db_uri")
db.init_app(app)
session = db.session

@app.route('/teams', methods=['POST'])
def create_team():
    data = request.json
    try:
        team = Team(**data)
        db.session.add(team)
        db.session.commit()
        return jsonify(team.serialize()), 201
    except IntegrityError:
        db.session.rollback()
        return "Team with the same name or domains already exists.", 409

# List all teams
@app.route('/teams', methods=['GET'])
def list_teams():
    teams = Team.query.all()
    return jsonify([team.serialize() for team in teams])

# Get a specific team by ID
@app.route('/teams/<int:team_id>', methods=['GET'])
def get_team(team_id):
    team = Team.query.get(team_id)
    if team is not None:
        return jsonify(team.serialize())
    else:
        return "Team not found", 404

# Update a team by ID
@app.route('/teams/<int:team_id>', methods=['PUT'])
def update_team(team_id):
    team = Team.query.get(team_id)
    if team is not None:
        data = request.json
        for key, value in data.items():
            setattr(team, key, value)
        db.session.commit()
        return jsonify(team.serialize())
    else:
        return "Team not found", 404

# Delete a team by ID
@app.route('/teams/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    team = Team.query.get(team_id)
    if team is not None:
        db.session.delete(team)
        db.session.commit()
        return "", 204
    else:
        return "Team not found", 404

# Create a new File
@app.route('/files', methods=['POST'])
def create_file():
    try:
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
            return f.id, 201
    except IntegrityError:
        db.session.rollback()
        return "File with the same name already exists in the project.", 409

# List all files
@app.route('/files', methods=['GET'])
def list_files():
    files = File.query.all()
    return jsonify([file.serialize() for file in files])

# Get a specific file by ID
@app.route('/files/<int:file_id>', methods=['GET'])
def get_file(file_id):
    file = File.query.get(file_id)
    if file is not None:
        return jsonify(file.serialize())
    else:
        return "File not found", 404

# Update a file by ID
@app.route('/files/<int:file_id>', methods=['PUT'])
def update_file(file_id):
    file = File.query.get(file_id)
    if file is not None:
        data = request.json
        for key, value in data.items():
            setattr(file, key, value)
        db.session.commit()
        return jsonify(file.serialize())
    else:
        return "File not found", 404

# Delete a file by ID
@app.route('/files/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    file = File.query.get(file_id)
    if file is not None:
        db.session.delete(file)
        db.session.commit()
        return "", 204
    else:
        return "File not found", 404

# Create a new Project
@app.route('/projects', methods=['POST'])
def create_project():
    data = request.json
    project = Project(**data)
    db.session.add(project)
    db.session.commit()
    return jsonify(project.serialize()), 201

# List all projects
@app.route('/projects', methods=['GET'])
def list_projects():
    projects = Project.query.all()
    return jsonify([project.serialize() for project in projects])

# Get a specific project by ID
@app.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get(project_id)
    if project is not None:
        return jsonify(project.serialize())
    else:
        return "Project not found", 404

# Update a project by ID
@app.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get(project_id)
    if project is not None:
        data = request.json
        for key, value in data.items():
            setattr(project, key, value)
        db.session.commit()
        return jsonify(project.serialize())
    else:
        return "Project not found", 404

# Delete a project by ID
@app.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get(project_id)
    if project is not None:
        db.session.delete(project)
        db.session.commit()
        return "", 204
    else:
        return "Project not found", 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host=config.get("app","host"),port=config.getint("app","port"),debug=config.getboolean("app","debug"))