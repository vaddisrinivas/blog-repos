from app import db


class Team(db.Model):
    __tablename__ = 'teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    domains = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.now())  # Timestamp for team creation
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())  # Timestamp for team update
    # Add other fields as needed


class File(db.Model):
    __tablename__ = 'files'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    file_name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    upload_date = db.Column(db.DateTime, nullable=False, default=db.func.now())  # Timestamp for file upload
    domain = db.Column(db.String(50), nullable=False)
    file_size = db.Column(db.String(20))
    file_description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())  # Timestamp for file update
    # Add other fields as needed


class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    project_code = db.Column(db.String(50), unique=True, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    name = db.Column(db.String(255))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=db.func.now())  # Timestamp for project creation
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())  # Timestamp for project update
    # Add other fields as needed
