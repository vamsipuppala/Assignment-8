const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 3000;

const app = express();
app.use(bodyParser.json());
// app.use(cors());

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.get('/', function(req, res){
    // res.send('Hello from server');
    //const api_key = 'lpE7r62f0Q1NTs1v-989fTh8fZhoS0_airjCZU0659OhP0z3bNGMcKWnyZW35JzQPTb5LzC7XrC_iNN5NngNCpxhyAK5p3-UrFTBrjoBI3f0p255ETq6-iO9tuI5Y3Yx'
    const axios = require('axios');
    
    const config = {
        headers: {
          Authorization: "Bearer lpE7r62f0Q1NTs1v-989fTh8fZhoS0_airjCZU0659OhP0z3bNGMcKWnyZW35JzQPTb5LzC7XrC_iNN5NngNCpxhyAK5p3-UrFTBrjoBI3f0p255ETq6-iO9tuI5Y3Yx",
        },
      };
    const url = 'https://api.yelp.com/v3/autocomplete'+'?text='+req.query.typed
    
    //   res.send(axios(url, config).then((resp) => {
    //     //  console.log(resp.data);
    //     response.end(JSON.stringify(resp.data));
    //   }));
    // res.send(axios.get(url, config).then(response => {console.log(response);  response.end(JSON.stringify(resp.data));}));
    axios(url, config).then((resp) => {
        //  console.log(JSON.stringify(resp.data));
        const cat = resp.data.categories;

        const term = resp.data.terms;
        // console.log(resp.data);
        // response.end(JSON.stringify(resp.data));
        const output = []
        for(var i =0; i<cat.length;i++)
        {  
            output.push(cat[i].title);
        }
        for(var i =0; i<term.length;i++)
        {    console.log(term[i].text);
            output.push(term[i].text);
        }
        // console.log(output.categories);
        
        res.send(output);

      });
    
})
app.get('/business', function(req, res){
    id=req.query.id;
    const axios = require('axios');
    const config = {
        headers: {
          Authorization: "Bearer lpE7r62f0Q1NTs1v-989fTh8fZhoS0_airjCZU0659OhP0z3bNGMcKWnyZW35JzQPTb5LzC7XrC_iNN5NngNCpxhyAK5p3-UrFTBrjoBI3f0p255ETq6-iO9tuI5Y3Yx",
        },
      };
      
    url = "https://api.yelp.com/v3/businesses/"+ id;
    axios(url, config).then((resp) => {
        console.log(resp);
        res.end(JSON.stringify(resp.data));
        
        
    });
});

app.get('/geo', function(req, res){
   var str=req.query.loc;
   console.log("Inside geo backend");
   var ans=['',''];
   const axios = require('axios');
   var stringArray = str.split(" ");
    var s = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    s += stringArray[0]
    for(let i in stringArray)
    {
        if(stringArray[i]!=" " && i!=0)
        {
            s += "+";
            s+=stringArray[i];
        }
    }
    s+="&key=AIzaSyAN-C0jPArxqWHWdIyZVDtpE2UfwvgRBS0";

    console.log("Hereeeeee")
    console.log(s);
    axios(s).then((resp) => {
        console.log(resp.data.results);
        ans[0] = resp.data.results[0].geometry.location.lat;
        ans[1] = resp.data.results[0].geometry.location.lng;
        console.log(ans);
        res.end(JSON.stringify(ans));
        
    });
});
 
app.get('/table', function(req, res){
    const axios = require('axios');
    const term=req.query.term;
    const latitude=req.query.lat;
    const longitude=req.query.long;
    const radius=req.query.rad;
    const categories=req.query.cat;
    
    
    const config = {
        headers: {
          Authorization: "Bearer lpE7r62f0Q1NTs1v-989fTh8fZhoS0_airjCZU0659OhP0z3bNGMcKWnyZW35JzQPTb5LzC7XrC_iNN5NngNCpxhyAK5p3-UrFTBrjoBI3f0p255ETq6-iO9tuI5Y3Yx",
        },
      };
    
    const url = 'https://api.yelp.com/v3/businesses/search?term='+term+'&latitude='+latitude+'&longitude='+longitude+'&categories='+categories+'&radius='+radius+'&limit=10';
    console.log(url);
    axios(url, config).then((resp) => {
      //  console.log(resp.data);
        res.end(JSON.stringify(resp.data));
        
    });

});
app.post('/enroll', function(req, res){
    console.log(req.body.Keyword);
    res.status(200).send({"message": "Data received"});
})

app.listen(PORT, function(){
    console.log("Server running on localhost:"+ PORT);
});
