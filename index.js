const http = require('http');
const { URL } = require('url');

let products = [
    { id: 1, name: "Product 1", price: 100, color: "red", brend: "samsung" },
    { id: 2, name: "Product 2", price: 150, color: "blue", brend: "apple" },
    { id: 3, name: "Product 3", price: 200, color: "black", brend: "xiaomi" },
    { id: 4, name: "Product 4", price: 250, color: "white", brend: "oppo" },
    { id: 5, name: "Product 5", price: 300, color: "green", brend: "vivo" },
    { id: 6, name: "Product 6", price: 120, color: "gray", brend: "samsung" },
    { id: 7, name: "Product 7", price: 170, color: "blue", brend: "apple" },
    { id: 8, name: "Product 8", price: 220, color: "black", brend: "xiaomi" },
    { id: 9, name: "Product 9", price: 270, color: "white", brend: "oppo" },
    { id: 10, name: "Product 10", price: 320, color: "green", brend: "vivo" },
    { id: 11, name: "Product 11", price: 130, color: "red", brend: "samsung" },
    { id: 12, name: "Product 12", price: 180, color: "blue", brend: "apple" },
    { id: 13, name: "Product 13", price: 230, color: "black", brend: "xiaomi" },
    { id: 14, name: "Product 14", price: 280, color: "white", brend: "oppo" },
    { id: 15, name: "Product 15", price: 330, color: "green", brend: "vivo" },
    { id: 16, name: "Product 16", price: 140, color: "gray", brend: "samsung" },
    { id: 17, name: "Product 17", price: 190, color: "blue", brend: "apple" },
    { id: 18, name: "Product 18", price: 240, color: "black", brend: "xiaomi" },
    { id: 19, name: "Product 19", price: 290, color: "white", brend: "oppo" },
    { id: 20, name: "Product 20", price: 340, color: "green", brend: "vivo" }
];

const users = [
    { id: 1, name: "Qobilbek Qahharov", age: 15, username: "qobil", password: "1234" },
    { id: 2, name: "Ali Valiyev", age: 18, username: "ali18", password: "ali123" },
    { id: 3, name: "Dilnoza Karimova", age: 17, username: "dilnoza", password: "dil123" },
    { id: 4, name: "Rustam Toshpulatov", age: 16, username: "rustam", password: "pass123" },
    { id: 5, name: "Madina Usmonova", age: 19, username: "madina", password: "madina456" }
];

const serverr = http.createServer((req, res) => {
    let method = req.method;
    let neew = new URL(req.url, `http://${req.headers.host}`);
    let url = neew.pathname;
    let color = neew.searchParams.get("color");
    let brend = neew.searchParams.get("brend");

    if (url == "/products" && method == "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        let filter = products.filter(p => {
            if (color && brend) return p.color === color && p.brend == brend;
            if (color) return p.color === color;
            if (brend) return p.brend == brend;
            return true;
        });
        res.end(JSON.stringify(filter));

    } else if (url.startsWith("/products") && method == "PUT") {
        let id = parseInt(url.split("/")[2]);
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            let update = JSON.parse(body);
            let index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...update };
                res.end(JSON.stringify(products[index]));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: "Product not found" }));
            }
        });
    } else if (url.startsWith("/products/") && method == "DELETE") {
        let id = parseInt(url.split("/")[2]);
        let index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            let deleted = products.splice(index, 1)[0];
            res.end(JSON.stringify(deleted));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Product not found" }));
        }
    } else if (url == "/register" && method == "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const newUser = JSON.parse(body);
                newUser.id = users.length + 1;
                users.push(newUser);
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "User registered", user: newUser }));
            } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: "Yaroqsiz JSON yuborildi", error: err.message }));
            }
        });
    } else if (url === "/login" && method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const { username, password } = JSON.parse(body);
                const user = users.find(u => u.username == username && u.password == password);
                if (user) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Login successful", user }));
                } else {
                    res.statusCode = 401;
                    res.end(JSON.stringify({ message: "Invalid credentials" }));
                }
            } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: "Yuborilgan ma'lumot noto'g'ri JSON formatda", error: err.message }));
            }
        })
    }

});

serverr.listen(3000, () => {
    console.log("Server 3000-portda ishladi");
})