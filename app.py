# from flask import Flask, render_template
# from flask.ext.sqlalchemy import SQLAlchemy
# import os

# app = Flask(__name__)
# app.config.from_object(os.environ['APP_SETTINGS'])
# db = SQLAlchemy(app)

# from models import Result


# @app.route('/', methods=['GET'])
# def index():
#     return render_template('index.html')

# if __name__ == '__main__':
#     app.run()

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import os


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
db = SQLAlchemy(app)

from models import Result


@app.route('/')
def hello():
    return "Hello World!"


@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)


if __name__ == '__main__':
    app.run()