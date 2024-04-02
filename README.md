# Assignment #4 - Jicnic

## Introduction

In this Assignment, you will demonstrate your ability to combined front-end-and-back-end app, using the skills from all three units, including AJAX.  You will make a simple app that could be used to plan an event with other people, such as a picnic, by collecting votes from different people about what days they are available.

You may use fetch, or axios, or an alternate equivalent AJAX library.  You may not use any heavyweight libraries that solve the primary challenges of the Assignment, at least not without prior permission.  If in doubt, ask.

This Assignment is worth 25% of your final grade.


## Due Date

This Assignment is due on Saturday, April 13th, at 11:59pm.

## Submission

GitHub Classroom, same as before.  If you changed GitHub username, be sure to tell me, same as before.


## Intellectual Honesty


All the same notes apply as on previous assignments.

This assignment is **individual work**.  You may use tools that are not made of people, like textbooks, stack overflow, AIs unless they are secretly fake AIs where a human being is actually answering the chat, whatever.  You may not ask others for help (except me), you may not look at the code of other students, you may not help other students, you may not show other students your code.

SOURCES.md is still a good idea, though still not strictly required.




## Functional Requirements

### PASS Tier

* Statement To Grader
    * As with previous work, please include a file called `STATEMENT_TO_GRADER.md`.
    * As with previous work, this file should start with "I believe I have completed 100% of the requirements for the ____ tier".
    * As with previous work, feel free to add anything else that you would like me to know as I grade your work.
* Get the signup/login/logout working, via AJAX
    * implement the backend routes, at
        * `POST /api/v1/signup`
            * don't forget that signup should do a login
        * `POST /api/v1/login`
        * `POST /api/v1/logout`
        * `GET /api/v1/getSession`
    * any data that needs sending, send it in JSON in the body of the request
    * if the request is successful, return a status 200, and a JSON like one of the following:
        * `{ "success": true, "data": { "username": USERNAME } }`
        * `{ "success": true, "data": null }`
    * if the request is invalid, set an appropriate HTTP status, and return JSON like this:
        * `{ "success": false, "error": "This is a string explaining what the user messed up"`
    * on the frontend, wire the user interactions up to some kind of AJAX call
    * also connect up the responses
        * what should happen on success?  figure it out.
        * on failure, you may cut a corner here and simply `alert` the error message
            * remember, `alert` is not okay for real webapps, it makes you look like a filthy amateur, I'm just cutting you a break here
            * OPTIONAL: the good thing to do with the errors is add a div below the login form to display any errors
                * if you do this, be sure to erase the error when the user tries again
* Get vote-retrieval working
    * implement the backend routes, something like
        * `GET /api/v1/votes/list`
            * you can change this if you want, if you're prepared to explain why you changed it
        * your return format should still be like:
            * `{ "success": true, "data": ????? }`
    * on the frontend, trigger this AJAX call on pageload, and use the response to fill out the display of existing votes
    * the frontend should show any number of days that the backend sends it, whether that's 3 or 30
        * so that means the backend must control how many days!  (though any number is fine)
    * note that my fake frontend sample code, and my DB, store the votes in different formats.  this is deliberate.
        * your backend code must convert from one format to the other, because that's what backends do
* Get the weather working
    * make calls to a weather API, for example https://openweathermap.org/api/
        * in particular, we want a weather forecast for BCIT's location
            * you MAY hardcode the location into your frontend code at the pass tier
    * figure out what you can get the API to do, this is a puzzle that you need to solve
        * I used the free tier, without giving them my credit card
            * it was a bit of a fight to get the free tier to do what I want
            * actually the solution I came up with only works for very specific dates
        * if you're willing to give them your credit card, you can get better results, still for free
            * but that's too much work for an assignment, IMO
        * you could also apply for https://docs.openweather.co.uk/our-initiatives/student-initiative
            * still too much work for an assignment, but if you're going to use an API in a project, look for things like this
    * each day should render two things:
        * a predicted temperature for the day
            * use the predicted high temp for the day, or if you want use any other temperature, I don't really care
        * an icon summarizing the day's weather
        * mouseover text (i.e. `title`) that explains the icon
    * make the calls to the openweathermap API from the frontend
        * there are pros and cons to this, but I want you to have experience making 3rd-party API calls from the frontend
        * you do need to get your API key to the frontend, and at the PASS tier you may hardcode it in the frontend
            * if you do hardcode it, then make sure that you never make your repository public, or people will steal your key
                * if you haven't added your credit card, this isn't a huge deal, but it's still bad citizenship
            * the alternative to hardcoding it is to use the `.env`, with notes about that in the SATIS tier
* for all AJAX calls, you may use naked XHR, or fetch, or axios, or jQuery, or any other similar library
    * my suggestion is using fetch or axios, I think those are more competent-looking if you're showing someone your code
* for this tier, I believe that you should be able to do the assignment by mostly only editing around four files
    * on the frontend, `/static/js/api_calls.js`, quite a lot of work in here
    * also on the frontend, `/static/js/frontend.js` is where you would do the work for rendering the weather forecast data
    * on the backend, `/routers/api.js` for all your routes, quite a lot of work in here
    * also on the backend, `server.js` for middleware configuration
        * the template project doesn't handle the `.env file`
        * it's also missing a middleware that you'll need
        * you could in theory do both of those things in `api_calls.js`, but `server.js` is the right place
    * maybe I forgot some other files
    * you may edit other files if you choose
* as usual, I expect some reasonable overall code quality, appropriate to your career goals



### SATIS Tier

* Make voting work
    * if the user is logged in, they should see voting buttons for every day
        * they can vote yes, they can vote no, they can unset their vote
    * if they've already voted, make their own vote look a little different in the list
        * maybe a different border, or a different background opacity, or something
    * probably you should make an endpoint roughly like `POST /api/v1/votes/set`
        * you already know that any self-respecting dev would secure this on the backend, so I don't know why I wrote this
* Soft refresh
    * add a button to the header that says "Refresh" or "🔄" or something
    * when this button is clicked, do another AJAX call to get all the votes again, and re-render the DOM
* use a `.env` file, and the `dotenv` library, for configuration
    * BCIT's lat and long should be in this file
    * also your openweathermap.org secret key
    * remember that you should commit a suitable `.env.example`, and you **should not commit** your `.env`
* API key security
    * it's actually kinda questionable sending our openweathermap API token to the frontend
        * because then any user of ours could steal our key and use it for their own app
    * we're not going to actually fix the security hole, but we're going to pretend, as following
    * every time you want to make an API call to the openweathermap API, you must first make an API call to your own backend to get the secret key, and then forget the key afterward
        * this doesn't actually help
        * but, if the weather API were fancier, we could request single-use tokens, and that'd be more secure
        * and if we were doing that, the frontend would work like this
        * so you'll need to add a backend route like `GET /api/v1/getToken/openweathermap`, that returns the openweathermap API key
        * that route should only return the real key if the user is logged in
            * so if the user is not logged in, they won't get working weather.  make this unobtrusive.
            * so if they WERE logged out, and they log in, don't forget to fix up the weather data.
* no hardcoding the lat/long
    * just as you're asking the backend for the API key, you should also ask the backend for the lat/long
    * add `GET /api/v1/getLocation`
    * gotta call this before you do a weather call



### EXEMP Tier

* add websockets
    * one small problem is that if I open the voting app on my computer, and someone else votes on their computer, I won't see their vote until I refresh the page
    * add websockets to fix this
    * when the frontend gets a message that someone changed their vote, trigger the soft-refresh functionality from SATIS
        * that is, the websockets are being used to trigger AJAX
            * this is arguably redundant, but it's easier for you to code and easier for me to read that you did the right thing
    * I recommend using naked websockets on the frontend, and a simple library like `ws` on the backend
        * but if you want to use other libraries, that's fine
    * https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
* API rate limiting
    * add some code so that your frontend doesn't ask the API for the weather for a given day more often than once per (INTERVAL)
        * probably set the interval to 10 seconds, but it should be easy to change to a larger time if we wanted to
    * this is called caching
    * maybe consider putting the cache in localStorage so it'll work even if you refresh the page
* OPTIONAL: also if you're feeling fancy, geolocate the weather forecast
    * use the geolocation API to determine where the user is, for the lat and long you'll send to the weather API
    * note that this actually makes no sense, because what matters is the weather where the picnic is, not the weather where the user is, but just pretend okay
    * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

