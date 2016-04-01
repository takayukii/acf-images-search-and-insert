<?php

/**
 * Class Acf_Images_Search_And_Insert_Settings
 */
class Acf_Images_Search_And_Insert_Settings {

	var $ltd = 'aisai';
	// https://www.flickr.com/services/api/explore/flickr.photos.licenses.getInfo
	var $flickr_licenses = [
		'9' => 'Public Domain Dedication (CC0)',
		'10' => 'Public Domain Mark',
		'4' => 'Attribution License',
		'6' => 'Attribution-NoDerivs License',
		'3' => 'Attribution-NonCommercial-NoDerivs License',
		'2' => 'Attribution-NonCommercial License',
		'1' => 'Attribution-NonCommercial-ShareAlike License',
		'5' => 'Attribution-ShareAlike License',
		'7' => 'No known copyright restrictions',
		'0' => 'All Rights Reserved',
	];
	var $flickr_sort = [
		'date-posted-asc' => 'Date Posted Asc',
		'date-posted-desc' => 'Date posted Desc',
		'date-taken-asc' => 'Date taken Asc',
		'date-taken-desc' => 'Date taken Desc',
		'interestingness-desc' => 'Interestingness Desc',
		'interestingness-asc' => 'Interestingness Asc',
		'relevance' => 'Relevance',
	];
	var $pixabay_languages = [
		'cs' => 'Čeština',
		'da' => 'Dansk',
		'de' => 'Deutsch',
		'en' => 'English',
		'es' => 'Español',
		'fr' => 'Français',
		'id' => 'Indonesia',
		'it' => 'Italiano',
		'hu' => 'Magyar',
		'nl' => 'Nederlands',
		'no' => 'Norsk',
		'pl' => 'Polski',
		'pt' => 'Português',
		'ro' => 'Română',
		'sk' => 'Slovenčina',
		'fi' => 'Suomi',
		'sv' => 'Svenska',
		'tr' => 'Türkçe',
		'vi' => 'Việt',
		'th' => 'ไทย',
		'bg' => 'Български',
		'ru' => 'Русский',
		'el' => 'Ελληνική',
		'ja' => '日本語',
		'ko' => '한국어',
		'zh' => '简体中文',
	];
	var $default_options = [
		'per_page' => 20,
		'flickr_apikey' => '30be21caefc972bea242e36538228f76',
		'flickr_licenses' => '9,10',
		'flickr_sort' => 'relevance',
		'pixabay_apikey' => '1327034-ae6fb68dd3c92b86568b1cd4d',
		'pixabay_language' => 'en',
		'pixabay_image_type' => 'all',
		'pixabay_orientation' => 'all',
	];

	/**
	 * Acf_Images_Search_And_Insert_Settings constructor.
	 */
	function __construct() {
		$options = get_option( 'aisai_options' );
		if ( empty( $options )  ) {
			update_option( 'aisai_options', $this->default_options );
		}
		add_action( 'admin_menu', [ $this, 'aisai_add_settings_menu' ] );
	}

	/**
	 * Handle mthod for admin_menu
	 */
	function aisai_add_settings_menu() {
		add_options_page( __( 'ACF Images Search And Insert Settings', $this->ltd, 'aisai' ), __( 'ACF Images Search And Insert', $this->ltd, 'aisai' ), 'manage_options', 'aisai_settings', [ $this, 'aisai_settings_page' ] );
		add_action( 'admin_init', [ $this, 'register_aisai_options' ] );
	}

	/**
	 * Handle method for add_options_page
	 */
	function aisai_settings_page() {
		?>
		<div class="wrap">
			<h2><?php echo __( 'ACF Images Search And Insert', $this->ltd, 'aisai' ); ?></h2>
			<form method="post" action="options.php">
				<?php
				settings_fields( 'aisai_options' );
				do_settings_sections( 'aisai_settings' );
				submit_button();
				?>
			</form>
		</div>
	<?php
	}

	/**
	 * Handle method for admin_init
	 */
	function register_aisai_options() {

		$options = get_option( 'aisai_options' );

		$this->register_aisai_options_common( $options );
		$this->register_aisai_options_flickr( $options );
		$this->register_aisai_options_pixabay( $options );

		/**
		 * This closure handles saving options
		 */
		register_setting( 'aisai_options', 'aisai_options', function ( $input ) use ( $options ) {

			/**
			 * Common Settings
			 */
			if ( 1 <= $options['per_page'] && $options['per_page'] <= 100 ) {
				$options['per_page'] = $input['per_page'];
			}

			/**
			 * Flickr Settings
			 */
			$options['flickr_apikey'] = $input['flickr_apikey'];

			$licenses = $input['flickr_licenses'];
			if ( count( $licenses ) > 0 ) {
				$options['flickr_licenses'] = implode( ',', $licenses );
			}
			if ( array_key_exists( $input['flickr_sort'], $this->flickr_sort ) ) {
				$options['flickr_sort'] = $input['flickr_sort'];
			}

			/**
			 * Pixabay Settings
			 */
			$options['pixabay_apikey'] = $input['pixabay_apikey'];

			if ( array_key_exists( $input['pixabay_language'], $this->pixabay_languages ) ) {
				$options['pixabay_language'] = $input['pixabay_language'];
			}
			if ( in_array( $input['pixabay_image_type'], [ 'all', 'photo', 'vector' ] ) ) {
				$options['pixabay_image_type'] = $input['pixabay_image_type'];
			}
			if ( in_array( $input['pixabay_orientation'], [ 'all', 'horizontal', 'vertical' ] ) ) {
				$options['pixabay_orientation'] = $input['pixabay_orientation'];
			}

			return $options;
		} );
	}

	/**
	 * Display common settings
	 * @param $options
	 */
	function register_aisai_options_common( $options ) {

		add_settings_section( 'aisai_options_common_section', 'Common', '', 'aisai_settings' );

		add_settings_field( 'common-perpage', __( 'Images Per Page', $this->ltd, 'aisai' ), function () use ( $options ) {
			?>
			<input type="number" name="aisai_options[per_page]" min="10" max="100" value="<?php echo $options['per_page']; ?>" />
			<?php
		}, 'aisai_settings', 'aisai_options_common_section' );
	}

	/**
	 * Display Flickr settings
	 * @param $options
	 */
	function register_aisai_options_flickr( $options ) {
		$licenses = $this->flickr_licenses;
		$sorts = $this->flickr_sort;

		add_settings_section( 'aisai_options_flickr_section', 'Flickr', '', 'aisai_settings' );

		add_settings_field( 'flickr-apikey', __( 'API Key', $this->ltd, 'aisai' ), function () use ( $options ) {
			?>
			<input type="text" name="aisai_options[flickr_apikey]" value="<?php echo $options['flickr_apikey']; ?>" />
			<?php
		}, 'aisai_settings', 'aisai_options_flickr_section' );

		add_settings_field( 'flickr-licenses', __( 'Licenses', $this->ltd, 'aisai' ), function () use ( $options, $licenses ) {
			$selected_licenses = explode( ',', $options['flickr_licenses'] );
			foreach ( $licenses as $k => $v ) {
			?>
				<input name="aisai_options[flickr_licenses][]" type="checkbox" <?php echo in_array( strval( $k ), $selected_licenses ) ? 'checked="checked"' : ''; ?> value="<?php echo $k; ?>"> <?php echo $v; ?>
				<br>
			<?php
			}
		}, 'aisai_settings', 'aisai_options_flickr_section' );

		add_settings_field( 'flickr-sort', __( 'Sort', $this->ltd, 'aisai' ), function () use ( $options, $sorts ) {
			?>
			<select name="aisai_options[flickr_sort]">
				<?php foreach ( $sorts as $k => $v ) : ?>
					<option value="<?php echo $k; ?>" <?php echo $options['flickr_sort'] === $k ? 'selected="selected"' :''; ?>><?php echo $v; ?></option>
				<?php endforeach; ?>
			</select>
			<?php
		}, 'aisai_settings', 'aisai_options_flickr_section' );
	}

	/**
	 * Display Pixabay settings
	 * @param $options
	 */
	function register_aisai_options_pixabay( $options ) {

		$langs = $this->pixabay_languages;

		add_settings_section( 'aisai_options_pixabay_section', 'Pixabay', '', 'aisai_settings' );

		add_settings_field( 'pixabay-apikey', __( 'API Key', $this->ltd, 'aisai' ), function () use ( $options ) {
			?>
			<input type="text" name="aisai_options[pixabay_apikey]" value="<?php echo $options['pixabay_apikey']; ?>" />
			<?php
		}, 'aisai_settings', 'aisai_options_pixabay_section' );

		add_settings_field( 'pixabay-language', __( 'Language', $this->ltd, 'aisai' ), function () use ( $options, $langs ) {
			$set_lang = substr( get_locale(), 0, 2 );
			if ( ! $options['pixabay_language'] ) {
				$options['pixabay_language'] = $langs[ $set_lang ] ? $set_lang : 'en';
			}
			?>
			<select name="aisai_options[pixabay_language]">
				<?php foreach ( $langs as $k => $v ) : ?>
					<option value="<?php echo $k; ?>" <?php echo $options['pixabay_language'] === $k ? 'selected="selected"' :''; ?>><?php echo $v; ?></option>
				<?php endforeach; ?>
			</select>
			<?php
		}, 'aisai_settings', 'aisai_options_pixabay_section' );

		add_settings_field( 'pixabay-imagetype', __( 'Image Type', $this->ltd, 'aisai' ), function () use ( $options ) {
			?>
			<label>
				<input name="aisai_options[pixabay_image_type]" value="all" type="radio" <?php echo ! $options['pixabay_image_type'] | 'all' === $options['pixabay_image_type'] ? 'checked="checked"' : ''; ?>>
				<?php echo __( 'All', $this->ltd, 'aisai' ); ?>
			</label>
			<br>
			<label>
				<input name="aisai_options[pixabay_image_type]" value="photo" type="radio" <?php echo 'photo' === $options['pixabay_image_type'] ? 'checked="checked"' : ''; ?>>
				<?php echo __( 'Photos', $this->ltd, 'aisai' ); ?>
			</label>
			<br>
			<label>
				<input name="aisai_options[pixabay_image_type]" value="vector" type="radio" <?php echo 'vector' === $options['pixabay_image_type'] ? ' checked="checked"' : ''; ?>>
				<?php echo __( 'Vectors', $this->ltd, 'aisai' ); ?>
			</label>
			<?php
		}, 'aisai_settings', 'aisai_options_pixabay_section' );

		add_settings_field( 'pixabay-orientation', __( 'Orientation', $this->ltd, 'aisai' ), function () use ( $options ) {
			?>
			<label>
				<input name="aisai_options[pixabay_orientation]" value="all" type="radio" <?php echo ! $options['pixabay_orientation'] | 'all' === $options['pixabay_orientation'] ? 'checked="checked"' : ''; ?>>
				<?php echo __( 'All', $this->ltd, 'aisai' ); ?>
			</label>
			<br>
			<label>
				<input name="aisai_options[pixabay_orientation]" value="horizontal" type="radio" <?php echo 'horizontal' === $options['pixabay_orientation'] ? 'checked="checked"' : ''; ?>>
				<?php echo __( 'Hozizontal', $this->ltd, 'aisai' ); ?>
			</label>
			<br>
			<label>
				<input name="aisai_options[pixabay_orientation]" value="vertical" type="radio" <?php echo 'vertical' === $options['pixabay_orientation'] ? ' checked="checked"' : ''; ?>>
				<?php echo __( 'Vertical', $this->ltd, 'aisai' ); ?>
			</label>
			<?php
		}, 'aisai_settings', 'aisai_options_pixabay_section' );
	}
}
new Acf_Images_Search_And_Insert_Settings();
