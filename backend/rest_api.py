from os import mkdir, path
from flask import Flask, request, send_file, abort, Response
from werkzeug.datastructures import ImmutableMultiDict

from data_handler import DataHandler
import appdirs


app: Flask = Flask(__name__)


def handle_first_launched():
    """
    Makes sure everything is initialized correctly
    """
    folder_path: str = appdirs.user_data_dir()
    folder_path = path.join(folder_path, "Unnamed_Password_Manager")
    if not path.exists(folder_path):
        mkdir(folder_path)


@app.get("/")
@app.get("/<url_path>")
def handle_get(url_path: str = "index.html") -> Response:
    """
    Handle all get requests that are made.
    """
    handle_first_launched()
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

    @staticmethod
    @app.post("/add_user")
    def add_user() -> Response:
        """
        Adds a new user
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
            DataHandler.create_user(data["user_name"], data["password"])
        except ValueError as value_error:
            return Response(
                    str(value_error),
                    403,
                    content_type="text/plain"
            )

        return Response(status=200)
