from os import path
from flask import Flask, request, send_file, abort, Response
from werkzeug.datastructures import ImmutableMultiDict

from data_handler import DataHandler


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
        return send_file(requested_file_path)
    abort(404)


class QueryHandler:
    """
    This is the bridge between the frontend and DataHandler class
    """
    __data_handler: DataHandler

    @staticmethod
    @app.post("/login")
    def login() -> Response:
        """
        Logs the user in
        """
        data: ImmutableMultiDict[str, str] = request.form
        if "user_name" not in data:
            return Response(
                    "user_name not given",
                    400,
                    content_type="text/plain"
            )
        if "password" not in data:
            return Response(
                    "password is not given",
                    400,
                    content_type="text/plain"
            )

        try:
            QueryHandler.__data_handler = \
                    DataHandler(data["user_name"], data["password"])
        except ValueError as value_error:
            return Response(
                    str(value_error),
                    403,
                    content_type="text/plain"
            )

        return Response(status=200)
