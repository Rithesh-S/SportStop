const { connectToDatabase } = require('../utils/db')
const { timeStampGenerator } = require('../utils/timeStamp')
const { generateId } = require('../utils/idGenerator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const SECRET_KEY = process.env.SECRET_KEY
const dataBase = process.env.DATABASE
const users = "Users"
const sales = "Sales"
const store = "Items"

async function login(req, res) {
    const client = await connectToDatabase()
    const { username, password } = req.body
    try {
        const collection = client.db(dataBase).collection(users)
        const document = await collection.findOne({ mobile_number: username })
        if (!document || !await bcrypt.compare(password, document.password)) 
            return res.status(401).json()
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' })
            res.status(200).json({ token, userid: document.userid })
    } 
    catch(err) {
        console.error(err)
        res.status(500).json()
    }
    finally {
        client.close()
        console.log("Disconnected")
    }
}

async function register(req, res) {
    const client = await connectToDatabase()
    const { mobile ,password } = req.body
    try {
        const collection = client.db(dataBase).collection(users)
        const document = await collection.findOne({ mobile_number: mobile })
        if(!document) {
            const userId = generateId()
            const hashedPassword = await bcrypt.hash(password.toString(), 10);
            const timestamp = timeStampGenerator()
            const userData = { 
                userid: userId, mobile_number: mobile, 
                password: hashedPassword, timestamp: timestamp, cart:[] 
            }
            const result = await collection.insertOne(userData)
            if(result) {
                res.status(201).json({userId})
            } else {
                res.status(404).json()
            }
        } else {
            res.status(401).json()
        }
    } 
    catch(err) {
        console.error(err)
        res.status(500).json()
    }
    finally {
        client.close()
        console.log("Disconnected")
    }
}

async function getStore(req, res) {
    const client = await connectToDatabase();
    const category = req.params.category
    const userId = req.query.userid
    try {
        const collection = client.db(dataBase).collection(store)
        let data = undefined
        if (category) {
            data = await collection.find({ category: category }).toArray()
        } 
        else if (userId) {
            const usersCollection = client.db(dataBase).collection(users) 
            const user = await usersCollection.findOne({ userid: userId })
            if (user && user.cart?.length > 0) {
                const productIds = user.cart
                data = await collection.find({ id: { $in: productIds } }).toArray()
            } else {
                return res.status(404).json({ message: "Cart is empty or user not found" })
            }
        } 
        else {
            data = await collection.find({}).toArray();
        }

        if (data) {
            res.status(200).json({ items: data });
        } else {
            res.status(404).json();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json();
    } finally {
        client.close();
        console.log("Disconnected");
    }
}

async function updateStore(req, res) {
    const client = await connectToDatabase();
    const id = parseInt(req.params.id);
    const quantityToReduce = req.body.quantity; 
    try {
        const collection = client.db(dataBase).collection(store);

        let data = await collection.findOneAndUpdate(
            { id: id, quantity: { $gte: quantityToReduce } },
            { $inc: { quantity: -quantityToReduce } },         
            { returnOriginal: false } 
        );
        if (data) {
            res.status(200).json({ message: 'Quantity updated successfully'});
        } else {
            res.status(404).json({ message: 'Product not found or insufficient stock' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.close();
        console.log("Disconnected");
    }
}


async function addToCart(req, res) {
    const client = await connectToDatabase()
    const id = parseInt(req.params.id)
    const userId = req.body.userid
    try {
        const collection = client.db(dataBase).collection(users)
        let data = await collection.updateOne(
                        { userid: userId }, 
                        { $push: { cart: id } },
                        { upsert:true }
                    );
        if(data) {
            res.status(200).json({})
        }
        else {
            res.status(404).json({})
        }
    } 
    catch(err) {
        console.error(err)
        res.status(500).json()
    }
    finally {
        client.close()
        console.log("Disconnected")
    }
}

async function deleteFromCart(req, res) {
    const client = await connectToDatabase()
    const id = parseInt(req.params.id)
    const userId = req.body.userid
    try {
        const collection = client.db(dataBase).collection(users)
        let data = await collection.updateOne(
                        { userid: userId },            
                        { $pull: { cart: id } }   
                    );
        if(data) {
            res.status(200).json({})
        }
        else {
            res.status(404).json({})
        }
    } 
    catch(err) {
        console.error(err)
        res.status(500).json()
    }
    finally {
        client.close()
        console.log("Disconnected")
    }
}

async function getSales(req, res) {
    const client = await connectToDatabase()
    try {
        const collection = client.db(dataBase).collection(sales)
        let data = await collection.find({}).toArray()
        if(data) {
            res.status(200).json({data})
        }
        else {
            res.status(404).json({})
        }
    } 
    catch(err) {
        console.error(err)
        res.status(500).json()
    }
    finally {
        client.close()
        console.log("Disconnected")
    }
}

async function addSales(req, res) {
    const client = await connectToDatabase();
    const { id, brand, name, quantity } = req.body;
    try {
        const collection = client.db(dataBase).collection(sales);
        let data = await collection.updateOne(
            { productId: id },  
            { 
                $inc: { count: quantity }  
            }
        );
        if (data.modifiedCount === 0) {
            await collection.insertOne({
                productId: id, 
                name: name, 
                brand: brand, 
                count: quantity
            });
        }
        res.status(200).json({ message: "Product updated successfully" });
    } 
    catch(err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    } 
    finally {
        client.close();
        console.log("Disconnected");
    }
}


module.exports = {
    login,
    register,
    getStore,
    updateStore,
    addToCart,
    deleteFromCart,
    addSales,
    getSales,
}
