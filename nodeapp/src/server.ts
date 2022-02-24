import express from "express";
import { createConnection } from 'typeorm';
import config from './typeorm.config';
import routerWeather from './routes/v1/weather.route';
import routerBlogs from './routes/v1/blogs.route';
import routerProjects from './routes/v1/projects.route';
import routerNews from './routes/v1/news.route';
import routerBooks from './routes/v1/books.route';
import routerProducts from './routes/v1/products.route';
import { HandleAllapi, HandleAllGETrequets, HandleAllOtherRequets, errorHandlingMiddleware } from './middlewares/error.middleware';


export class Server {

    public express: any = null;

    constructor( ) {
        console.log(`Initializing application...`);
        this.express = express( );
        this.registerMiddlewares();
        this.registerRoutes();
        this.registerErrorHandlers();  
    }

    public async initializeDatabase( ) {
        try {
            await createConnection(config);
            console.log(`Database connected!`);
        } catch( error ) {
            console.log(`Database connection failed : `, error);
            throw error;
        }
    }

    private registerMiddlewares( ) {
        this.express.use( express.json() );
    }

    private registerRoutes( ) {
        this.express.use(`/api/v1/blogs`, routerBlogs)
        this.express.use( `/api/v1/projects`, routerProjects);
        this.express.use( `/api/v1/weather`, routerWeather); 
        this.express.use( `/api/v1/news`, routerNews);
        this.express.use( `/api/v1/books`, routerBooks);
        this.express.use( `/api/v1/products`, routerProducts);
    }
  
    private registerErrorHandlers() {
        // Handle all API's (not handled by routes)
        this.express.all( '/api/*', HandleAllapi);
        // Handle all GET requets not handled by Routes
        this.express.get( '*', HandleAllGETrequets);
        // Handle all other (POST, PATCH, DELETE) requets not handled by Routes
        this.express.all( '*', HandleAllOtherRequets);
        // Global Error Handler
        this.express.use(errorHandlingMiddleware);
    }

    public listen( port: number ) {
        this.express.listen(port, () => {
            console.log(`Server running at ${port}....`)
        })
    }
}
