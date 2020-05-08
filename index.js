const express = require("express");
const shortid = require("shortid");
const server = express();
server.use(express.json());
let users = [];
server.post("/api/users", (req, res) => {
  const user = req.body;
  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  user.id = shortid.generate();
  users.push(user);
  if (!users.find((newUser) => newUser.id === user.id)) {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
  res.status(201).json({ message: `successfully posted user ${user.name}` });
});
server.get("/api/users", (req, res) => {
  //return an array of all users
  if (users.length > 0) {
    res.status(200).json(users);
  } else if (users.length === 0) {
    res.status(501).json({ errorMessage: "No users on server." });
  } else {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  }
});
server.get("/api/users/:id", (req, res) => {
  //return user object using ID
  const id = req.params.id;
  const idIndex = users.findIndex((user) => user.id === id);
  if (idIndex === -1) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  }
  if (!users[idIndex]) {
    res
      .status(500)
      .json({ message: "The user information could not be retrieved." });
  }
  res.status(200).json(users[idIndex]);
});
server.delete("/api/users/:id", (req, res) => {
  //return user object using ID
  const { id } = req.params;
  const found = users.find((user) => user.id === id);
  if (found) {
    users = users.filter((user) => {
      user.id === id;
    });
    res.status(200).json(found);
  } else if (!found) {
    res.status(404).json({ message: "user not found, friend" });
  } else {
    res.status(500).json({ errorMessage: "The user could not be removed" });
  }
});
server.patch("/api/users/:id", (req, res) => {
  //return user object using ID
  const { id } = req.params;
  const changes = req.body;
  const idIndex = users.findIndex((user) => user.id === id);
  if (idIndex === -1) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  }
  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
  changes.id = users[idIndex].id;
  users[idIndex] = changes;
  if (users[idIndex] === changes) {
    res.status(200).json(users);
  } else {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be modified." });
  }
});
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
