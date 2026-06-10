<?php

/**
 * Implements template_preprocess_page().
 */
function monochrome_preprocess_page(&$variables) {
  backdrop_add_library('system', 'opensans', TRUE);

  $node = menu_get_object();
  if ($node) {
    $variables['classes'][] = 'page-node-' . $node->nid;
  }
  // Add CSS classes to term listing pages.
  $path = current_path();
  if (substr($path, 0, 14) == 'taxonomy/term/') {
    $parts = arg();
    if (count($parts) == 3) {
      $term = taxonomy_term_load($parts[2]);
      $variables['classes'][] = 'term-page';
      $variables['classes'][] = backdrop_clean_css_identifier('term-page-' . $term->name);
    }
  }
  // CSS class for node preview page.
  elseif (substr($path, 0, 13) == 'node/preview/') {
    $variables['classes'][] = 'node-preview-page';
  }
  // Admin pages.
  elseif (substr($path, 0, 6) == 'admin/') {
    $variables['classes'][] = 'admin-page';
  }
  // Older core versions need this override because of dark mode.
  if (version_compare(BACKDROP_VERSION, 1.34, '<')) {
    $theme_path = backdrop_get_path('theme', 'monochrome');
    backdrop_add_css($theme_path . '/css/tabledrag-override.css');
  }
}

/**
 * Implements template_preprocess_node().
 */
function monochrome_preprocess_node(&$variables) {
  if ($variables['status'] == NODE_NOT_PUBLISHED) {
    $name = node_type_get_name($variables['type']);
    $variables['title_suffix']['unpublished_indicator'] = array(
      '#type' => 'markup',
      '#markup' => '<div class="unpublished-indicator">' . t('This @type is unpublished.', array('@type' => $name)) . '</div>',
    );
  }
}

/**
 * Implements template_preprocess_layout().
 */
function monochrome_preprocess_layout(&$variables) {
  // As of core 1.34.0 "layout_info" is null, will get removed in core 2.x.
  $info = $variables['layout_info'] ?? $variables['layout_template_info'];
  if ($info && !empty($info['flexible'])) {
    // Add CSS class to layout based on flexible template machine name.
    $variables['classes'][] = backdrop_clean_css_identifier('layout-' . $info['name']);
  }
}

/**
 * Implements theme_breadcrumb().
 */
function monochrome_breadcrumb($variables) {
  $breadcrumb = $variables['breadcrumb'];
  $output = '';
  if (!empty($breadcrumb)) {
    // Differs to core version in not using "»".
    $output .= '<nav role="navigation" class="breadcrumb">';
    $output .= '<h2 class="element-invisible">' . t('You are here') . '</h2>';
    $output .= '<ol><li>' . implode('</li><li>', $breadcrumb) . '</li></ol>';
    $output .= '</nav>';
  }
  return $output;
}

/**
 * Implements hook_css_alter().
 */
function monochrome_css_alter(&$css) {
  unset($css['core/modules/node/css/node.preview.css']);
}

/**
 * Implements hook_ckeditor_css_alter().
 */
function monochrome_ckeditor_css_alter(&$css, $format) {
  // This theme ships with a custom copy of that file, that otherwise contains
  // unwanted body styles (font, color).
  $key = array_search('core/modules/ckeditor/css/ckeditor-iframe.css', $css);
  unset($css[$key]);
}

/**
 * Implements hook_form_BASE_FORM_ID_alter().
 */
function monochrome_form_node_form_alter(&$form, &$form_state, $form_id) {
  if (!empty($form['title']['#default_value'])) {
    unset($form['title']['#attributes']['autofocus']);
  }
}
