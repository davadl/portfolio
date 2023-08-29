const express = require("express");
const basicAuth = require("basic-auth");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));

const checkAuth = (req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== "admin" || user.pass !== "password") {
    res.set("WWW-Authenticate", 'Basic realm="Enter password"');
    return res.status(401).send();
  }
  return next();
};

app.get("/upload", checkAuth, (req, res) => {
  fs.readFile("gallery.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.send("Error");
    }
    const images = data.match(/https?:\/\/[^"']+/g) || [];
    res.send(`
      <html>
      <head>
        <title>Upload Image</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <style>
          .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            grid-gap: 10px;
            max-width: 800px; /* Adjust this value to change the total width of the image grid */
          }
          .image-grid img {
            width: 100%;
            height: auto;
          }
          .remove-button {
            position: absolute;
            right: 10px;
            top: 10px;
          }
          .return-to-home {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <form action="/add-image" method="post">
            <label for="url">Image URL:</label><br>
            <input type="text" id="url" name="url"><br>
            <input type="submit" value="Submit">
          </form>
          <div class="image-grid">
            ${images
              .map(
                (url) =>
                  `<div style="position:relative;"><img src="${url}" onclick="openPopup(this)" data-description="Image Description"></div>`
              )
              .join("")}
          </div>
        </div>
        <a href="/" class="return-to-home">Return to Home</a>
        <div class="modal fade" id="imageModal" tabindex="-1" role="dialog" aria-labelledby="imageModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-body">
                <img src="" alt="">
                <p id="imageDescription"></p>
              </div>
            </div>
          </div>
        </div>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
        <script>
          $('#imageModal').on('show.bs.modal', function (event) {
            var img = $(event.relatedTarget);
            var src = img.attr('src');
            var description = img.data('description');

            var modal = $(this);
            modal.find('.modal-body img').attr('src', src);

            // Check if the image has a description
            if (description) {
              modal.find('.modal-body #imageDescription').text(description);
            } else {
              modal.find('.modal-body #imageDescription').text('No description available');
            }
          });

          function attachEventListeners() {
            const removeButtons = document.querySelectorAll('.remove-button');
            removeButtons.forEach(button => {
              button.addEventListener('click', function (event) {
                event.preventDefault();
                fetch('/remove-image', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ url: this.dataset.url }),
                })
                  .then(response => response.text())
                  .then(data => {
                    if (data === 'Success') {
                      this.parentElement.remove();
                    } else {
                      alert('Error');
                    }
                  });
              });
            });
          }

          // Attach event listeners after the page is loaded
          document.addEventListener('DOMContentLoaded', attachEventListeners);
        </script>
      </body>
      </html>
    `);
  });
});

app.post("/add-image", checkAuth, (req, res) => {
  const url = req.body.url;
  fs.readFile("gallery.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.send("Error");
    }
    const position = data.indexOf("</div>");
    const output = [
      data.slice(0, position),
      `<div style="position:relative;"><img src="${url}" onclick="openPopup(this)" data-description="Image Description"><button class="remove-button" data-url="${url}">x</button></div>`,
      data.slice(position),
    ].join("");
    fs.writeFile("gallery.html", output, "utf8", (err) => {
      if (err) {
        console.error(err);
        return res.send("Error");
      }
      return res.send("Success");
    });
  });
});

app.post("/remove-image", checkAuth, bodyParser.json(), (req, res) => {
  const url = req.body.url;
  fs.readFile("gallery.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.send("Error");
    }
    const output = data.replace(
      `<div style="position:relative;"><img src="${url}" onclick="openPopup(this)" data-description="Image Description"><button class="remove-button" data-url="${url}">x</button></div>`,
      ""
    );
    fs.writeFile("gallery.html", output, "utf8", (err) => {
      if (err) {
        console.error(err);
        return res.send("Error");
      }
      return res.send("Success");
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
