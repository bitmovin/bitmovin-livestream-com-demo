# How it works
This little demo allows you just to insert your Livestream API Key and our Bitmovin Player License Key, so you can test your Livestream livestreams with our fully customizable player.

## Configuration
**php/index.php**: Please replace the value of `$api_key` with your own Livestream API key, and `$client_id` with 
your own Livestream Client ID. Both values are available in your Livestream developer backend at 
[https://livestream.com/developers/api](https://livestream.com/developers/api)

**js/app.js**: At the beginning of the file you will find some configuration values, which define the base URls for the Livestream API and the backend application of this example. Adjust those values if needed. 

_Hint:_ If you are running this application not on localhost, please don't forget to insert your Bitmovin Player License Key in the configuration at `js/app.js` as well.

## How to run

### Server-side (PHP)
Inside the `php` directory you find a php script called `index.php`, which is used to create a secure token, 
which can be used on the client side, for fetching some data. 

One way to run this script, is to execute the integrated web server of php: `php -S localhost:9696 index.php`
Now, it is available via `http://localhost:9696/index.php` 

**Hint:** Don't forget to update `clientServerBaseUrl` at `js/app.js`, if you are using a different URL.

### Client-side (Angular Frontend)
Those files just need to be served by a web server of your choice. Once, that is done, open the URL to the `index.html`. 
That's it :)