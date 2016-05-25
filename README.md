# rest-api
## REST API Base for Projects

## Overview

The intent of this repository was to create a REST API that can be used for customization and creation of personal Web Apps.
This project utilizes best practices including, but not limited to, jwt authentication, developer-friendly route patterns and modularity.
The backend for this project is MongoLab, which makes it easy to test the applications you develop and provides great GUI for analyzing data.

## Authentication
rest-api Project Utilizes basic jwt authentication. In order to register a user, use POST request to /api/setup with url encoded body parameters `name` and `password`. After this step you should receive a jwt token, that should be included inside of the `x-access-token` header.

## Endpoints
### Create User (jwt Protected)
`POST https:\\[base-url]\api\createUser`
| Parameter     | Description   |
| ------------- |:-------------:|
| name          | Username to be created      |
| password      | Password to be associated with the username      |
