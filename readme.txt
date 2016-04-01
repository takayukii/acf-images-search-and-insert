=== ACF Images Search And Insert ===
Contributors: takayukii
Tags: ACF, images, search, admin
Requires at least: 4.0
Tested up to: 4.4
Stable tag: 1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This plugin makes easy to insert images into ACF image fields using Pixabay and Flickr image search.

== Description ==

This plugin extends WP Media modal and enable to search CC0 images using Pixabay and Flickr. You can insert found images into ACF image fields only by drug and drop. If you want to build a picture book with WordPress and ACF, this plugin will help.

[Demo Video](https://www.youtube.com/watch?v=Es5-oQg2LVE)

== Installation ==

* Install Advanced Custom Fields if you haven't yet.
* Upload acf-images-search-and-insert folder to your /wp-content/plugins/ directory.
* Activate the plugin from Admin > Plugins menu.
* Once activated you should check with Settings > ACF Images Search And Insert
* Use ACF Images Search And Insert link in WP Media modal

== Frequently Asked Questions ==

Feel free to contact me at takayukii@gmail.com

#### What filter hooks does this plugin offer?

There're two filter hooks are available.

aisai_initial_keyword - for setting default search keyword

```
add_filter( 'aisai_initial_keyword', 'handle_aisai_initial_keyword', 10, 1 );
function handle_aisai_initial_keyword( $post_id ) {
	return get_field( 'english_name', $post_id );
}
```

aisai_caption - for setting image caption

```
add_filter( 'aisai_caption', 'handle_aisai_caption', 10, 4 );
function handle_aisai_caption( $caption, $title, $site_url, $powered_by ) {
	return "Powered by {$powered_by}, check original url {$site_url}";
}
```

== Screenshots ==

1. Search result in WP Media modal

== Changelog ==

= 1.0 =
* First release

== Upgrade Notice ==


== Arbitrary section ==



