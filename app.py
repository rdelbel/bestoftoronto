from flask import Flask, render_template, request, jsonify
from sqlalchemy import func
from flask.ext.sqlalchemy import SQLAlchemy
import os
import requests
import json
# from models import Result
from database import db
from models import Result
# from models import *

app = Flask(__name__)
db.init_app(app)

app.config.from_object(os.environ['APP_SETTINGS'])

# from models import Result


def get_closest(lat_user,lng_user):
    #Calculating each company's distance from Amsterdam.
    loc_user = func.ll_to_earth(lat_user, lng_user)
    loc_place = func.ll_to_earth(Result.lat, Result.lng)
    distance_func = func.earth_distance(loc_user, loc_place)
    query = db.session.query(Result, distance_func).filter(Result.rank==1).order_by(distance_func).limit(5) 
    #Resultset is no longer list of Company, but a list of tuples.
    result = query.all()
    return result


def row2dict(row):
    d = {}
    for column in row.__table__.columns:
    	if str(column.type)!='JSON':
        	d[column.name] = str(getattr(row, column.name))
        else:
        	d[column.name] = getattr(row, column.name)
    return d

def result2dict(row):
	result=row2dict(row[0])
	result['distance']=row[1]
	return result

@app.route('/', methods=['GET','POST'])
def index():

	
	if request.method=="POST":
		data = json.loads(request.data)
		# do your query
		# import pdb; pdb.set_trace()
		results=get_closest(data['lat'],data['lon'])
		results=[result2dict(result) for result in results]
		results=jsonify(json_list=results)
		return results
		


		


		#return flask.jsonify()
	else:   
		return render_template('index.html')

if __name__ == '__main__':
    app.run()