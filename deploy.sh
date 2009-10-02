user=ripmaster@bytenight.osmosoft.com

dir=/data/vhost/bytenight.osmosoft.com/html/
scp moderated.php $user:$dir/moderated/index.php

#dir=/data/vhost/bytenight.osmosoft.com/html/test

###ssh $user mkdir $dir $dir/plugins
###scp holding.html $user:$dir/index.html

scp plugins/jquery.async.js plugins/date.js $user:$dir/plugins
scp polaroiderizer.flickr.js polaroiderizer.js polaroiderizer.transition.js polaroiderizer.twitter.js $user:$dir
scp styles.css $user:$dir

scp join-us.html $user:$dir

scp bytenight.html $user:$dir/index.html
