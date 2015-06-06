from sqlalchemy import func
from app import db
from models import Result

# app = Flask(__name__)
# app.config.from_object(os.environ['APP_SETTINGS'])
# db = SQLAlchemy(app)


def get_closest(lat_user,lng_user):
    #Calculating each company's distance from Amsterdam.
    loc_user = func.ll_to_earth(lat_user, lng_user)
    loc_place = func.ll_to_earth(Result.lat, Result.lng)
    distance_func = func.earth_distance(loc_user, loc_place)
    query = db.session.query(Result, distance_func).filter(Result.rank==1).order_by(distance_func).limit(5) 
    
    #Resultset is no longer list of Company, but a list of tuples.
    result = query.all()
    return result
    # mapped = []                                                                                                                  
    # for row in result:
    #     company = row[0] 
    #     company.distance = row[1]
    #     mapped.append(company)
    # return mapped

a=get_closest(43.7082,-79.3431)