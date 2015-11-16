JailBreak App
----

This is currently a WIP repo for a jailbreak application for tracking the progress of students away from Lancaster University Jailbreak challenge.

### Project goals
- Allow the safe and accurate tracking of the students progress as they try and get as far away from the university as possible
- Make the task of tracking students easier for the Jailbreak staff.
- Provide LA1TV with an interactive screen for an easier showing of the progress of the students

##Prerequisites
- **Node / npm**
- **REthinkDB**
- **Imagemagick**

##Getting Started
I recommend install these nodeJS modules globally
```bash
npm install -g bower
npm install -g gulp
npm install -g pm2
```

When ready to build these commands can be ran
```bash
git clone git@github.com:moschopsuk/jailbreak-app.git
cd jailbreak-app
npm install
bower install
gulp
```

Please look at the .env example and change the values to fit your needs, you will need to reanme the file to .env to get the application started.
```bash
mv .env.example .env
```

##Development

After installing all of the dependencies the following command will run the core tasks to build the public assets.

`gulp`

##Running

A development server can be started by running the command. Todo find some way of reloading the browser when file chnages are also made.

`pm2 start app.js`
