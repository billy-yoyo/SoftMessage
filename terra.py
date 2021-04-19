from cryptography.fernet import Fernet
import json
import subprocess, os
import sys

VAULT_NAME = "terra.vault"
VAULT_KEY = "terra.key"

STATE_NAME = "terraform.tfstate"
STATE_LOCKED = "terraform.tfstate.locked"

def load_key():
    with open(VAULT_KEY, "rb") as f:
        return f.read()

def gen_key():
    key = Fernet.generate_key()
    with open(VAULT_KEY, "wb") as f:
        f.write(key)

def encrypt_vault(data, filename, key):
    data_string = json.dumps(data)
    fernet = Fernet(key)
    data_encrypted = fernet.encrypt(data_string.encode('utf-8'))
    with open(filename, "wb") as f:
        f.write(data_encrypted)

def decrypt_vault(filename, key):
    fernet = Fernet(key)
    with open(filename, "rb") as f:
        data_encrypted = f.read()
    data_decrypted = fernet.decrypt(data_encrypted)
    return json.loads(data_decrypted.decode('utf-8'))

def launch(key):
    new_env = os.environ.copy()
    vault = decrypt_vault(VAULT_NAME, key)
    for key, value in vault.items():
        new_env[f"TF_VAR_{key}"] = value
    subprocess.call("start", env=new_env, shell=True)

def save_vault(key, args):
    kwargs = {}
    i = 0
    while i < len(args) - 1:
        if args[i].startswith("--"):
            kwargs[args[i][2:]] = args[i + 1]
            i += 1
        i += 1
    encrypt_vault(kwargs, VAULT_NAME, key)

def encrypt_state(key):
    fernet = Fernet(key)
    with open(STATE_NAME, "rb") as f:
        data = f.read()
    data_encrypted = fernet.encrypt(data)
    with open(STATE_LOCKED, "wb") as f:
        f.write(data_encrypted)

def decrypt_state(key):
    fernet = Fernet(key)
    with open(STATE_LOCKED, "rb") as f:
        data = f.read()
    data_encrypted = fernet.decrypt(data)
    with open(STATE_NAME, "wb") as f:
        f.write(data_encrypted)

def run():
    if len(sys.argv) < 2:
        raise KeyError()

    command = sys.argv[1]
    if command == "start":
        key = load_key()
        launch(key)
    elif command == "save":
        key = load_key()
        save_vault(key, sys.argv[2:])
    elif command == "gen":
        gen_key()
    elif command == "state":
        key = load_key()
        if sys.argv[2] == "load":
            decrypt_state(key)
        elif sys.argv[2] == "save":
            encrypt_state(key)
    else:
        raise KeyError()

try:
    run()
except (KeyError, TypeError):
    print(f"Invalid usage: terra.py [command] ...args\n  terra.py gen\n  terra.py start\n  terra.py save --arg1 value1 --arg2 value2 ...\n  terra.py state load\n  terra.py state save")
