user=ripmaster@bytenight.osmosoft.com
dir=/data/vhost/bytenight.osmosoft.com/html/

#ssh $user mkdir $dir/plugins
#scp plugins/jquery.async.js $user:$dir/plugins

scp bytenight.html $user:$dir/bytenight.html
scp polaroiderizer.js $user:$dir
scp polaroiderizer.transition.js $user:$dir
scp styles.css $user:$dir

