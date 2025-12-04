const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;

const app = express();


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get("/", async (req, res) => {
    try {
        const ipRes = await fetch("https://api.ipify.org/?format=json");
        const ipData = await ipRes.json();
        const myIp = ipData.ip;

        const geoRes = await fetch(`http://ip-api.com/json/${myIp}`);
        const geoData = await geoRes.json();
        const countryCode = geoData.countryCode;

        // console.log("IP:", myIp, "countryCode:", countryCode);
        if (countryCode === "BD") {
            res.sendFile(path.join(__dirname, "public", "index.html"));
        } else {
            res.send("You are not visiting from Bangladesh.");
        }

        // res.json({ ip: myIp, country: myCountry });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }

});

app.get("/api/ip", async (req, res) => {
    try {
        const userIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
        console.log(userIp);
        const geoRes = await fetch(`http://ip-api.com/json/${userIp}`);
        const geoData = await geoRes.json();
        res.json(geoData);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});


app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
