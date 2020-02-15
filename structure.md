structure
=========
  This file tries to give an overview of the project's structure.

config_example / config
-----------------------
  Contains all configuration files, which are in ([hjson.org] .hjson format).
  See main README for recommended usage.
  * index.hjson - Main configuration file. Can contain all information, but
                  settings can also be split out into separate files.
  * defaults/ - Contains values that are created by default in the database.

src
---
  Contains source code files and is neither intended, nor required to be
  modified by users. It contains:

  * api/ - Routing information for the REST API, processed by router.js.
  * models/ - Information for the database models, processed by db.js.
  * pages/ - Frontend pages. Their routes are given by folder paths. (router.js)
  * static/ - Static content, such as images, media and css files.
  * views/ - Dynamically parsed site skeletons for the frontend, written in pug.
  * .js files
    - config.js
      * Handles reading of all configs in the config folder.
    - db.js
      * Sets up the database connection by setting up a `sequelize` instance.
      * Recursively creates models from the models folder.
      * Creates default values as defined under /config/defaults.
    - global.js
      * Sets up global variables that are accessible from anywhere in the code.
    - logging.js
      * Simple logger, offers prompt, indenting, and priority levels.
    - main.js
      * Starting point that calls the other .js files in order.
    - router.js
      * Configures `express`, a module used for routing. Sets up routes for the
        API, dynamic pages, static content, favicon and 404 sites.
    - server.js
      * Starts the server, using the bindings set up by router.js.
      
init.js
-------
Starts the server via main.js. Use with `node init`.
