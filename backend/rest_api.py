from os import mkdir, path
import json
from flask import Flask, request, send_file, abort, Response
from werkzeug.datastructures import ImmutableMultiDict
import appdirs

from data_handler import DataHandler


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
@app.get("/<path:url_path>")
def handle_get(url_path: str = "html/index.html") -> Response:
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
    __data_handler: DataHandler| None = None

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
    @app.post("/logout")
    def logout() -> Response:
        """
        Logs the user out
        """
        if QueryHandler.__data_handler is None:
            return Response(
                    "Not logged in",
                    403,
                    content_type="text/plain"
            )
        QueryHandler.__data_handler = None
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

    @staticmethod
    @app.post("/get_data")
    def get_data() -> Response:
        """
        Return all user data
        """
        if QueryHandler.__data_handler is None:
            return Response(
                    "Not logged in",
                    403,
                    content_type="text/plain"
            )
        return Response(
                json.dumps(QueryHandler.__data_handler.get_data()),
                200,
                content_type="text/json"
        )

    @staticmethod
    @app.post("/change_password")
    def change_password() -> Response:
        """
        Change the password of the user.
        """
        if QueryHandler.__data_handler is None:
            return Response(
                    "Not logged in",
                    403,
                    content_type="text/plain"
                    )

        data: ImmutableMultiDict[str, str] = request.form
        if "password" not in data:
            return Response(
                    "password is not given",
                    400,
                    content_type="text/plain"
            )

        QueryHandler.__data_handler.change_password(data["password"])

        return Response(status=200)

    @staticmethod
    @app.post("/add_entry")
    def add_entry() -> Response:
        """
        Add a new entry to the data
        """
        if QueryHandler.__data_handler is None:
            return Response(
                    "Not logged in",
                    403,
                    content_type="text/plain"
                    )

        data: ImmutableMultiDict[str, str] = request.form
        if "entry_name" not in data:
            return Response(
                    "entry_name is not given",
                    400,
                    content_type="text/plain"
            )
        if "fields" not in data:
            return Response(
                    "fields is not given",
                    400,
                    content_type="text/plain"
            )
        entry_name: str = data["entry_name"]
        try:
            fields: dict = json.loads(data["fields"])
        except json.decoder.JSONDecodeError:
            return Response(
                    f"The json-string provided is wrong {data['fields']}",
                    400,
                    content_type="text/plain"
            )
        try:
            QueryHandler.__data_handler.add_entry(entry_name, fields)
        except ValueError as value_error:
            return Response(
                    str(value_error),
                    403,
                    content_type="text/plain"
            )
        return Response(status=200)

    @staticmethod
    @app.post("/delete_entry")
    def delete_entry() -> Response:
        """
        Delete Entry for the logged in user
        """
        if QueryHandler.__data_handler is None:
            return Response(
                    "Not logged in",
                    403,
                    content_type="text/plain"
            )

        data: ImmutableMultiDict[str, str] = request.form
        if "entry_name" not in data:
            return Response(
                    "entry_name is not given",
                    400,
                    content_type="text/plain"
            )
        entry_name: str = data["entry_name"]
        try:
            QueryHandler.__data_handler.delete_entry(entry_name)
        except ValueError as value_error:
            return Response(
                    str(value_error),
                    403,
                    content_type="text/plain"
            )
        return Response(status=200)

    @staticmethod
    @app.post("/edit_entry_name")
    def edit_entry_name() -> Response:
        """
        Delete Entry for the logged in user
        """
        if QueryHandler.__data_handler is None:
            return Response(
                    "Not logged in",
                    403,
                    content_type="text/plain"
            )

        data: ImmutableMultiDict[str, str] = request.form
        if "old_entry_name" not in data:
            return Response(
                    "old_entry_name is not given",
                    400,
                    content_type="text/plain"
            )
        if "new_entry_name" not in data:
            return Response(
                    "new_entry_name is not given",
                    400,
                    content_type="text/plain"
            )
        try:
            QueryHandler.__data_handler.edit_entry_name(
                    data["old_entry_name"], data["new_entry_name"]
            )
        except ValueError as value_error:
            return Response(
                    str(value_error),
                    403,
                    content_type="text/plain"
            )
        return Response(status=200)

    @staticmethod
    @app.post("/add_field")
    def add_field() -> Response:
        """
        Add a field to the entry
        """
        if QueryHandler.__data_handler is None:
            return Response(
                    "Not logged in",
                    403,
                    content_type="text/plain"
            )

        data: ImmutableMultiDict[str, str] = request.form
        if "entry_name" not in data:
            return Response(
                    "entry_name is not given",
                    400,
                    content_type="text/plain"
            )
        if "field_name" not in data:
            return Response(
                    "field_name is not given",
                    400,
                    content_type="text/plain"
            )
        if "field_value" not in data:
            return Response(
                    "field_value is not given",
                    400,
                    content_type="text/plain"
            )
        try:
            QueryHandler.__data_handler.add_field(
                    data["entry_name"],
                    data["field_name"],
                    data["field_value"]
            )
        except ValueError as value_error:
            return Response(
                    str(value_error),
                    403,
                    content_type="text/plain"
            )
        return Response(status=200)

    @staticmethod
    @app.post("/delete_field")
    def delete_field() -> Response:
        """
        Delete a field from a entry
        """
        if QueryHandler.__data_handler is None:
            return Response(
                    "Not logged in",
                    403,
                    content_type="text/plain"
            )

        data: ImmutableMultiDict[str, str] = request.form
        if "entry_name" not in data:
            return Response(
                    "entry_name is not given",
                    400,
                    content_type="text/plain"
            )
        if "field_name" not in data:
            return Response(
                    "field_name is not given",
                    400,
                    content_type="text/plain"
            )
        try:
            QueryHandler.__data_handler.delete_field(
                    data["entry_name"],
                    data["field_name"]
            )
        except ValueError as value_error:
            return Response(
                    str(value_error),
                    403,
                    content_type="text/plain"
            )
        return Response(status=200)

    @staticmethod
    @app.post("/edit_field_name")
    def edit_field_name() -> Response:
        """
        Change the field name in a entry
        """
        if QueryHandler.__data_handler is None:
            return Response(
                    "Not logged in",
                    403,
                    content_type="text/plain"
            )

        data: ImmutableMultiDict[str, str] = request.form
        if "entry_name" not in data:
            return Response(
                    "entry_name is not given",
                    400,
                    content_type="text/plain"
            )
        if "old_field_name" not in data:
            return Response(
                    "old_field_name is not given",
                    400,
                    content_type="text/plain"
            )
        if "new_field_name" not in data:
            return Response(
                    "new_field_name is not given",
                    400,
                    content_type="text/plain"
            )
        try:
            QueryHandler.__data_handler.edit_field_name(
                    data["entry_name"],
                    data["old_field_name"],
                    data["new_field_name"]
            )
        except ValueError as value_error:
            return Response(
                    str(value_error),
                    403,
                    content_type="text/plain"
            )
        return Response(status=200)

    @staticmethod
    @app.post("/edit_field_value")
    def edit_field_value() -> Response:
        """
        Change the value of a field
        """
        if QueryHandler.__data_handler is None:
            return Response(
                    "Not logged in",
                    403,
                    content_type="text/plain"
            )

        data: ImmutableMultiDict[str, str] = request.form
        if "entry_name" not in data:
            return Response(
                    "entry_name is not given",
                    400,
                    content_type="text/plain"
            )
        if "field_name" not in data:
            return Response(
                    "field_name is not given",
                    400,
                    content_type="text/plain"
            )
        if "field_value" not in data:
            return Response(
                    "field_value is not given",
                    400,
                    content_type="text/plain"
            )
        try:
            QueryHandler.__data_handler.edit_field_value(
                    data["entry_name"],
                    data["field_name"],
                    data["field_value"]
            )
        except ValueError as value_error:
            return Response(
                    str(value_error),
                    403,
                    content_type="text/plain"
            )
        return Response(status=200)
