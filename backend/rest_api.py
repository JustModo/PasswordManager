from flask import Flask, send_file, abort, Response
from os import path


app: Flask = Flask(__name__)

@app.get("/")
@app.get("/<url_path>")
def handle_get(url_path: str = "index.html") -> Response:
    """
    Handle all get requests that are made.
    """
    requested_file_path: str = \
            path.abspath(path.join(path.curdir, "..", "frontend", url_path))
    response: Response = send_file(requested_file_path)
    response.status = 200
    if path.isfile(requested_file_path):
        print('a')
        return send_file(requested_file_path)
    abort(404)
