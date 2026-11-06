import express  from "express";
import {Router} from "express";

const app = express();
const router = Router();

app.use(express.json())

router.get('/health',(req,res)=>{
    return res.status(200).json({status:"OK",message:"Taskhubly api is running"})

})

app.use("/api",router)


export default app;


