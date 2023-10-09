import json
from encryption_handler import EncryptionHandler


file_path: str = "/home/kosh/.local/share/kosh_pass/data.json"
password_check_path: str = "/home/kosh/.local/share/kosh_pass/password_check"

class DataHandler:
    def __get_file_data(self) -> dict[str, dict[str, str]]:
        with open(file_path, "r", encoding="utf8") as file:
            return json.load(file)

    def __write_file_data(self, data: dict[str, dict[str, str]]) -> None:
        with open(file_path, "w", encoding="utf8") as file:
            json.dump(data, file)

    def set_password(self, password: str) -> None:
        with open(password_check_path, "wb") as password_check_file:
            password_check_file.write(
                    EncryptionHandler.encrypt("Correct".encode(), password.encode())
            )

    def verify_password(self, password: str) -> None:
        with open(password_check_path, "rb") as password_check_file:
            EncryptionHandler.decrypt(password_check_file.read(), password.encode())
    
    def change_password(self, old_password: str, new_password: str) -> None:
        self.verify_password(old_password)
        data: dict[str, dict[str, str]] = {}

        for entry_name in self.get_entry_names():
            data[entry_name] = {}
            for field_name in self.get_field_names(entry_name):
                data[entry_name][field_name] = \
                        self.get_field_data(entry_name, field_name, old_password)

        self.set_password(new_password)
        self.__write_file_data({})

        for entry_name in data:
            self.add_entry(entry_name)
            for field_name in data[entry_name]:
                self.add_field(
                        entry_name, field_name, data[entry_name][field_name], new_password
                )

    def add_entry(self, entry_name: str) -> None:
        data = self.__get_file_data()
        if entry_name in data:
            raise ValueError(f"An entry with the name {entry_name} already exists.")

        data[entry_name] = {}
        self.__write_file_data(data)

    def delete_entry(self, entry_name: str) -> None:
        data = self.__get_file_data()
        try:
            data.pop(entry_name)
        except KeyError:
            raise ValueError(f"No entry with name \"{entry_name}\"") from KeyError
        self.__write_file_data(data)

    def edit_entry_name(self, entry_name: str, new_entry_name: str) -> None:
        if new_entry_name in self.get_entry_names():
            raise ValueError(f"\"{new_entry_name}\" already exists")
        if entry_name not in self.get_entry_names():
            raise ValueError(f"No entry with name \"{entry_name}\"")

        fields: dict[str, str] = self.__get_file_data()[entry_name]
        self.delete_entry(entry_name)
        data = self.__get_file_data()
        data[new_entry_name] = fields
        self.__write_file_data(data)

    def get_entry_names(self, ) -> list[str]:
        return list(self.__get_file_data().keys())

    def add_field(self, 
            entry_name: str,
            field_name: str,
            field_value: str,
            password: str
    ) -> None:
        self.verify_password(password)
        if entry_name not in self.get_entry_names():
            raise ValueError(f"No entry with name {entry_name}")
        if field_name in self.get_field_names(entry_name):
            raise ValueError(f"Field {field_name} already exists under entry {entry_name}")
        
        data: dict[str, dict[str, str]] = self.__get_file_data()
        data[entry_name][field_name] = EncryptionHandler.encrypt(
                field_value.encode(),
                password.encode()
        ).decode("unicode-escape")
        self.__write_file_data(data)

    def delete_field(self, entry_name: str, field_name: str) -> None:
        if entry_name not in self.get_entry_names():
            raise ValueError(f"No entry with name \"{entry_name}\"")
        if field_name not in self.get_field_names(entry_name):
            raise ValueError(f"{entry_name} does not have field {field_name}")
        data = self.__get_file_data()
        data[entry_name].pop(field_name)
        self.__write_file_data(data)

    def edit_field_name(self, entry_name: str, field_name: str, new_field_name: str) -> None:
        if entry_name not in self.get_entry_names():
            raise ValueError(f"No entry with name \"{entry_name}\"")
        if field_name not in self.get_field_names(entry_name):
            raise ValueError(f"{entry_name} does not have field {field_name}")
        if new_field_name in self.get_field_names(entry_name):
            raise ValueError(f"{entry_name} does has a field {new_field_name}")
        field_data = self.__get_file_data()[entry_name][field_name]
        self.delete_field(entry_name, field_name)
        data = self.__get_file_data()
        data[entry_name][new_field_name] = field_data
        self.__write_file_data(data)

    def edit_field_value(self, 
            entry_name: str,
            field_name: str,
            new_value: str,
            password: str
    ) -> None:
        self.verify_password(password)
        if entry_name not in self.get_entry_names():
            raise ValueError(f"No entry called {entry_name}")
        if field_name not in self.get_field_names(entry_name):
            raise ValueError(f"No field called {field_name} under {entry_name}")
        self.delete_field(entry_name, field_name)
        self.add_field(entry_name, field_name, new_value, password)

    def get_field_data(self, entry_name: str, field_name: str, password: str) -> str:
        self.verify_password(password)
        if field_name not in self.get_field_names(entry_name):
            raise ValueError(f"No field with name {field_name} under {entry_name}.")
        encrypted_data = self.__get_file_data()[entry_name][field_name].\
                encode("ISO-8859-1")
        plain_data = EncryptionHandler.decrypt(
                encrypted_data,
                password.encode("ISO-8859-1")
        ).decode("utf-8")
        return plain_data

    def get_field_names(self, entry_name: str) -> list[str]:
        data = self.__get_file_data()
        if entry_name not in data:
            raise ValueError(f"No entry with name {entry_name}.")
        return list(data[entry_name].keys())

    def add_entry_and_fields(
            self,
            entry_name: str,
            fields: dict[str, str],
            password: str
    ) -> None:
        self.verify_password(password)
        if entry_name in self.get_entry_names():
            raise ValueError(f"Entry {entry_name} already exists.")
        self.add_entry(entry_name)
        for field_name, field_value in fields.items():
            print(field_name, field_value)
            self.add_field(entry_name, field_name, field_value, password)
