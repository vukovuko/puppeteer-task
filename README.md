# Puppeteer assignment

This project uses [Puppeteer](https://pptr.dev/) and Node.js for scripting and handling data extraction.

### Project Setup Instructions

To get started with the project, follow these setup instructions:

Clone the project with 
```
git clone https://github.com/vukovuko/puppeteer-task.git
```

Go to the main directory
```
cd puppeteer-task
```
On Windows run
```
.\setup.bat
```
On Linux or Mac
```
./setup.sh
```
**Must have google-chrome installed and up to the latest version.**

Or you can do it manually by installing the dependencies and starting the project
```
npm install
npm run build
npm run start
```
You can use any other package manager such as yarn or pnpm, following their equivalent commands for installation and project start.

To start the process with a custom URL, you can use the following command
```
npm run start https://www.example.com
```

#### **EXPERIMENTAL: Alternative Docker Startup
https://github.com/vukovuko/puppeteer-task/tree/feature/6---dockerizing

For an alternative setup using Docker, follow the instructions below:
```
git checkout feature/6---dockerizing
docker build -t puppeteer-app .
docker run -p 4000:4000 puppeteer-app
```

***After finishing the program you should have JSON file called `scrapedProducts.json` inside the program directory.***

### Assumptions Made During Development

This script is developed and tested on Node.js version v20.10.0 on Windows 10 and on WSL2 Ubuntu 22.04.4 LTS (Windows Subsystem for Linux).
The target website structure is assumed to remain constant.

### Potential Challenges

Dynamic content loading, CAPTCHAs and variant picker changes were one of the main challenges for this project.

### Features

The script finds products on the homepage and extracts their details. Then, it navigates to each product's detail page to gather more information like product name, price, description, available sizes, and an image URL.

Next, it simulates adding products to the cart and goes through the checkout process up to the payment stage.

After that is finished, the data extracted from the products is written to the `scrapedProducts.json` file in the project directory.
