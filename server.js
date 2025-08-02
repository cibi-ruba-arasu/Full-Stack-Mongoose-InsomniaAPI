import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from './models/product.model.js';

const app = express();
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 5400;
const MONGODB_URI = process.env.MONGODB_URI;



app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/products', async (req, res) => {
    try {
        const Prod = await Product.create(req.body);
        res.status(201).json(Prod);
    } catch (error) {
        console.error("Error in POST /api/products:", error);
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const product = await Product.find();
        res.status(200).json(product);
    } catch (error) {
        console.error("Error in GET /api/products:", error);
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        console.error("Error in GET /api/products/:id:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findByIdAndUpdate(id, req.body);
        
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);

    } catch (error) {
        console.error("Error in PUT /api/products/:id:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error(`Error in DELETE /api/products/:id:`, error);
    }
});

mongoose.connect(MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, ()=>{
    console.log(`site running at port : http://localhost:${PORT}`);
});
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});