# Tagore 

Tagore is a project that aims to explore the capabilities of generative AI through a user-friendly webapp. With the help of various API clients, Tagore offers its users the ability to generate text and images using AI algorithms.

The platform is designed to be user-friendly, with intuitive UI making it easy for users to navigate and generate content. Not only does Tagore allow generative text and images, but it also includes chat options, making it an innovative tool for people who enjoy experimenting with technology and AI.

## Command to start the project 
```docker-compose up```

## How to add new models to the project?
- Add a json at `./server/modelData` having configuration to connect to the generative AI API you want to connect

- Implement the methods defined in `./internal/infrastructure/generative_model/service.go` based on what services your model provides. 

