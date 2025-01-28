const express = require("express");
const app = express();
const PORT = 5000;
const carData = require("./MOCK_DATA.json");  // Mock data file containing car details
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLID, GraphQLInt, GraphQLString } = graphql;
const { graphqlHTTP } = require("express-graphql");

// Define the Car Type
const CarType = new GraphQLObjectType({
  name: "Car",
  fields: () => ({
    id: { type: GraphQLInt },
    make: { type: GraphQLString },
    model: { type: GraphQLString },
    year: { type: GraphQLInt },
    color: { type: GraphQLString },
    price: { type: GraphQLInt },
  }),
});

// Define the Root Query for fetching car data
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllCars: {
      type: new GraphQLList(CarType),
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        // If an id is passed in args, return that specific car
        if (args.id) {
          return carData.filter((car) => car.id === args.id);
        }
        return carData; // return all cars if no id is provided
      },
    },
    findCarById: {
      type: CarType,
      description: "Fetch single car by ID",
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return carData.find((car) => car.id === args.id);
      },
    },
    findCarByMake: {
      type: new GraphQLList(CarType),
      description: "Fetch cars by make",
      args: { make: { type: GraphQLString } },
      resolve(parent, args) {
        return carData.filter((car) => car.make === args.make);
      },
    },
    findCarByModel: {
      type: CarType,
      description: "Fetch single car by model",
      args: { model: { type: GraphQLString } },
      resolve(parent, args) {
        return carData.find((car) => car.model === args.model);
      },
    },
  },
});

// Define Mutation (for example, adding a new car)
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createCar: {
      type: CarType,
      args: {
        make: { type: GraphQLString },
        model: { type: GraphQLString },
        year: { type: GraphQLInt },
        color: { type: GraphQLString },
        price: { type: GraphQLInt },
      },
      resolve(parent, args) {
        // Simulate adding a car to the database (mock)
        const newCar = {
          id: carData.length + 1,
          make: args.make,
          model: args.model,
          year: args.year,
          color: args.color,
          price: args.price,
        };
        carData.push(newCar);  // Adding to mock data
        return newCar;
      },
    },
  },
});

// Create the GraphQL Schema
const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

// Set up GraphQL HTTP endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true, // Enable GraphiQL interface for testing queries
  })
);

// Set up REST API endpoint to fetch all cars
app.get("/rest/getAllCars", (req, res) => {
  res.send(carData);  // Return the mock car data
});

// Set up a simple route (could be your homepage or static page)
app.get("/", (req, res) => {
  res.send("Welcome to the Car Inventory API");
});

// Start the server on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
