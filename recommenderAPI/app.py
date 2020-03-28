from flask import Flask
from flask_restful import Resource, Api, reqparse

from recommend import getMatrix, recommand

# Server initialisation
app = Flask(__name__)
api = Api(app)
parser = reqparse.RequestParser()

# Data initialisation

(Q, userid_vectorizer) = getMatrix()

class Home(Resource):
    def get(self):
        return {
            "updated": True
        }

class Recommend(Resource):
    def post(self):
        parser.add_argument('message', type=str)
        args = parser.parse_args()
        message = args["message"]

        results = recommand(message, Q, userid_vectorizer)

        return {
            "data": {
                "desire": message,
                "results": results
            }
        }


api.add_resource(Recommend, '/v1/recommend')
api.add_resource(Home, '/')

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
