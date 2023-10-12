# apps.members.models
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Team(db.Model):
    __tablename__ = 'teams'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    domains = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.now())  # Timestamp for team creation
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())  # Timestamp for team update
    projects = db.relationship('Project', backref='team', lazy=True)  # Relationship with projects
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'domains': self.domains,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
class File(db.Model):
    __tablename__ = 'files'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    file_name = db.Column(db.String(255), nullable=False, unique=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    upload_date = db.Column(db.DateTime, nullable=False, default=db.func.now())  # Timestamp for file upload
    domain = db.Column(db.String(50), nullable=False)
    file_size = db.Column(db.String(20))
    file_description = db.Column(db.Text)
    file_content = db.Column(db.LargeBinary)  # Changed from db.Text to db.LargeBinary
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())  # Timestamp for file update
    project = db.relationship('Project', backref='files', lazy=True)  # Relationship with project
    def serialize(self):
        return {
            'id': self.id,
            'file_name': self.file_name,
            'project_id': self.project_id,
            'upload_date': self.upload_date,
            'domain': self.domain,
            'file_size': self.file_size,
            'file_description': self.file_description,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
from sqlalchemy import CheckConstraint

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_code = db.Column(db.String(50), unique=True, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    name = db.Column(db.String(255))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=db.func.now())  # Timestamp for project creation
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())  # Timestamp for project update
    __table_args__ = (
        CheckConstraint(start_date <= end_date),  # Check that start_date is before end_date
        CheckConstraint(status.in_(['New', 'In Progress', 'Completed', 'Cancelled'])),  # Check that status is one of the predefined values
    )
    def serialize(self):
        return {
            'id': self.id,
            'project_code': self.project_code,
            'team_id': self.team_id,
            'name': self.name,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
