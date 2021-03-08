# Softmessage

## Requisites

Npm & Node (developed with node v12), terraform, aws cli, psql.

## Quickstart

Assuming you've configured terraform and aws correctly (mainly just credentials), to deploy run the following two commands:

* `terraform apply`, and `yes` to the prompt
* `python ecr.py push`, which will build the services and push them to ecr

I don't think ecr reacts to new pushes, or at least not quickly, so the best way to deploy your changes to a service is to go to the tasks for that service cluster and stop them all, the cluster will then automatically restart the tasks with the new ecr image.

