# Autostart Project

Here we'll set things up so it's easy for us to run scripts when the Raspberry Pi starts. This is useful so we don't need to manually set up the different services we use every single time we reboot. Instead we'll put them in a shell script. If you aren't familiar with shell scripts, check out [this intro guide](https://www.howtogeek.com/67469/the-beginners-guide-to-shell-scripting-the-basics/).

You can put the script anywhere but for this tutorial we'll assume it lives in `~/autostart.sh`.

We create the file, add execution permission, and open it on a text editor:

```sh
touch ~/autostart.sh
chmod +x ~/autostart.sh
gedit ~/autostart.sh
```

The following is a bash script that will log the current user (you can read more about the [#!/usr/bin/env bash](https://linuxize.com/post/bash-shebang/) and [set -euo pipefail](https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/) if you are interested):

```
#!/usr/bin/env bash

set -euo pipefail

echo "I am $USER"
exit 0
```

Let's run it! On your terminal type:

```sh
~/autostart.sh
```

It should autoput the following:

```sh
I am pi
```

This tells us the current user is named `pi` (the default on a Raspberry Pi). This is important because when we tell the Raspberry Pi to run a script on start, it would, by default, run it as root (you can read more about root, sudo and su [here](https://www.lifewire.com/what-is-sudo-2197466)). Instead, we'll want to tell it to run it as `pi`.

Let's now modify the `rc.local` file:

```sh
sudo gedit /etc/rc.local
```

`rc.local` already runs on start, so we'll tell it to call our file before it finishes. Towards the end of the file, before the "exit 0" line, add the following:

```sh
sudo -H -u pi bash -c '~/autostart.sh' &
```

Note the ampersand at the end, you can read more about it [here](https://bashitout.com/2013/05/18/Ampersands-on-the-command-line.html) but it basically tells the computer to run the command on the background. Also note the `-u pi` to tell it to run as `pi`, if you want to run it as a different user change it accordingly. You can also read more about the rest of the parameters on this [StackOverflow answer](https://askubuntu.com/a/294748).

And that's it, if you reboot now (`sudo reboot`) you'll see "I am pi" on the terminal for a split second, at the bottom of the screen, right before the GUI starts.

Now that we have a script that runs on start, we can add anything to it. So if we have a node server in, say, `~/projects/myproject/index.js` we could add the following to `autostart.sh` (before the `exit 0` line):

```sh
node ~/projects/myproject/index.js &
```

Note the `&` at the end. Since servers are meant to be long running processes we want to make sure we move them to the background so that we are able to run other scripts as well (otherwise it will only start the first one and hang until it terminates).

But what if we want to access the output of this server? One option is to redirect the output to a file (see [here](https://stackoverflow.com/questions/6207573/how-to-append-output-to-the-end-of-a-text-file) for more info). We can do:

```sh
node ~/projects/myproject/index.js >> ~/projects/myproject/log.txt &
```

This is getting fairly verbose, we can also **c**hange **d**irectory (with the `cd` command):

```sh
cd ~/projects/myproject
node index.js >> log.txt &
```

While we are in that folder, if it's an npm package, we can also call npm scripts, (assuming a `start` script that calls `index.js`) we could do something like:

```sh
cd ~/projects/myproject
npm start >> index.log &
```

And that's it! There are lots of instructions and new commands in this project, try things and explore!

## Extra credit

What if our server crashes but the computer keeps running? We can use [forever](https://www.npmjs.com/package/forever) to make sure our server is restarted automatically if it crashes. Once installed globally, we can call our scripts using forever:

```sh
forever start ~/projects/myproject/index.js &
```

Note that `forever` also can help us save the output of the commands into a file. For instance, we can do:

```sh
forever --append -o out.log -e err.log start
```
