//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const request =require('request');

const axios = require('axios');

const homeStartingContent = "Hey guys! Welcome to Lakshya's blog. Here I express my views in various topics of my daily life.  ";
const aboutContent = "What to know about me, then search me on instagram. xd! . I am a Lakshya Mathur a fashion influencer.";
const contactContent = "Don't want to share my contacts as being a famous personality my mail account will get dumped by my fans.";

const app = express();

app.set('trust proxy', true)

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var _ = require("lodash");

let posts=[];



const getCovidData = async () => {
      console.log("index.html 10 | Processing...");
      const request = await fetch("https://api.ipify.org?format=json");
      const data = await request.json();
      return data;
    };

const getMoreAPIDataWithUrl = async newUrl => {
  const request = await fetch(newUrl);
  const data = await request.json();
  return data;
};

    const callDataInOrder = async () => {
      const covidData = await getCovidData();
      console.log('index.html 27 | covid Data', covidData.ip);
      var url1="https://geo.ipify.org/api/v2/country,city?apiKey="API_KEY""+covidData.ip;

       const detailData = await getMoreAPIDataWithUrl(url1);
       const v4=[];
       v4.push(detailData.location.lat);
       v4.push(detailData.location.lng);
       return v4;
    };

    //callDataInOrder();

app.get('/',async function(req,res){
  const v4= await callDataInOrder();
  //console.log(v4[0],v4[1]);
  var lat1=v4[0],long1=v4[1];

  var lati= lat1.toString();
  var longi= long1.toString();
  console.log(lati);
  console.log(longi);
  var a1="https://api.openweathermap.org/data/2.5/weather?lat="+lati+"&lon="+longi+"&appid=API_KEY";
  console.log(a1);
  const detailData = await getMoreAPIDataWithUrl(a1);
  //res.send(detailData);
  var city1 = detailData.name;
  var temperature=(parseFloat(detailData.main.temp,10)-273).toFixed(2);
  var weather1 = detailData.weather[0].main;
  var country1 = detailData.sys.country;
  var icon1 =detailData.weather[0].icon;
  res.render('home', { homestart:homeStartingContent, postss:posts, temp:temperature, weather:weather1, city:city1, country:country1, icon:icon1} );
});
app.get('/about',function(req,res){
  res.render('about', { about: aboutContent});
})
app.get('/contact',function(req,res){
  res.render('contact',{contact: contactContent});
})
app.get('/compose',function(req,res){
  res.render('compose');
})
app.post('/compose',function(req,res){
  var title1=req.body.title;
  var body2=req.body.body1;
  let post = {title:title1, bodyy:body2};
  posts.push(post);
  res.redirect('/');
})
app.get('/posts/:whichpost',function(req,res){
  for(var i=0;i<posts.length ;i++)
  {
    let post=posts[i];
    var v6=req.params.whichpost;
    var v7=_.kebabCase(v6);
    var v3=post.title;
    var v4= _.kebabCase(v3);
    if(v4===v7)
    {
      res.render('post',{post1:post});
    }
  }
  //console.log(req.params.whichpost);
})

app.listen("4000",function(){
  console.log("Server is running on local host 4000");
});
