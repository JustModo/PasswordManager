import json
from os import path

import appdirs
from encryption_handler import EncryptionHandler


class DataHandler:
    """
    WARNING:-
        THere is no fail-safe for if the app is opened for the first time.

    A class that handles the stored data.
    This class does NOT handle encryption directly. Look at ./encryption_handler.py
    When a instance is created, the instance should be used for one user ONLY.

    In this class "data" is used. THe following is the format of data:-
        data:- {
            entry_name: {
                field_name: field_value
            }
        }
    Example for "data":
        {
            "Amazon": {
                "Username": "Kosh",
                "Password": "Pass1234"
            },
            "Matrix": {
                "Username": "Kosh",
                "Email": "kosh@fake.com",
                "id": "@kosh:matrix.com"
            }
        }

    Attributes:-
    __file_path (private):- The path to the file where the users encrypted data is stored.
    __password (private):- The users password.
    """

    __file_path: str
    __user_name: str
    __password: str

    def __init__(self, user_name: str, password: str) -> None:
        """
        Logs in the user
        Parameters:-
            user_name
            password
        Raises:-
            If user_name does not exist, ValueError will be thrown
            If password is wrong, ValueError will be thrown
        WARNING:-
            If this is the first time the app is opened, the user_name will be shown as wrong
        """
        self.__file_path = appdirs.user_data_dir(appname="Unnamed_Password_Manager")
        self.__user_name = user_name
        self.__file_path = path.join(self.__file_path, self.__user_name)
        self.__password = password

        if not path.exists(self.__file_path):
            raise ValueError(f"User {user_name} does not exist.")

        # This will call encryption handler,
        # which will throw an error if the password is wrong
        self.get_data()

    @staticmethod
    def create_user(user_name: str, password: str) -> None:
        """
        Creates a new user.
        Parameters:-
            user_name
            password
        Raises:-
            If user_name exists, ValueError is thrown
        """
        file_path = path.join(
                appdirs.user_data_dir(appname="Unnamed_Password_Manager"),
                user_name
        )
        if path.exists(file_path):
            raise ValueError(f"User {user_name} already exists")
        with open(file_path, "wb") as file:
            file.write(EncryptionHandler.encrypt(b"{}", password.encode()))

    def get_data(self) -> dict[str, dict[str, str]]:
        """
        Get the data of the user.
        Return:-
            data:- Read the class documentation for more information.
        """
        with open(self.__file_path, "rb") as file:
            data: str = \
                    EncryptionHandler.decrypt(file.read(), self.__password.encode())\
                    .decode()
        return json.loads(data)

    def write_data(self, data: dict[str, dict[str, str]]) -> None:
        """
        Write the data of the user.
        Parameters:-
            data:- Read the class documentation for more information
        """
        json_data: str = json.dumps(data)
        encrypted_data: bytes = EncryptionHandler.encrypt(
                json_data.encode(),
                self.__password.encode()
        )
        with open(self.__file_path, "wb") as file:
            file.write(encrypted_data)

    def change_password(self, password: str) -> None:
        """
        Changes the password of the user.
        Parameters:-
            password
        """
        data: dict[str, dict[str, str]] = self.get_data()
        self.__password = password
        self.write_data(data)

    def add_entry(self, entry_name: str, fields: dict[str, str]) -> None:
        """
        Add a new entry:-
        Parameters:-
            entry_name
            fields:- {
                field_name_1: field_value_1,
                field_name_2: field_value_2
            }
        Raises:-
            A ValueError is raised if entry_name already exists.
        """
        data: dict[str, dict[str, str]] = self.get_data()
        if entry_name in data:
            raise ValueError(f"Entry {entry_name} already exists.")

        data[entry_name] = fields
        self.write_data(data)

    def delete_entry(self, entry_name: str) -> None:
        """
        Deletes the given entry.
        Parameters:-
            entry_name
        Errors:-
            If the requested entry does not exist, an error will be thrown
        """
        data: dict[str, dict[str, str]] = self.get_data()
        if entry_name not in data:
            raise ValueError(f"{entry_name} does not exist.")
        data.pop(entry_name)
        self.write_data(data)

    def edit_entry_name(self, old_entry_name: str, new_entry_name: str) -> None:
        """
        Changes the name of the entry.
        Parameters:-
            old_entry_name
            new_entry_name
        Errors:-
            If the old_entry_name does not exist, a ValueError will be thrown.
            If new_entry_name already exists, a ValueError will be raised.
        """
        data: dict[str, dict[str, str]] = self.get_data()
        if new_entry_name in data:
            raise ValueError(f"\"{new_entry_name}\" already exists")
        if old_entry_name not in data:
            raise ValueError(f"No entry with name \"{old_entry_name}\"")

        self.delete_entry(old_entry_name)
        self.add_entry(new_entry_name, data[old_entry_name])

    def add_field(self,
            entry_name: str,
            field_name: str,
            field_value: str,
    ) -> None:
        """
        Adds a new field to a given entry.
        Parameters:-
            entry_name
            field_name
            field_value
        Raises:-
            If entry_name does not exist, a ValueError will be raised.
            If field_name already exists, a ValueError will be raised.
        """
        data: dict[str, dict[str, str]] = self.get_data()
        if entry_name not in data:
            raise ValueError(f"No entry with name \"{entry_name}\"")
        if field_name in data[entry_name]:
            raise ValueError(f"Field {field_name} already exists under entry {entry_name}")
        data[entry_name][field_name] = field_value
        self.write_data(data)

    def delete_field(self, entry_name: str, field_name: str) -> None:
        """
        Adds a new field to a given entry.
        Parameters:-
            entry_name
            field_name
        Raises:-
            If entry_name does not exist, a ValueError will be raised.
            If field_name does not exists, a ValueError will be raised.
        """
        data: dict[str, dict[str, str]] = self.get_data()
        if entry_name not in data:
            raise ValueError(f"No entry with name \"{entry_name}\"")
        if field_name not in data[entry_name]:
            raise ValueError(f"No field {field_name} under entry {entry_name}")
        data[entry_name].pop(field_name)
        self.write_data(data)

    def edit_field_name(
            self,
            entry_name: str,
            old_field_name: str,
            new_field_name: str
    ) -> None:
        """
        Change the name of a field under the given entry.
        Parameters:-
            entry_name
            old_field_name
            new_field_name
        Raises:-
            If entry_name does not exist, a ValueError will be raised.
            If old_field_name does not exists, a ValueError will be raised.
            If field_name already exists, a ValueError will be raised.
        """
        data: dict[str, dict[str, str]] = self.get_data()
        if entry_name not in data:
            raise ValueError(f"No entry with name \"{entry_name}\"")
        if old_field_name not in data[entry_name]:
            raise ValueError(f"No field {old_field_name} under entry {entry_name}")
        if new_field_name in data[entry_name]:
            raise ValueError(f"Field {new_field_name} already exists under {entry_name}")
        data[entry_name][new_field_name] = data[entry_name][old_field_name]
        data[entry_name].pop(old_field_name)
        self.write_data(data)

    def edit_field_value(self,
            entry_name: str,
            field_name: str,
            new_value: str,
    ) -> None:
        """
        Change the value of the given field under the given entry.
        Parameters:-
            entry_name
            field_name
            new_value
        Raises:-
            If entry_name does not exist, a ValueError will be raised.
            If field_name does not exists, a ValueError will be raised.
        """
        data: dict[str, dict[str, str]] = self.get_data()
        if entry_name not in data:
            raise ValueError(f"No entry with name \"{entry_name}\"")
        if field_name not in data[entry_name]:
            raise ValueError(f"No field {field_name} under entry {entry_name}")
        data[entry_name][field_name] = new_value
        self.write_data(data)
