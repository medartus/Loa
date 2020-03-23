from flask import Flask
from flask_restful import Resource, Api, reqparse

from recommend import getBusinessDf, getMatrix, recommand

# Server initialisation
app = Flask(__name__)
api = Api(app)
parser = reqparse.RequestParser()

# Data initialisation
df_business = getBusinessDf()
(Q,userid_vectorizer) = getMatrix()


class Home(Resource):
    def get(self):
        return {
            "ack": True
        }
    
class Recommend(Resource):
    def post(self):
        parser.add_argument('message', type=str)
        args = parser.parse_args()
        message = args["message"]

        results = recommand(message,Q,userid_vectorizer,df_business)

        return { 
            "data" : {
                "desire": message,
                "results": results
            }
        }




api.add_resource(Recommend, '/v1/recommend')
api.add_resource(Home, '/')

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000)
