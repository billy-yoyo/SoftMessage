import sys
from subprocess import check_output

REGION = "eu-west-1"
ACCOUNT_ID = "209209409693"
REPOS = [
    ["softmessage-writer-repo", "softmessage-writer"]
]

def repo_url(region, account_id, repo_name):
    return f"{account_id}.dkr.ecr.{region}.amazonaws.com/{repo_name}:latest"

def get_aws_login_password(region):
    print("--- getting login ")
    output = check_output(["aws", "ecr", "get-login-password", "--region", region])
    return output.decode("utf-8").strip()

def aws_docker_login(region, account_id, password):
    print("--- logging into docker")
    output = check_output(["docker", "login", "--username", "AWS", "--password", password, f"{account_id}.dkr.ecr.{region}.amazonaws.com"])
    print(output.decode("utf-8"))

def get_password_and_login(region, account_id):
    password = get_aws_login_password(region)
    aws_docker_login(region, account_id, password)

def push_docker_repo(region, account_id, repo_name):
    print("--- pushing docker")
    output = check_output(["docker", "push", repo_url(region, account_id, repo_name)])
    print(output.decode("utf-8"))

def build_repo(region, account_id, repo_name, repo_folder):
    tag = repo_url(region, account_id, repo_name)
    output = check_output(["docker", "build", "--tag", tag, f"./{repo_folder}"])
    print(output.decode("utf-8"))

commands = {}
def command(name):
    def decorator(func):
        commands[name] = func
        return func
    return decorator

@command("push")
def deploy(specific_repo_folder=None):
    get_password_and_login(REGION, ACCOUNT_ID)

    for repo_name, repo_folder in REPOS:
        if specific_repo_folder is None or specific_repo_folder == repo_folder:
            build_repo(REGION, ACCOUNT_ID, repo_name, repo_folder)
            push_docker_repo(REGION, ACCOUNT_ID, repo_name)


def run():
    cmd = sys.argv[1:]
    if len(cmd) < 0 or cmd[0] not in commands:
        print("Invalid command, must be one of " + ", ".join(commands.keys()))
    else:
        commands[cmd[0]](*cmd[1:])

run()