var twit = require('twit');
var config = require('./config.js');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var Post = require("../models/post"),
	User    = require("../models/user"),
	postFunctionsObj = require("../static/js/requirehelpers");

// Google Image search configuration.
const GoogleImages = require('google-images');
								// Google CSE ID					Google API key.
const client = new GoogleImages('014195430514779859653:sburj_xz_ji', 'AIzaSyARUVO6LySjVpXw4wCGDSy-FtJQYfJcLPc');
// ##### End Google Image search configuration


var Twitter = new twit(config);
// Option 1 - Donald Trump
var person1 = 'realDonaldTrump';
// Option 2 - Chris Pratt
var person2 = 'prattprattpratt';

function tweetTone(person) { 
	// The variable that will contain the data for the message.
	var dominant = {};
	
	// Twitter search parameters.
	var params = 
	{
		// 'from' is added to make Tweeter search return tweets only from that person.
		q: 'from:'+person,
		// Sort based on 'recent'
		result_type: 'recent',
		lang: 'en'
	}
	
	Twitter.get('search/tweets', params, function(err, data) {
	  // if there no errors
		if (!err) {
			
			// Grab text of the tweet.
			dominant.description = data.statuses[0].text;
			
			
			// Tone analyzer API configuration.
			var tone_analyzer = new ToneAnalyzerV3({
				username:  "dcd79266-0445-41e7-a632-1db5b8cc1156",
				password: "WFREgaAU88xw",
				version_date: '2017-10-14',
				headers: {
    				'X-Watson-Learning-Opt-Out': 'true'
				}
			});
			
			// Parameters to send to the API.
			var params = {
				text: dominant.description,
				tones: 'emotion'
			};
			// Find out the tone of the tweet.
			tone_analyzer.tone(params, function(error, response) 
			{
				if (error)
					console.log('error:', error);
				else
				{
					// Highest score for a tone.
					var highest = {'score': 0};
					
					// Get the list of tones from the Tone Analyzer response.
					var tones = response.document_tone.tones;
					if(tones.length !== 0)
					{
						// Go through the list of tones and find the most dominant tone.
						if(tones.length > 1)
						{
							tones.forEach(function(tone){
								if(tone.score > highest.score)
								{
									highest = tone;
								}
							});
						}
						else
						{
							highest = tones[0];
						}

						// Search Google for an image with tone_id.
						client.search(highest.tone_name)
						.then(function(images)
						{
							dominant.image = images[0].thumbnail.url;
							postTweet(dominant, person);
						}).catch(function(e) {
							if(e.statusCode === 403)
							{
								console.log("Still blocked from Google search.");
								dominant.image = "";
								dominant.description += "\n\nTone: "+highest.tone_name;
								postTweet(dominant, person);
							}
							else
							{
								console.log(e);
							}
						});
					}
					else
					{
						console.log("Sadly the Tone Analyzer failed to recognize any tones in that tweet for '" + person + "'.");
						if(person === person1)
						{
							
							tweetTone(person2);
						}
						else
						{
							console.log("Failed to find the tone for both people. Please add a new username and restart.")
						}
					}
				}
			});
		}
		// if unable to Search a tweet
		else {
		  console.log('Something went wrong while SEARCHING...');
		}
	});
};

function postTweet(tweetData, person)
{
	console.log("Succeeded in getting the tone for '" + person + "'.");
	// grab tweet as soon as program is running.
	User.findOne({username: person}, function(err, foundUser) {
		if(err)
		{
			console.log("Error in postTweet");
			console.log(err);
		}
		else
		{
			
			tweetData.author = {};
			tweetData.author.id = foundUser._id;
			tweetData.author.username = foundUser.username;
			
			tweetData.personal = false;
			
			tweetData.date = new Date(Date.now() + 10800000);
			
			tweetData.likes = {
		        amount: 0,
		        users: []
		    };

		    Post.find({'author.id': foundUser}, function(err, userPosts) {
		    	if(err)
		    	{
		    		console.log("Failed to find posts of the user.");
		    		console.log(err);
		    	}
		    	else
		    	{
		    		if(userPosts.length > 9)
		    		{
		    			console.log("More than 10 posts. Deleting one.");
		    			
		    			// Delete the oldest post.
		    			userPosts[0].remove();
		    		}
		    		// Create the new post.
					Post.create(tweetData, function(err, newlyCreated)
					{
				        if(err)
				        {
				            console.log(err);
				        }
				    });
			    	
		    	}
		    });
		}
	});
	
}

function runner()
{
	tweetTone(person1);
}


console.log("Posting bot has started.");

runner();

// Post every 120 minutes. 
setInterval(runner, 4320000);
// Post every 5 minutes. 
// setInterval(runner, 300000);
// Post every 1 minutes. 
// setInterval(runner, 60000);