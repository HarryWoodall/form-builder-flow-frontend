# Form builder flow

## Repositories

Frontend - https://github.com/HarryWoodall/form-builder-flow-frontend

Server - https://github.com/HarryWoodall/form-builder-flow-server

## Installation
Requires Node Version >18

### Frontend
``` bash
git clone git@github.com:HarryWoodall/form-builder-flow-frontend.git
cd form-builder-flow-frontend
npm i
```

### Server
``` bash
git clone git@github.com:HarryWoodall/form-builder-flow-server.git
cd form-builder-flow-server
npm i
```

create a `.env` file within form-builder-server the top level with the value `FORM_BUILDER_JSON_PATH=<ABSOLOUTE PATH FOR YOUR form-builder-json REPOSITORY>`

## Startup
From `form-builder-flow-frontend`

`npm run dev` will start the frontend.
`npm run devServer` will start both the frontend and the server (so long as they exist within the same folder)

## Technologies
### Frontend
 - [Svelte](https://svelte.dev/docs/introduction)
 - [Svelte Flow](https://svelteflow.dev/)
 - [Flowbite](https://flowbite-svelte.com/)
 - [Tailwind](https://tailwindcss.com/)
### Server
 - [Fastify](https://fastify.dev/)

## Architecture
### Frontend
At a high level, JSON data is pulled into the app state ready to be consumed by any views that need it. These views construct a series of page elements that will be placed on the canvas, visualizing the form in its current state. Menus and validators also use the centralized app state

![System Architecture](https://github.com/HarryWoodall/form-builder-flow-frontend/assets/20969276/a9167185-850c-44f6-89b3-571e1f6e3e27)

### Server
The server is used for handling data transforms such as reusable elements, lookups etc. If the server isn't running, the visualizer will just display the data it can get from the form json file. It is also used to save notes.

It also exposes a POST endpoint `/updateForm` that can be used to programmatically generate a flow on the frontend. Sending a request with a json form payload will trigger a rebuild of the visualization. This can be used to give real time updates while building a form.

## Know issues

 - Flow not updating when options change
 - Flow not updating when text change (P, h2, etc.)
 - Adding 'IsConditionalElement' doesn't update background color on element
 - Summary items not updating on update
 - Availability note updating between forms
 - Notes don't update correctly when pages are added/removed (They are index based, not id based)
 - Format on page load broken
 - Format will hide paths
 - Error messages for reusable elements sill display as undefined

## Features I wanted add
 - Validation for duplicate question ids
 - Add functionality for exclusive options within checkboxes - [Wiki](https://github.com/smbc-digital/form-builder/wiki/Checkbox)
 - Check if page is on FB DSL
 - Validation to ensure spellings (run content through a spell checker?)
