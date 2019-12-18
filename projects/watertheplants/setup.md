# Setup Description

Using a wake word from the Raspberry Pi server we'll start a pump connected to our Espruino Wifi. We'll also want to bake in a way to track when was the last time we activated it to avoid watering the plants too much.

## Setting up the Database

We'll use MongoDB to store logs so that when the server crashes or restarts we don't loose previous information.

By default Mongo uses the `/data/db` path to store the contents of the database. We have several options here.

We can either:

- create the directory and give sudo permissions for read and write: `sudo mkdir -p /data/db && sudo chmod -R go+w /data/db`
- create the directory and assign current user as the owner: `sudo mkdir -p /data/db && sudo chown -R $USER /data/db`
- change the directory where we'll store the db (when starting `mongo` we'll instead call it with a custom path, e.g.: `mongo --dbpath=./src/db/data`)

On a Mac we can install MongoDB with:

```sh
brew services stop mongodb
brew uninstall mongodb

brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

On the Raspberry Pi we can install it with:

```sh
sudo apt-get update && sudo apt-get install  -y mongodb
```

Let's check the connection to make sure things are running as expected:

```sh
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```

If there are any errors you can try with `mongod --repair`, that will give you more information if there are any errors.

Once fixed, on Ubuntu you can restart the deamon with: `sudo service mongod start`

## Setting up the server

To make it easier to start Mongo, the `water/package.json` has a `db` script that calls it making sure a local folder is used but it still requires mongo to be installed globally.

The next step is to set up the actual server. Here we won't use anything new but we'll instead be integrating everything we've learned in the past projects:

- Express server
- MQTT Pub / Sub connection
- Permanent / DB storage
- Voice recognition

You can implement this any way you want but there's a sample server on the `water/server` folder.

The `events.js` file manages events so all other sections can fire events and the top level `index.js` logs them when they occur:

[](./server.png)

- The `db` folder exports a method to add a log (`insertLog`) and one to retrieve the last 100 (`readLogs`).
- The `express` folder creates an endpoint `/logs` at port 3001 that returns the results of the previous `readLogs`.
- The `detector` folder starts the microphone and listens for the `jarvis` keyword. If `jarvis` is set it then listens for the word `water`. This helps prevent accidental activations any time the word water is used unrelated to this command. It also enables sentences like "Hey Jarvis, water the plants".
- The `mqtt` folder connects to the espruino board and publishes the event to trigger the water pump
- The top level file (`index.js`), tracks and logs all events and connects the `water` command from the detector to the `mqtt` trigger.

If you now add a `server` script on `package.json`, we would first call `npm run db` in one terminal and `npm run server` in another.

## Setting up the client

Install or update [create react app](https://github.com/facebook/create-react-app) with: `npm i -g create-react-app`. We can now create a new client: `create-react-app client`. This will create a `client` folder that we'll be able to call from any device connected to the same wifi network.

Here we can go as crazy as we want with the frontend. The included app just shows the results of the `/logs` query but you can add as many API calls as you want and modify the frontend accordingly. The only thing to keep in mind is that we'll want to set up the [proxy prop](https://create-react-app.dev/docs/proxying-api-requests-in-development/) in the `package.json` to match the URL of the express server. In our example client (`water/client/package.json`) you can see `"proxy": "http://localhost:3001"` so that all endpoints exposed by it will be available directly on the react app. For instance, the `/logs` endpoint also becomes available under `/logs`. Because of this, and to avoid conflicts with potential routes, you may want to prefix all API routes with `/api`.

If you have an old phone or tablet, you can [disable autolock](https://itstillworks.com/stop-iphone-sleeping-25832.html) and have it always connected to a power source and showing that page. That will make for a quick dashboard.

## Setting up the Espruino

The Espruino setup will need to connect to the Wifi and same channel than the MQTT server for the Raspberry Pi was setting up, much like we did for the push-a-button project.

To make sure the set up is working, let's first turn on the internal LED1 light when the MQTT call is triggered:

```js
// TODO: add Espruino code sample
```

Once it's wired, let's now change the code to turn on the water pump and water the plants:

```js
// show the change here
```

TODO Add image with the completed circuit

## Extra credit

What if we want to water the plants from outside the house? We want to be really careful any time we expose
