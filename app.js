const mongoose = require('mongoose');

const express = require('express');
const app = express();

const passport = require('passport');

const path = require('path');

const port = process.env.PORT || 5000;

const server = http.listen(port, () => console.log(`Server is running on port ${port}`));