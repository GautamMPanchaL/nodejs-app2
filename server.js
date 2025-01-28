const express = require("express");
const app = express();
const PORT = 8000;
const userData = require("./MOCK_DATA.json");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLID, GraphQLInt, GraphQLString } = graphql;
const { graphqlHTTP } = require("express-graphql");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        // If an id is passed in args, return that specific user
        if (args.id) {
          return userData.filter((user) => user.id === args.id);
        }
        return userData; // return all users if no id is provided
      },
    },
    findUserById: {
      type: UserType,
      description: "Fetch single user by ID",
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return userData.find((a) => a.id === args.id);
      },
    },
    findUserByEmail: {
      type: UserType,
      description: "Fetch single user by email",
      args: { email: { type: GraphQLString } },
      resolve(parent, args) {
        return userData.find((a) => a.email === args.email);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        userData.push({
          id: userData.length + 1,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          password: args.password,
        });
        return args;
      },
    },
  },
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.get("/rest/getAllUsers", (req, res) => {
  res.send(userData);
});

app.get("/", (req, res)=>{
    res.sendFile(page.html);
})

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
