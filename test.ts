// tests go here; this will not be compiled when this package is used as an extension.

/*
storybrain.initialiseBrain('Mars', 42);

basic.forever(function () {
    pause(50);
    while (storybrain.uncheckedMessagesAvailable()) {
        let myMessage: StoryMessage = storybrain.grabNextUncheckedMessage();
        basic.showString(myMessage.text, 100);
    }
    if (storybrain.uncheckedMessagesAvailable()) {
        storybrain.setStatus('Messages still available.', 254);
    } else {
        storybrain.setStatus('Hello.', 254);
    }
})
*/