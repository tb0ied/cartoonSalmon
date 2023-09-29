// Store the min/max hourly customers, and the average cookies per customer, in object properties.
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const hours = [
  "6am",
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
];

function headerRow() {
  const table = document.getElementById("table");
  const headerRow = document.createElement("tr");
  const blankTh = document.createElement("th");
  table.appendChild(headerRow);
  headerRow.appendChild(blankTh);

  for (let i = 0; i < hours.length; i++) {
    const th = document.createElement("th");
    th.textContent = `${hours[i]}`;
    headerRow.appendChild(th);
  }

  const th = document.createElement("th");
  th.textContent = "Daily Location Total";
  headerRow.appendChild(th);
}

const span = (text, index) => {
  const node = document.createElement("span");
  node.textContent = text;
  node.style.setProperty("--index", index);
  return node;
};

const byLetter = (text) => [...text].map(span);

const { matches: motionOK } = window.matchMedia(
  "(prefers-reduced-motion: no-preference)"
);

if (motionOK) {
  const splitTargets = document.querySelectorAll("[split-by]");
  splitTargets.forEach((node) => {
    let nodes = byLetter(node.innerText);
    if (nodes) node.firstChild.replaceWith(...nodes);
  });
}

function City(location, minCust, maxCust, avgSale) {
  this.location = location;
  this.minCust = minCust;
  this.maxCust = maxCust;
  this.avgSale = avgSale;
  this.custPerHour = [];
  this.cookiePerHour = [];
  this.totalSold = 0;
}

const cities = [
  new City("Seattle", 23, 65, 6.3, [], [], 0),
  new City("Tokyo", 3, 24, 1.2, [], [], 0),
  new City("Dubai", 11, 38, 3.7, [], [], 0),
  new City("Paris", 20, 38, 2.3, [], [], 0),
  new City("Lima", 2, 16, 4.6, [], [], 0),
];

City.prototype.calcSales = function () {
  for (let i = 0; i < hours.length; i++) {
    const randNum = randomNumber(this.minCust, this.maxCust);
    this.custPerHour.push(randNum);
    this.cookiePerHour.push(Math.ceil(randNum * this.avgSale));
    this.totalSold += this.cookiePerHour[i];
  }
};

headerRow();

City.prototype.cityRow = function () {
  cities[i].calcSales();

  const tr = document.createElement("tr");
  const locationName = document.createElement("td");
  locationName.textContent = `${this.location}`;
  tr.appendChild(locationName);

  for (let i = 0; i < hours.length; i++) {
    const cookieTd = document.createElement("td");
    cookieTd.textContent = `${this.cookiePerHour[i]}`;
    tr.appendChild(cookieTd);
  }
  const totalCookie = document.createElement("td");
  totalCookie.textContent = `${this.totalSold}`;
  tr.appendChild(totalCookie);

  const table = document.getElementById("table");
  table.appendChild(tr);
};

for (i = 0; i < cities.length; i++) {
  cities[i].cityRow();
}

function footerRow() {
  const footer = document.getElementById(table);
  const footerTf = document.createElement("tfoot");
  const footerTr = document.createElement("tr");
  const footerTitleTr = document.createElement("td");
  footerTitleTr.textContent = "Totals";
  footerTr.appendChild(footerTitleTr);
  footerTf.appendChild(footerTr);
  table.appendChild(footerTf);

  for (j = 0; j < hours.length; j++) {
    let product = 0;
    for (i = 0; i < cities.length; i++) {
      product += cities[i].cookiePerHour[j];
    }
    const footerTd = document.createElement("td");
    footerTd.textContent = product;
    footerTr.appendChild(footerTd);
  }
}
footerRow();

// FORM SECTION

const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const city = event.target.city.value;
  const min = parseInt(event.target.min.value);
  const max = parseInt(event.target.max.value);
  const avg = parseInt(event.target.avg.value);

  const addCity = new City(city, min, max, avg);
  cities.push(addCity);

  // Calling Functions
  addCity.cityRow();
  footerRow();

  // Removing previous totals row
  const trInTable = document.querySelectorAll("tr");
  const totalRow = trInTable[6];
  totalRow.remove();
});
