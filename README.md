# Puppeteer assignment

### Project setup instructions

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
**Must have google-chrome installed and up to the latest version.

Or you can do it manually by installing the dependencies and starting the project
```
  npm install
  npm run build
  npm run start
```
You can use any other package manager such as yarn or pnpm.

#### **EXPERIMENTAL: Alternative docker startup:
https://github.com/vukovuko/puppeteer-task/tree/feature/6---dockerizing
```
 git checkout feature/6---dockerizing
 docker build -t puppeteer-app .
 docker run -p 4000:4000 puppeteer-app
```

After finishing the program you should have JSON file called 'scrapedProducts.json' inside the directory.

### Assumptions made during development

This script is developed and tested on Node.js version v20.10.0 on Windows 10 and on WSL2 (Windows Subsystem for Linux).
The target website structure is assumed to remain constant.

### Potential challenges

Dynamic content loading, CAPTCHAs and variant picker changes were one of the main challenges for this project.

### Features

Product discovery.
Product details extraction.
Sumlating adding product to the cart.
Checkout simulation.
Data storage.
