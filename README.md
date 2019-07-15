# Classic Game Center

Electron app to serve as a hub for classic desktop apps.

# Building

Use `git clone https://github.com/tito21/game-center.git`. Then install all
the dependencies with `npm install`.

To run locally use `electron-forge start` and to build binaries use
`electron-forge make`.

# Adding new games

For games build using web technologies (HTML, CSS, JS) create a new folder
inside `games` and put all the sources there along with a `package.json` file
(see the `games` folder for examples) and rebuild. I am working on a better way.