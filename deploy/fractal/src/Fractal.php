<?php
/**
 * Fractal plugin for Craft CMS 3.x
 *
 * Custom Fractal plugin
 *
 * @link      http://ournameismud.co.uk/
 * @copyright Copyright (c) 2018 Rich @ Mud
 */

namespace ournameismud\fractal;

require 'FractalTemplateLoader.php';
use Craft;
//use FractalTemplateLoader;
use craft\base\Plugin;
use craft\services\Plugins;
use craft\events\PluginEvent;
use craft\web\twig\Environment;
use craft\web\twig\Extension;
use craft\web\twig\Template;
use craft\web\twig\TemplateLoader;
use craft\web\View;

use yii\base\Exception;
use yii\base\Event;

/**
 * Craft plugins are very much like little applications in and of themselves. We’ve made
 * it as simple as we can, but the training wheels are off. A little prior knowledge is
 * going to be required to write a plugin.
 *
 * For the purposes of the plugin docs, we’re going to assume that you know PHP and SQL,
 * as well as some semi-advanced concepts like object-oriented programming and PHP namespaces.
 *
 * https://craftcms.com/docs/plugins/introduction
 *
 * @author    Rich @ Mud
 * @package   Fractal
 * @since     1.0.0
 *
 */
class Fractal extends Plugin
{
    // Static Properties
    // =========================================================================

    /**
     * Static property that is an instance of this plugin class so that it can be accessed via
     * Fractal::$plugin
     *
     * @var Fractal
     */
    public static $plugin;

    // Public Properties
    // =========================================================================

    /**
     * To execute your plugin’s migrations, you’ll need to increase its schema version.
     *
     * @var string
     */
    public $schemaVersion = '1.0.0';

    // Public Methods
    // =========================================================================

    /**
     * Set our $plugin static property to this class so that it can be accessed via
     * Fractal::$plugin
     *
     * Called after the plugin class is instantiated; do any one-time initialization
     * here such as hooks and events.
     *
     * If you have a '/vendor/autoload.php' file, it will be loaded for you automatically;
     * you do not need to load it in your init() method.
     *
     */
    public function init()
    {
        parent::init();
        self::$plugin = $this;

        // Do something after we're installed
        Event::on(
            Plugins::class,
            Plugins::EVENT_AFTER_INSTALL_PLUGIN,
            function (PluginEvent $event) {
                if ($event->plugin === $this) {
                    // We were just installed
                }
            }
        );

/**
 * Logging in Craft involves using one of the following methods:
 *
 * Craft::trace(): record a message to trace how a piece of code runs. This is mainly for development use.
 * Craft::info(): record a message that conveys some useful information.
 * Craft::warning(): record a warning message that indicates something unexpected has happened.
 * Craft::error(): record a fatal error that should be investigated as soon as possible.
 *
 * Unless `devMode` is on, only Craft::warning() & Craft::error() will log to `craft/storage/logs/web.log`
 *
 * It's recommended that you pass in the magic constant `__METHOD__` as the second parameter, which sets
 * the category to the method (prefixed with the fully qualified class name) where the constant appears.
 *
 * To enable the Yii debug toolbar, go to your user account in the AdminCP and check the
 * [] Show the debug toolbar on the front end & [] Show the debug toolbar on the Control Panel
 *
 * http://www.yiiframework.com/doc-2.0/guide-runtime-logging.html
 */
        Craft::info(
            Craft::t(
                'fractal',
                '{name} plugin loaded',
                ['name' => $this->name]
            ),
            __METHOD__
				);
				
				//TemplatesService::getTwig()->setLoader();
				$twig = Craft::$app->getView()->getTwig()->setLoader(new FractalTemplateLoader());
				
				//craft()->templates->getTwig()->setLoader(new FractalTemplateLoader());
    }

    // Protected Methods
		// =========================================================================

}

class FractalTemplateLoader implements \Twig_LoaderInterface, \Twig_ExistsLoaderInterface
{

		
		public function exists($name)
		{
			return Craft::$app->templates->doesTemplateExist($name);
		}

		public function getSourceContext($name)
		{
				//throw new Exception($name);
        $template = $this->_findTemplate($name);

        if (!is_readable($template)) {
            //throw new TemplateLoaderException($name, Craft::t('app', 'Tried to read the template at {path}, but could not. Check the permissions.', ['path' => $template]));
						//throw new Exception($template);
					}

        return new \Twig_Source(file_get_contents($template), $name, $template);
		}

		public function getCacheKey($name)
		{
			if (is_string($name))
			{
				return $this->_findTemplate($name);
			}
			else
			{
				return $name->cacheKey;
			}
		}

		public function isFresh($name, $time)
		{
			// If this is a CP request and a DB update is needed, force a recompile.
			$request = Craft::$app->getRequest();
			if ($request->getIsCpRequest() && Craft::$app->getUpdates()->getIsCraftDbMigrationNeeded()) {
					return false;
			}

			if (is_string($name)) {
					$sourceModifiedTime = filemtime($this->_findTemplate($name));

					return $sourceModifiedTime <= $time;
			}

			return false;
		}

			private function _findTemplate($name)
	{
		
        if (strpos($name, '@') === 0)
        {
						$mappingPath = CRAFT_BASE_PATH. '/components-map.json';
            if (is_readable($mappingPath))
            {
                $mappings = json_decode(file_get_contents($mappingPath));
                if ($mappings->$name) {
                    if (strpos($mappings->$name, '/') !== 0) {
												//throw new Exception(realpath(CRAFT_BASE_PATH) . '/' . $mappings->$name->dest . '/' . $mappings->$name->file);
												$template = realpath(CRAFT_BASE_PATH) . '/templates/' . $mappings->$name;
                    } else {
                        $template = $mappings->$name;
                    }
                }
            }
            else
            {
                throw new Exception(Craft::t('Could not read Fractal mappings file at %s.', array('path' => FRACTAL_COMPONENTS_MAP)));
            }
        }
        else
        {
						$template = Craft::$app->getView()->resolveTemplate($name);
        }
		if (!$template)
		{
			//throw new TemplateLoaderException($name);
			throw new TemplateLoaderException($name, Craft::t('app', 'Unable to find the template “{template}”.', ['template' => $name]));
		}
		return $template;
	}

}
