# Softmessage

## Requisites

* Node v12, with npm
* terraform
* AWS CLI
* Python 3
* `terra.key` and `terra.vault`

## Key & Vault

`terra.vault` stores secrets that terraform uses to create the deployment. `terra.key` is the key file for this vault, which is not included in this repo. `terra.py` is the script which manages these secrets. If you want to use the committed vault, you must ask someone for the key file. If you want to create your own deployment, use the following steps:

NOTE: these commands will *replace* the current `terra.vault` file

* `python terra.py gen` - will generate a new `terra.key` file
* `python terra.py save --db_username value --db_password value --jwt_secret value` - will store the vault with the key file

## Quickstart

Assuming you've configured terraform and aws correctly (mainly just credentials), to deploy run the following commands:

* If this is the first time running, load the committed state by running `python terra.py state load`
* `python terra.py start`, which will then launch a new terminal window with some terraform secrets set as environment variables
* `terraform apply`, and `yes` to the prompt
* `python ecr.py push`, which will build the services and push them to ecr 
* you should also remember to run `python terra.py state save` to save the encrypted terraform state for commit

I don't think ecr reacts to new pushes, or at least not quickly, so the best way to deploy your changes to a service is to go to the tasks for that service cluster and stop them all, the cluster will then automatically restart the tasks with the new ecr image.

## ECR

As the quickstart says, you can run `python ecr.py push` to build new images for all of the services and push them to their respective ECRs.

If you only want to build and push a single service, you can run `python ecr.py push <service_name>` e.g. `python ecr.py push softmessage-api`

If you add a new service, you'll need to add its name to the list of services at the top of `ecr.py` (each entry is a 2-item list of `["repo-name", "folder-name"]`).

## Developing Locally

Due to their heavy reliance on integrations for pretty much all of their functionality, I haven't created any way of running `softmessage-writer` or `softmessage-digest` locally. However, for `softmessage-web` you there is a docker-compose file you can `up` to get a little web stack running locally. It has adminer too, so you can connect and add some test data. Authenticating and sending messages won't work unless you integrate it with `softmessage-api`.

It would be totally possible to run `softmessage-api` locally, you'd just need to create a docker compose file which spins up both `softmessage-api` and `softmessage-web`, connects them both to the same db, and links the api to the web via environment variables that terraform normally sets for us. Currently I haven't got round to doing this, but it shouldn't be too hard to get working.

Another future plan should be to add a way of running softmessage-api & softmessage-web with hot-loading. Currently even if you make changes, you need to force docker to restart the service to pick up the changes. It makes developing things such as css and general debugging quite slow.

## Adding Services

Generally to create a new service, use the `<service-name>.tf`, `variables.tf` and `Dockerfile` from one of the other services as a template - probably whichever service is closest to the one you plan on creating (i.e. requires db access, sns, sqs, loadbalanced, etc.)

And remember to add the service as a module in `main.tf` otherwise nothing will happen!

## Terraform Secrets

As stated before, we use `terra.py` to manage our terraform secrets. This comes in two parts: 

Firstly, we have a `terra.vault` which stores sensitive terra variables, which can then be used as environment variables by terraform later. 

Secondly, we have `terraform.tfstate.locked` which is an encrypted `terraform.tfstate`. It is necessary to encrypt the tfstate since the secrets we use, as well as potentially other secrets which are generated, will all be stored in the tfstate, so it should not be considered "safe" information. But we still want a way to share the tfstate between machines, which `terra.py` gives us.

Both of these use the same key file, `terra.key`. This is secure and should only be transferred between devs via secure channels, and should *never* be comitted.

## Architecture

The following is a rough architecture diagram of the terraform stack

![Architecture](/softmessage.png)

if you make any significant changes, please try and update `softmessage.xml` (drawn in draw.io)
