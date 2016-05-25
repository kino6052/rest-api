# rest-api
## REST API Base for Projects

## Overview

The intent of this repository was to create a REST API that can be used for customization and creation of personal Web Apps.
This project utilizes best practices including, but not limited to, jwt authentication, developer-friendly route patterns and modularity.
The backend for this project is MongoLab, which makes it easy to test the applications you develop and provides great GUI for analyzing data.

## Authentication
This project utilizes basic jwt authentication. In order to register a user, use `POST` request to `/api/setup` with url encoded body parameters `name` and `password`. After this step you should receive a jwt token, that should be included inside of the `x-access-token` header.

## User Endpoints
### Create User (jwt Protected)
`POST https:\\[base-url]\api\createUser`

| Parameter     | Description                                      |
| ------------- |:------------------------------------------------ |
| **name**      | Username to be created                           |
| **password**  | Password to be associated with the username      |

### Remove User (jwt Protected)
`DELETE https:\\[base-url]\api\removeUser`

| Parameter           | Description                                      |
| ------------------- |:------------------------------------------------ |
| **userToBeRemoved** | Username of the user to be removed               |

##Task Endpoints
### Get List of Tasks (jwt Protected)
`GET https:\\[base-url]\api\[username]\tasks`

### Add a Task (jwt Protected)
`PUT https:\\[base-url]\api\[username]\addTask`

| Parameter           | Description                                      |
| ------------------- |:------------------------------------------------ |
| **task**            | Name of the task                                 |

### Remove a Task (jwt Protected)
`DELETE https:\\[base-url]\api\[username]\removeTask`

| Parameter           | Description                                      |
| ------------------- |:------------------------------------------------ |
| **task**            | Name of the task                                 |

### Complete a Task (jwt Protected)
`PUT https:\\[base-url]\api\[username]\completeTask`

| Parameter           | Description                                      |
| ------------------- |:------------------------------------------------ |
| **task**            | Name of the task                                 |

### Uncomplete a Task (jwt Protected)
`PUT https:\\[base-url]\api\[username]\uncompleteTask`

| Parameter           | Description                                      |
| ------------------- |:------------------------------------------------ |
| **task**            | Name of the task                                 |
