from cryptography.fernet import Fernet

# Simulated encryption layer (replace with post-quantum libs in prod)
key = Fernet.generate_key()
cipher_suite = Fernet(key)

def encrypt_data(data):
    return cipher_suite.encrypt(data.encode())

def decrypt_data(token):
    return cipher_suite.decrypt(token).decode()
