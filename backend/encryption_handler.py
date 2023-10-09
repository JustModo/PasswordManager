from Crypto.Cipher import AES
from hashlib import sha256


class EncryptionHandler:
    @staticmethod
    def encrypt(plain_data: bytes, password: bytes) -> bytes:
        plain_data += b"Correct"
        key = sha256(password).digest()
        cipher = AES.new(key, AES.MODE_CFB)
        cipher_text = bytes(cipher.iv) + cipher.encrypt(plain_data)
        return cipher_text

    @staticmethod
    def decrypt(encrypted_data: bytes, password: bytes) -> bytes:
        key = sha256(password).digest()
        cipher = AES.new(key, AES.MODE_CFB, iv=encrypted_data[: 16])
        plain_data = cipher.decrypt(encrypted_data[16:])
        if plain_data[-7:] == b"Correct":
            return plain_data[:-7]
        raise ValueError("Incorrect Password")
