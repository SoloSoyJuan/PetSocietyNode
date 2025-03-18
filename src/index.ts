import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import { db } from './lib/connectionDB';
import { petsRouter, userRouter, appointmentRouter } from './routes';

// Load environment variables
dotenv.config();
const app: Express = express();
const port: number =  process.env.PORT as any || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req: Request, res: Response)=>{
    res.send("Hello world!!");
});

// error
app.get('/error',(req: Request, res: Response)=>{
    res.status(500).send("Hello world!!");
});

// not found
app.get('/notfound',(req: Request, res: Response)=>{
    res.status(404).send("Hello world!!");
});

// Routes

app.use("/users", userRouter);
app.use("/pets", petsRouter);
//app.use("/medical-records", medicalRecordRouter);
app.use("/appointments", appointmentRouter);


db.then( ()=>{
    app.listen(port, ()=>{
        console.log(`server is running on port: ${port}`);
    });
    
});