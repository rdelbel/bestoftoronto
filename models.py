from app import db
from sqlalchemy.dialects.postgresql import JSON, REAL, INTEGER
from sqlalchemy import func, Index

class Result(db.Model):
    __tablename__ = 'results'

    id = db.Column(db.Integer, primary_key=True)
    lat=db.Column(REAL)
    lng=db.Column(REAL)
    rank=db.Column(INTEGER)
    result = db.Column(JSON)
   
    

    def __init__(self,lat,lng,rank,result):
        self.lat=lat
        self.lng=lng
        self.rank=rank
        self.result=result
       

    def __repr__(self):
        return '<id {}>'.format(self.id)



Index('place_distance', func.ll_to_earth(Result.lat, Result.lng), postgresql_using='gist')