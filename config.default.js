const config = {
    password: null,
    // string, default value: null
    //
    // set a password for creating new links, or set to a falsey value (null) to disable

    logUserData: false,
    // string, default value: false
    //
    // if true, user data will be logged when creating URLs. this only includes a user's IP and
    // user-agent. Users visiting the link will not be logged.

    port: 3000,
    // port number, default value: 3000
    //
    // set the port number for the frontend to be hosted on. you can also set it via the .env file,
    // which will override this setting.

    allowNamedURLs: true,
    // boolean, default value: true
    //
    // if true, allows users to use custom names for their URLs 
    // (ex: example.com/my-short-url instead of example.com/aMd3m).

    allowedRandomCharacters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
    // string, default value: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
    //
    // set the allowed characters in a randomly-generated URL.

    URLNamePattern: "^[a-zA-Z0-9]*$",
    // string, default value: "^[a-zA-Z0-9]*$"
    //
    // regex pattern to run on URL names. run with the flags "gm"

    minimumURLNameSize: 1,
    // integer, default value: 1
    //
    // set the minimum size for url names.

    minimumURLRandomNameSize: 4,
    // integer, default value: 4
    //
    // set the minimum size for random url names. note that random url names can be longer
    // depending on how many times the random name picker fails

    maximumURLNameSize: 24,
    // integer, default value: 24
    //
    // set the maximum size for url names

    allowEditingURLs: false,
    // THIS SETTING DOES NOT DO ANYTHING YET!
    // boolean, default value: false
    //
    // enables the url editing system - when creating a URL, you are given a link
    // that allows you to change the URL

    extraClickToRedirect: false,
    // THIS SETTING DOES NOT DO ANYTHING YET!
    // boolean, default value: false
    //
    // when enabled, requires the user to click a button to be redirected to the
    // target site. makes it harder to redirect to shady links
}

module.exports = config