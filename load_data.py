from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import json
import os

#################
# configuration #
#################

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
db = SQLAlchemy(app)

from models import Result

with open('static/data.json') as f:
	text=f.read()
data=json.loads(text)
for row in data:
	lng= row['longitude']
	lat= row['latitude']
	rank= row['number']
	del row['longitude']
	del row['latitude']
	del row['number']
	result=row
	try:
		newresult = Result(
		lat=lat,
		lng=lng,
		rank=rank,
		result=result
		)
		db.session.add(newresult)
		db.session.commit()
	except:
		print "Unable to add item to database."

