<?php
    /*
     *  return JSONP list of items to be blocked, a quick and dirty moderator list
     */
    $callback = isset($_GET['callback']) ? $_GET['callback'] : 'moderate';
    echo $callback . '({"results":[' ;
    echo '{ "id": "flickr_3974518474", blocked: "1" }';
    echo ']});'
?>
