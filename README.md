Pinned Out
==========

A Chrome extension for opening links from pinned tabs in a new tab, thus preserving the pinned tab's state/location.

For anyone, like me, who pins tabs for a reason.

## Features

- Exclude domains form being affected
- Option to open all links or only external links in a new tab
- Syncs options across computers[\*](#known-issues)

_Suggestions and contributions are welcome._

## Installation

### From the Chrome Web Store

[Download Pinned Out from the Chrome Web Store](https://chrome.google.com/webstore/detail/pinned-out/ceieamdcjgdhigdichbkcckfpmhjbjcn)

### Using Git & Grunt

You'll need to have Grunt installed to automate building this extension. If you're not familiar with Grunt, [you can learn more here](http://gruntjs.com/getting-started).

**Clone the repository:**

```command-line
git clone git://github.com/goodguyry/pinned-out.git
```

**Install the necessary Grunt packages:**

```command-line
npm install --save-dev
```

**Build the extension:**

```command-line
grunt
```

Now you're ready to [manually install](http://developer.chrome.com/extensions/packaging.html) CQ Helper. Be sure to choose the ```/build``` directory when asked to specify the _"Extension root directory"_.

## Known issues

- Some AJAX content containing links may not open in a new tab. Most will.

---

\* _Sync requires a Google account, being signed in to Chrome with your Google account and having the appropriate sync options enabled in Chrome's settings._
