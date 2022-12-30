from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def meth():
    print("### headers\n")
    print(request.headers)
    print("\n### args")
    print(request.args)

    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        print("\n### json")
        json = request.get_json()
        print("\ngot")
        print(json)
        return "OK"
    else:
        print("no json")
        return "only json is accepted", 400

if __name__ == '__main__':
   app.run()
