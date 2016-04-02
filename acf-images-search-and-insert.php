<?php
/**
 * Plugin Name: ACF Images Search and Insert
 * Version: 1.1.3
 * Description: This plugin makes easy to insert images into ACF image fields using Pixabay and Flickr image search. If you want to build a picture book with WordPress and ACF, this plugin will help.
 * Author: Takayuki Imanishi
 * Author URI: http://takayukii.me
 * Plugin URI: https://wordpress.org/plugins/acf-images-search-and-insert/
 * Text Domain: aisai
 * Domain Path: /languages
 * @package acf-images-search-and-insert
 */

/**
 * This plugin is created as Single Page Web Application (SPA) using React + Redux, hence most of view logics
 * including search are implemented in JavaScript.
 *
 * Source code is hosted at https://github.com/takayukii/acf-images-search-and-insert
 * Please check src/js directory.
 *
 * Available commands for development:
 * npm run watch - builds js and scss when developing
 * npm run compile - builds js and scss for production
 * grunt i18n - generates pot file
 */

/**
 * Available Filters
 * --
 * aisai_initial_keyword
 * e.g.
 * add_filter( 'aisai_initial_keyword', 'handle_aisai_initial_keyword', 10, 1 );
 * function handle_aisai_initial_keyword( $post_id ) {
 *   return get_field( 'english_name', $post_id );
 * }
 *
 * aisai_image_caption
 * add_filter( 'aisai_caption', 'handle_aisai_caption', 10, 4 );
 * function handle_aisai_caption( $caption, $title, $site_url, $powered_by ) {
 *   return "Powered by {$powered_by}, check original url {$site_url}";
 * }
 */

// Add admin settings
include( plugin_dir_path( __FILE__ ) . 'settings.php' );

/**
 * Class Acf_Images_Search_And_Insert
 */
class Acf_Images_Search_And_Insert {

	var $ltd = 'aisai';
	var $nonces;

	/**
	 * Acf_Images_Search_And_Insert constructor.
	 */
	function __construct() {
		$this->nonces = [
			'field' => $this->ltd . '_nonce_field',
			'value' => $this->ltd . '_nonce_value',
		];
		$rel_path = dirname( plugin_basename( __FILE__ ) ) . '/languages/';
		load_plugin_textdomain( $this->ltd, false, $rel_path );
		add_action( 'admin_init', [ $this, 'admin_init' ] );
	}

	/**
	 * Initialize method working at admin_init phase
	 */
	function admin_init() {
		add_filter( 'media_upload_tabs', [ $this, 'handle_tab_init' ] );
		add_action( 'media_upload_aisaitab', [ $this, 'handle_my_tab' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_style_and_scripts' ] );
		add_action( 'wp_ajax_upload_image' , [ $this, 'upload_image' ] );
	}

	/**
	 * Handle method for media_upload_tabs
	 *
	 * @param $tabs
	 * @return mixed
	 */
	function handle_tab_init( $tabs ) {
		$tabs['aisaitab'] = __( 'ACF Images Search And Insert', $this->ltd, 'aisai' );
		return $tabs;
	}

	/**
	 * Handle method for media_upload_aisaitab
	 */
	function handle_my_tab() {
		wp_iframe( [ $this, 'media_aisai_tab' ] );
	}

	/**
	 * Handle method for wp_iframe
	 */
	function media_aisai_tab() {
		?>
		<div id="root" style="height: 100%"></div>
		<script src="<?php echo plugin_dir_url( __FILE__ ) . 'dist/js/app.js'; ?>"></script>
		<?php
	}

	/**
	 * Enqueue CSS and JavaScripts
	 * Also, wp_localize_script enables provision variables in JavaScript
	 */
	function enqueue_style_and_scripts() {
		$keyword = apply_filters( 'aisai_initial_keyword', $_GET['post_id'] );
		if ( $_GET['post_id'] === $keyword ) {
			$keyword = '';
		}

		// Object which should be available in JavaScript as window.aisaiLocal
		// e.g. window.aisaiLocal.nonces.v
		$localize = [
			'keyword' => $keyword,
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'nonces' => [
				'field' => $this->nonces['field'],
				'v' => wp_create_nonce( $this->nonces['value'] ),
			],
			'text' => [
				'Search' => __( 'Search', $this->ltd, 'aisai' ),
				'SearchFor' => __( 'Search for', $this->ltd, 'aisai' ),
				'DragAndDropHere' => __( 'DRAG AND DROP HERE', $this->ltd, 'aisai' ),
				'Cancel' => __( 'CANCEL', $this->ltd, 'aisai' ),
				'UploadAndInsert' => __( 'Upload and Insert', $this->ltd, 'aisai' ),
				'NoticeAfterUploadAndInsert' => __( 'Completed to insert image in ACF image field. Please keep in mind that you need to update the post.', $this->ltd, 'aisai' ),
			],
			'options' => get_option( 'aisai_options' ),
		];
		wp_register_style( 'aisai-style', plugin_dir_url( __FILE__ ) . 'dist/css/style.css', [], '', 'all' );
		wp_enqueue_style( 'aisai-style' );
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'aisai-vendor-script', plugin_dir_url( __FILE__ ) . 'dist/js/vendor.js', [], '' );
		wp_localize_script( 'aisai-vendor-script' , $this->ltd . 'Local' , $localize );
	}

	/**
	 * Handle method for ajax action upload_image
	 * Invoked by JavaScript through Ajax
	 *
	 * @throws Exception
	 */
	function upload_image() {

		check_admin_referer( $this->nonces['value'], $this->nonces['field'] );
		if ( empty( $_POST['url'] ) ) {
			die( 'Parameter url is required' );
		}

		$caption = apply_filters( 'aisai_image_caption', $_POST['caption'], $_POST['title'], $_POST['site'], $_POST['poweredBy'] );

		$attachment_id = $this->insert_image_by_url( $_POST['url'], $caption );
		$thumbnail_image = wp_get_attachment_image_src( $attachment_id );
		wp_send_json_success(
			[
				'attachment_id' => $attachment_id,
				'url' => $thumbnail_image[0],
			]
		);
	}

	/**
	 * Insert a image which is fetched from URL
	 *
	 * @param $url
	 * @param $caption
	 * @return bool|int
	 * @throws Exception
	 */
	function insert_image_by_url( $url, $caption ) {

		$fetched_path = $this->remote_get_file( $url );

		if ( ! $fetched_path ) {
			return false;
		}

		$filetype = wp_check_filetype( basename( $fetched_path ), null );

		$attachment = [
			'guid'           => $fetched_path,
			'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $fetched_path ) ),
			'post_type' 	 => 'attachment',
			'post_excerpt'	 => $caption,
			'post_status'    => 'inherit',
			'post_mime_type' => $filetype['type'],
		];

		$attachment_id = wp_insert_attachment( $attachment, $fetched_path );
		if ( is_wp_error( $attachment_id ) ) {
			throw new Exception( $attachment_id->get_error_message() );
		}

		$attach_data = wp_generate_attachment_metadata( $attachment_id, $fetched_path );
		if ( is_wp_error( $attach_data ) ) {
			throw new Exception( $attach_data->get_error_message() );
		}

		$result = wp_update_attachment_metadata( $attachment_id, $attach_data );
		if ( is_wp_error( $result ) ) {
			throw new Exception( $result->get_error_message() );
		}
		return $attachment_id;
	}

	/**
	 * Fetch and save a remote file
	 *
	 * @param null $url
	 * @param string $file_dir
	 * @return bool|string
	 */
	function remote_get_file( $url = null, $file_dir = '' ) {
		if ( empty( $file_dir ) ) {
			$upload_dir = wp_upload_dir();
			$file_dir = isset( $upload_dir['path'] ) ? $upload_dir['path'] : '';
		}
		$file_dir = trailingslashit( $file_dir );

		if ( ! file_exists( $file_dir ) ) {
			$dirs = explode( '/', $file_dir );
			$subdir = '/';
			foreach ( $dirs as $dir ) {
				if ( ! empty( $dir ) ) {
					$subdir .= $dir . '/';
					if ( ! file_exists( $subdir ) ) {
						mkdir( $subdir );
					}
				}
			}
		}
		$photo = $file_dir . basename( $url );
		if ( file_exists( $photo ) ) {
			$file_name = basename( $url );
			$splits = preg_split( '/\./', $file_name );
			$index = 0;
			while ( true ) {
				if ( ! file_exists( $file_dir . $splits[0] . '-' . $index . '.' . $splits[1] ) ) {
					break;
				}
				$index ++;
			}
			$photo = $file_dir . $splits[0] . '-' . $index . '.' . $splits[1];
		}

		$response = wp_remote_get( $url );
		if ( ! is_wp_error( $response ) && 200 === $response['response']['code'] ) {
			$photo_data = $response['body'];
			file_put_contents( $photo, $photo_data );
			unset( $photo_data );
		}
		unset( $response );
		return file_exists( $photo ) ? $photo : false;
	}
}
new Acf_Images_Search_And_Insert();
