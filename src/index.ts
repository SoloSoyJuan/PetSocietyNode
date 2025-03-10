import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const app: Express = express();
const port: number =  process.env.PORT as any || 4000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req: Request, res: Response)=>{
    res.send("Hello world!!");
});

// pagina de error
app.get('/error',(req: Request, res: Response)=>{
    res.status(500).send("Hello world!!");
});

// pagina de not found
app.get('/notfound',(req: Request, res: Response)=>{
    res.status(404).send("Hello world!!");
});


app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`);
})