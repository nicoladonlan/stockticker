var http = require('http');
var urlObj = require('url');
var fs = require('fs');
var { MongoClient } = require('mongodb');

var connectionString = 'mongodb+srv://nicoladonlan:Loonskigirl9%21@cluster0.hc8lx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


async function search(name) {
    let client;
    
    try {
        // connect to mongo
        client = await MongoClient.connect(connectionString);
        const dbObj = client.db('Stock');
        const collection = dbObj.collection('PublicCompanies');

        //create the query for the database
        let query;
        if (type === 'ticker') {
            query = { ticker: name.toUpperCase() };
        } else if (type === 'company') {
            query = { company: {$regex: name, $options: 'i' } };
        }

        let results = await collection.find(query).toArray();
        return results;

    } finally {
        //close the connection
        if (client) {
            await client.close();
        }
    }
} 


http.createServer(async function (req, res) {
  
    //req.url is the complete URL from the http request
  purl = urlObj.parse(req.url, true)  // parse into object bc true
  path = purl.pathname
  
if (path == '/')
  {	  
    file ='home.html'
    fs.readFile(file, function(err, txt) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(txt)
    res.end()
    })
  } //end home view
else if (path == '/process')
  {
    res.writeHead(200, {'Content-Type': 'text/html'})
	res.write("<h1>Results</h1>")
    let name = purl.query.name;
    let type = purl.query.type;

    try {
        let results = await search(name, type);

        //print the results to the page
        if (results.length === 0) {
            res.write('No matching entries');
        } else {
            res.write("</ul>");
            results.forEach(entry => {
                res.write(`<li>${entry.company} (${entry.ticker}): ${entry.price}`);
                res.write("</ul>");
            })
        }
    } catch (err) {
        res.write("An error occured while completing your search.");
    }
    
    res.end()
  }
else 
  {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("404 page not found")
  res.end();
  }
}).listen(1010);