import os
import sqlite3
from flask import Flask, request, g, render_template
from werkzeug.utils import secure_filename

DATABASE = '/mnt/files/data.db'
UPLOAD_FOLDER = '/mnt/files'
PASSWORD = '123'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def add_file_to_db(filename, url):
    db = get_db()
    db.execute('INSERT INTO files (file_name, file_path) VALUES (?, ?)',
                (filename, url))
    db.commit()

@app.route('/upload', methods=['POST'])
def upload_url():
    password = request.form.get('password')
    if password != PASSWORD:
        return 'Unauthorized', 401

    url = request.form.get('url')
    if not url:
        return 'No URL provided', 400

    add_file_to_db('Uploaded image', url)
    return url, 200

@app.route('/')
def gallery():
    return render_template('gallery.html')

if __name__ == "__main__":
    with app.app_context():
        db = get_db()
        db.execute('CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, file_name TEXT NOT NULL, file_path TEXT NOT NULL)')
        db.commit()
    app.run(host='0.0.0.0', debug=True)
