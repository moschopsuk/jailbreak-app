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

**Aditional Prerequisites**
A nodejs plugin may not install correctly if libkrb5 can't be found on the system

```bash
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu precise/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list

apt-get update

apt-get install libkrb5-dev mongodb-org
```

##Getting Started

```bash
git clone git@github.com:moschopsuk/jailbreak-app.git
cd jailbreak-app
npm install
```

##Development

After installing all of the dependencies the following command will run the core tasks to build the public assets.

`gulp`

##Running

A development server can be started by running the command. Todo find some way of reloading the browser when file chnages are also made.

`npm start`
