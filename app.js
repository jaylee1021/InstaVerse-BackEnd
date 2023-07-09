require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const cors = require('cors');

const app = express();

app.use(methodOverride('_method'));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to InstaVerse Backend' });
});





const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server connected to PORT :${PORT}`);
});

module.exports = app;