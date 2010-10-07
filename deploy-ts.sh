#
#  deploy to http://polaroiderizer.tiddlyspace.com
#  depends upon 'sts': http://gist.github.com/604709
#
space=polaroiderizer

sts bytenight polaroiderizer.startup.js

sts $space polaroiderizer.html
sts $space styles.css

sts $space polaroiderizer.flickr.js
sts $space polaroiderizer.js
sts $space polaroiderizer.moderated.js
sts $space polaroiderizer.transition.js
sts $space polaroiderizer.twitter.js
sts $space date.js
sts $space jquery.async.js

sts $space polaroiderizer.startup.js
