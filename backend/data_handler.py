import json
from encryption_handler import EncryptionHandler


file_path: str = "/home/kosh/.local/share/kosh_pass/data.json"
password_check_path: str = "/home/kosh/.local/share/kosh_pass/password_check"

class DataHandler:
    @staticmethod
    def __get_file_data() -> dict[str, dict[str, str]]:
        with open(file_path) as file:
            return json.load(file)

    @staticmethod
    def __write_file_data(data: dict[str, dict[str, str]]) -> None:
        with open(file_path, "w") as file:
            json.dump(data, file)

    @staticmethod
    def set_password(password: str) -> None:
        with open(password_check_path, "wb") as password_check_file:
            password_check_file.write(
                    EncryptionHandler.encrypt("Correct".encode(), password.encode())
            )

    @staticmethod
    def verify_password(password: str) -> None:
        with open(password_check_path, "rb") as password_check_file:
            EncryptionHandler.decrypt(password_check_file.read(), password.encode())
    
    @staticmethod
    def change_password(old_password: str, new_password: str) -> None:
        DataHandler.verify_password(old_password)
        data: dict[str, dict[str, str]] = {}

        for entry_name in DataHandler.get_entry_names():
            data[entry_name] = {}
            for field_name in DataHandler.get_field_names(entry_name):
                data[entry_name][field_name] = \
                        DataHandler.get_field_data(entry_name, field_name, old_password)

        DataHandler.set_password(new_password)
        DataHandler.__write_file_data({})

        for entry_name in data:
            DataHandler.add_entry(entry_name)
            for field_name in data[entry_name]:
                DataHandler.add_field(
                        entry_name, field_name, data[entry_name][field_name], new_password
                )

    @staticmethod
    def add_entry(entry_name: str) -> None:
        data = DataHandler.__get_file_data()
        if entry_name in data:
            raise ValueError(f"An entry with the name {entry_name} already exists.")

        data[entry_name] = {}
        DataHandler.__write_file_data(data)

    @staticmethod
    def delete_entry(entry_name: str) -> None:
        data = DataHandler.__get_file_data()
        try:
            data.pop(entry_name)
        except KeyError:
            raise ValueError(f"No entry with name \"{entry_name}\"")
        DataHandler.__write_file_data(data)

    @staticmethod
    def edit_entry_name(entry_name: str, new_entry_name: str) -> None:
        if new_entry_name in DataHandler.get_entry_names():
            raise ValueError(f"\"{new_entry_name}\" already exists")
        if entry_name not in DataHandler.get_entry_names():
            raise ValueError(f"No entry with name \"{entry_name}\"")

        fields: dict[str, str] = DataHandler.__get_file_data()[entry_name]
        DataHandler.delete_entry(entry_name)
        data = DataHandler.__get_file_data()
        data[new_entry_name] = fields
        DataHandler.__write_file_data(data)

    @staticmethod
    def get_entry_names() -> list[str]:
        return list(DataHandler.__get_file_data().keys())

    @staticmethod
    def add_field(
            entry_name: str,
            field_name: str,
            field_value: str,
            password: str
    ) -> None:
        DataHandler.verify_password(password)
        if entry_name not in DataHandler.get_entry_names():
            raise ValueError(f"No entry with name {entry_name}")
        if field_name in DataHandler.get_field_names(entry_name):
            raise ValueError(f"Field {field_name} already exists under entry {entry_name}")
        
        data: dict[str, dict[str, str]] = DataHandler.__get_file_data()
        data[entry_name][field_name] = EncryptionHandler.encrypt(
                field_value.encode(),
                password.encode()
        ).decode("unicode-escape")
        DataHandler.__write_file_data(data)

    @staticmethod
    def delete_field(entry_name: str, field_name: str) -> None:
        if entry_name not in DataHandler.get_entry_names():
            raise ValueError(f"No entry with name \"{entry_name}\"")
        if field_name not in DataHandler.get_field_names(entry_name):
            raise ValueError(f"{entry_name} does not have field {field_name}")
        data = DataHandler.__get_file_data()
        data[entry_name].pop(field_name)
        DataHandler.__write_file_data(data)

    @staticmethod
    def edit_field_name(entry_name: str, field_name: str, new_field_name: str) -> None:
        if entry_name not in DataHandler.get_entry_names():
            raise ValueError(f"No entry with name \"{entry_name}\"")
        if field_name not in DataHandler.get_field_names(entry_name):
            raise ValueError(f"{entry_name} does not have field {field_name}")
        if new_field_name in DataHandler.get_field_names(entry_name):
            raise ValueError(f"{entry_name} does has a field {new_field_name}")
        field_data = DataHandler.__get_file_data()[entry_name][field_name]
        DataHandler.delete_field(entry_name, field_name)
        data = DataHandler.__get_file_data()
        data[entry_name][new_field_name] = field_data
        DataHandler.__write_file_data(data)

    @staticmethod
    def edit_field_value(
            entry_name: str,
            field_name: str,
            new_value: str,
            password: str
    ) -> None:
        DataHandler.verify_password(password)
        if entry_name not in DataHandler.get_entry_names():
            raise ValueError(f"No entry called {entry_name}")
        if field_name not in DataHandler.get_field_names(entry_name):
            raise ValueError(f"No field called {field_name} under {entry_name}")
        
        DataHandler.delete_field(entry_name, field_name)
        DataHandler.add_field(entry_name, field_name, new_value, password)

    @staticmethod
    def get_field_data(entry_name: str, field_name: str, password: str) -> str:
        DataHandler.verify_password(password)
        if field_name not in DataHandler.get_field_names(entry_name):
            raise ValueError(f"No field with name {field_name} under {entry_name}.")
        encrypted_data = DataHandler.__get_file_data()[entry_name][field_name].encode("ISO-8859-1")
        plain_data = EncryptionHandler.decrypt(encrypted_data, password.encode("ISO-8859-1")).decode("utf-8")
        return plain_data

    @staticmethod
    def get_field_names(entry_name: str) -> list[str]:
        data = DataHandler.__get_file_data()
        if entry_name not in data:
            raise ValueError(f"No entry with name {entry_name}.")
        return list(data[entry_name].keys())

    @staticmethod
    def add_entry_and_fields(
            entry_name: str,
            fields: dict[str, str],
            password: str
    ) -> None:
        DataHandler.verify_password(password)
        if entry_name in DataHandler.get_entry_names():
            raise ValueError(f"Entry {entry_name} already exists.")
        DataHandler.add_entry(entry_name)
        for field_name, field_value in fields.items():
            print(field_name, field_value)
            DataHandler.add_field(entry_name, field_name, field_value, password)
