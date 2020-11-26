let Parser = require('rss-parser');
let fs = require('fs');
let axios = require('axios');
let lastFeed = require('./lastFeed.json');

let lastFeedFile = './lastFeed.json'
let parser = new Parser();

let feeds = [
  {
    name: 'awwwards',
    url: 'https://www.awwwards.com/feed/',
    lastFeedItem: lastFeed["awwwards"],
    hookURL: 'https://discord.com/api/webhooks/765522384685367327/6vkF7SmqniiB5TlJZ5tzf1lOv5MS0viy6tajillvkPEfTjLAYGidWjY0qid-fwzhtyE-',
  },
  {
    name: 'fwa',
    url: 'https://thefwa.com/rss/',
    lastFeedItem: lastFeed["fwa"],
    hookURL: 'https://discord.com/api/webhooks/775316013008683009/tv6AGwLCj3mtQc8onTde_WyOVNNkTu2Gy-Czh3J3bmLIC1MVq21FhmKpS3DkBjemXC73'
  }
];

// Check feed and replace if new
function checkFeed() {
  for (const feed of feeds) {
    (async () => {
      let res = await parser.parseURL(feed.url);
      if(res.items[0].link != feed.lastFeedItem) {
        lastFeed[feed.name] = res.items[0].link;
        fs.writeFile(lastFeedFile, JSON.stringify(lastFeed, null, 2), (err) => {
          if (err) throw err;
          axios.post(feed.hookURL, {
            content: res.items[0].link
            })
            .then(function (response) {
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
        });
      };
    })();
  };
};

//Call every 15min
setInterval(() => { checkFeed() }, 1000*60*15);
