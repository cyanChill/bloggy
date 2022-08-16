# cyanBlog

This is a project to practice the Jamstack. Here, we have a folder for the backend and folders for the frontend (for client and admin uses).

- Clients/users are able to post comments without signing up on public posts.
- Admins can add/update/delete posts (also unpublish them).
- Admins can also delete comments.

## Demos

### Blog (Client) Demo

https://user-images.githubusercontent.com/83375816/182513866-6a03ea31-dbfd-452f-8349-d639b94f3a03.mp4

### Blog (CMS) Demo

https://user-images.githubusercontent.com/83375816/182513880-1c648e0c-a7ad-462c-b67d-b66925f455c2.mp4

## Project Info

More about the project can be found at: https://www.theodinproject.com/lessons/nodejs-blog-api

# Installation & Setup

## Environment Variables

We utilize a couple of environment variables in the frontend and backend:

### Frontend

| Variable Name           | Value                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `REACT_APP_BACKEND_URL` | This contains the url to your backend server. For example: "http://localhost:5000" (make sure you don't have a "/" at the end.) |

### Backend

| Variable Name | Value                                           |
| ------------- | ----------------------------------------------- |
| `MONGO_URI`   | URI value to your MongoDB server.               |
| `SECRET_KEY`  | A string used to sign the JWT tokens.           |
| `PORT`        | This is the port number the server will run on. |

## Running App Locally

To run this app locally, while in the current directory in a terminal:

### First start by running the backend.

1. Go to the `backend` folder (ie: `cd backend`).
2. Run `npm run devstart` to run the backend app in development mode.

> To run the backend in production mode, run `npm start` and make sure the `NODE_ENV` variable is set to `production`.

> For deployment, you may have to change the `start` script as `cross-env` may not be utilized.

### Running the frontend

There are 2 "frontends", one being the client view, the other being the cms for admins. The general steps are the same:

1. Open another terminal while in the project directory (containing the `backend` and `frontend-client` & `frontend-cms` folders) and go to the "frontend" folder we want to use (ie: `cd frontend-*`).
2. Run `npm start` to start the app. Alternatively, you can build the app with `npm run build` and React will give you instructions on how to host the app in the `build` folder (that'll be created) using `serve`.
