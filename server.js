if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const helmet = require('helmet');

const app = express();

// Ejs setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// helmet init and setup
app.use(helmet());

const scriptSrcUrls = [
  "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
  "https://fonts.googleapis.com/",
  "https://cdn.jsdelivr.net",
];

const connectSrcUrls = [
  "https://use.fontawesome.com/"
];

const fontSrcUrls = [
  "https://cdn.jsdelivr.net",
  "https://fonts.gstatic.com"
];

app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: ["'self'", "https://ka-f.fontawesome.com",],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

app.get('/', (req, res) => {
  res.render('index');
})

// Error handler for unknown url
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

//Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});