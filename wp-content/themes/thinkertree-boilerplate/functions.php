<?php
/**
 * thinkertree-boilerplate functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package thinkertree-boilerplate
 */

if ( ! function_exists( 'thinkertree_boilerplate_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function thinkertree_boilerplate_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on thinkertree-boilerplate, use a find and replace
		 * to change 'thinkertree-boilerplate' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'thinkertree-boilerplate', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'primary_menu' => esc_html__( 'Primary Menu', 'thinkertree-boilerplate' ),
			// 'secondary_top_menu' => esc_html__( 'Secondary Top Menu', 'thinkertree-boilerplate' ),
			'footer_menu' => esc_html__( 'Footer Menu', 'thinkertree-boilerplate' ),
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'thinkertree_boilerplate_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		) );
	}
endif;
add_action( 'after_setup_theme', 'thinkertree_boilerplate_setup' );


/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function thinkertree_boilerplate_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'thinkertree_boilerplate_content_width', 640 );
}
add_action( 'after_setup_theme', 'thinkertree_boilerplate_content_width', 0 );


/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function thinkertree_boilerplate_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'thinkertree-boilerplate' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', 'thinkertree-boilerplate' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'thinkertree_boilerplate_widgets_init' );


/**
 * Enqueue scripts and styles.
 */
function thinkertree_boilerplate_scripts() {

	// CSS Queue
	wp_enqueue_style( 'bootstrap', get_stylesheet_uri() . '/dist/stylesheets/bootstrap.css', array(), filemtime( get_stylesheet_uri() . '/dist/stylesheets/bootstrap.css' ), 'all' );
	wp_enqueue_style( 'thinkertree-boilerplate', get_stylesheet_uri() . '/dist/stylesheets/main.css', array(), filemtime( get_stylesheet_uri() . '/dist/stylesheets/main.css' ), 'all' );

	// JS Queue
	wp_enqueue_script( 'thinkertree-boilerplate-navigation', get_template_directory_uri() . '/source/javascripts/default/navigation.js', array(), '20151215', true );

	wp_enqueue_script( 'thinkertree-boilerplate-skip-link-focus-fix', get_template_directory_uri() . '/source/javascripts/default/skip-link-focus-fix.js', array(), '20151215', true );

	// bundle.js contains jQuery, Bootstrap, matchHeight, and main JS scripts
	wp_enqueue_script( 'thinkertree-boilerplate-js', get_template_directory_uri() . '/dist/javascripts/bundle.js', array(), filemtime( get_template_directory_uri() . '/dist/javascripts/bundle.js' ), true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'thinkertree_boilerplate_scripts' );


/**
 * Add Options Page in ACF Pro
 */
if( function_exists('acf_add_options_page') ) {
	acf_add_options_page();
}


/**
 * Thumbnail Upscale
 */
function thinkertree_boilerplate_thumbnail_upscale( $default, $orig_w, $orig_h, $new_w, $new_h, $crop ){
    if ( !$crop ) return null; // let the wordpress default function handle this
	 
	$aspect_ratio = $orig_w / $orig_h;
	$size_ratio = max($new_w / $orig_w, $new_h / $orig_h);
	 
	$crop_w = round($new_w / $size_ratio);
	$crop_h = round($new_h / $size_ratio);
	 
	$s_x = floor( ($orig_w - $crop_w) / 2 );
	$s_y = floor( ($orig_h - $crop_h) / 2 );
	 
	return array( 0, 0, (int) $s_x, (int) $s_y, (int) $new_w, (int) $new_h, (int) $crop_w, (int) $crop_h );
}
add_filter( 'image_resize_dimensions', 'thinkertree_boilerplate_thumbnail_upscale', 10, 6 );


/**
 * Custom Image Sizes
 */
function thinkertree_boilerplate_custom_image_sizes() {
	// add_image_size('medium-large', 800, 800);
	// add_image_size('hero-image', 1665, 9999);
}
add_action('after_setup_theme', 'thinkertree_boilerplate_custom_image_sizes');


/**
 * Page Slug Body Class
 */
function add_slug_body_class( $classes ) {
	global $post;
	if ( isset( $post ) ) {
		$classes[] = $post->post_type . '-' . $post->post_name;
	}
	return $classes;
}
add_filter( 'body_class', 'add_slug_body_class' );


/**
 * Custom Post Type
 */
function thinkertree_boilerplate_custom_post_type() {
	// Set UI labels for Custom Post Type
	$labels = array(
	    'name'                => _x( 'Member Pages', 'Post Type General Name', 'thinkertree_boilerplate' ),
	    'singular_name'       => _x( 'Member Page', 'Post Type Singular Name', 'thinkertree_boilerplate' ),
	    'menu_name'           => __( 'Member Pages', 'thinkertree_boilerplate' ),
	    'parent_item_colon'   => __( 'Parent Member Page', 'thinkertree_boilerplate' ),
	    'all_items'           => __( 'All Member Pages', 'thinkertree_boilerplate' ),
	    'view_item'           => __( 'View Member Page', 'thinkertree_boilerplate' ),
	    'add_new_item'        => __( 'Add New Member Page', 'thinkertree_boilerplate' ),
	    'add_new'             => __( 'Add New', 'thinkertree_boilerplate' ),
	    'edit_item'           => __( 'Edit Member Page', 'thinkertree_boilerplate' ),
	    'update_item'         => __( 'Update Member Page', 'thinkertree_boilerplate' ),
	    'search_items'        => __( 'Search Member Page', 'thinkertree_boilerplate' ),
	    'not_found'           => __( 'Not Found', 'thinkertree_boilerplate' ),
	    'not_found_in_trash'  => __( 'Not found in Trash', 'thinkertree_boilerplate' ),
	);
	     
	// Set other options for Custom Post Type
	     
	$args = array(
	    // 'label'               => __( 'member pages', 'thinkertree_boilerplate' ),
	    'description'         => __( 'Member only pages', 'thinkertree_boilerplate' ),
	    'labels'              => $labels,
	    // Features this CPT supports in Post Editor
	    'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),
	    // You can associate this CPT with a taxonomy or custom taxonomy. 
	    // 'taxonomies'          => array( '' ),
	    /* A hierarchical CPT is like Pages and can have
	     * Parent and child items. A non-hierarchical CPT
	     * is like Posts.
	    */ 
	    'hierarchical'        => false,
	    'public'              => true,
	    'show_ui'             => true,
	    'show_in_menu'        => true,
	    'show_in_nav_menus'   => true,
	    'show_in_admin_bar'   => true,
	    'menu_position'       => 5,
	    'can_export'          => true,
	    'has_archive'         => false,
	    'exclude_from_search' => false,
	    'publicly_queryable'  => true,
	    'capability_type'     => 'page',
	    'rewrite'			  => array('slug' => 'member-pages'),
	);
	     
	// Registering your Custom Post Type
	register_post_type( 'member_pages', $args );
}
	 
/* Hook into the 'init' action so that the function
 * Containing our post type registration is not 
 * unnecessarily executed. 
*/	 
add_action( 'init', 'thinkertree_boilerplate_custom_post_type', 0 );


/**
 * Set excerpt length
 */
// function custom_excerpt_length( $length ) {
// 	return 30;
// }
// add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );


/**
 * Read More Excerpt link
 */
// function new_excerpt_more($more) {
// 	global $post;
// 	return '… <a href="'. get_permalink($post->ID) . '" class="read-more-link">' . 'Read More &raquo;' . '</a>';
// }
// add_filter('excerpt_more', 'new_excerpt_more');


/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

