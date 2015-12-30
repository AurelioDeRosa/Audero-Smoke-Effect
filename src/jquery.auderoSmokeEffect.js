'use strict';

(function(factory) {
   if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
   } else if (typeof module === 'object' && module.exports) {
      module.exports = function(root, jQuery) {
         if (jQuery === undefined) {
            jQuery = typeof window !== 'undefined' ? require('jquery') : require('jquery')(root);
         }

         factory(jQuery);

         return jQuery;
      };
   } else {
      factory(jQuery);
   }
}(function($) {
   /**
    * The jQuery plugin namespace
    *
    * @external "jQuery.fn"
    * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
    */

   /**
    * @typedef SettingsHash
    * @type {Object}
    * @property {string} imagePath The path to locate the smoke image
    * @property {boolean} [isEnabled=true]  The state of the animation. If the value is <code>false</code>, the
    * animation will stop keeping its current options.
    * @property {number} [width=0] The width of the image shown to simulate the smoke. If the value is <code>0</code>,
    * the width of the image will be used.
    * @property {number} [height=0] The height of the image shown to simulate the smoke. If the value is <code>0</code>,
    * the height of the image will be used.
    * @property {number} [repeat=-1] The number of times to repeat the animation. <code>-1</code> means unlimited
    * @property {number} [pause=2000] The time (milliseconds) between animations. Set to <code>"random"</code> to
    * have a random time
    * @property {number} [speed=4000] The time (milliseconds) taken by the animation
    * @property {?number} [posX=null] The X coordinate used as start point for the animation. If the value is
    * <code>null</code>, the effect will run at the center of the element, based on its width.
    * @property {?number} [posY=null] The Y coordinate used as start point for the animation. If the value is
    * <code>null</code>, the effect will run at the center of the element, based on its height.
    */

   /**
    * @typedef MethodsHash
    * @type {Object}
    * @property {init} init The method to initialize the plugin
    * @property {destroy} destroy The method to stop the animation and clean all the resources
    * @property {disable} disable The method to disable the animation
    * @property {enable} enable The method to enable the animation
    * @property {toggle} toggle The method to toggle the animation
    */

   /**
    * The namespace used to store the data
    *
    * @type {string}
    */
   var namespace = 'audero-smoke-effect';

   /**
    * Creates a puff animation on an element
    *
    * @param {jQuery} $element The jQuery collection, containing a single element, to run the puff animation
    */
   function createPuff($element) {
      var position = $element.offset();
      var options = $element.data(namespace);

      // Create the smoke puff
      var $smokePuff = $('<img/>')
         .attr('src', options.imagePath)
         .css({
            position: 'absolute',
            width: 0,
            height: 0,
            opacity: 0.4,
            zIndex: 1000,
            top: position.top + options.posY,
            left: position.left + options.posX
         });

      // Append the smoke puff to the body
      $('body').append($smokePuff);

      // Run the animation
      $smokePuff
         .animate(
            {
               width: options.width,
               height: options.height,
               marginLeft: -1 * options.width / 2,
               marginTop: -1 * options.height * 1.5 ,
               opacity: 0.9
            },
            options.speed * 1 / 3
         )
         .animate(
            {
               marginTop: -1 * options.height * 5,
               opacity: 0
            },
            options.speed * 2 / 3,
            function() {
               $smokePuff.remove();

               if (options.repeat > 0) {
                  options.repeat--;
               }

               // Generate a random pause
               var randomPause = options.speed * 1 / 3 + Math.round(Math.random() * 2000);
               var time = options.pause === 'random' ? randomPause : options.pause;

               $element.data(namespace, options);

               // If the animation is enabled, test if it should run again
               if (options.isEnabled === true) {
                  // If the repetition limit is not reached, the animation method will run again
                  if (options.repeat !== 0) {
                     setTimeout(function() {
                        createPuff($element);
                     }, time);
                  } else {
                     destroy($element);
                  }
               }
            }
         );
   }

   /**
    * Tests if the element has an animation running
    *
    * @param {jQuery} $element The jQuery collection, containing a single element, to test
    *
    * @return {boolean}
    */
   function isRunning($element) {
      var options = $element.data(namespace);

      return $.type(options) === 'object' && options.isEnabled === true;
   }

   /**
    * Checks if the options have valid values
    *
    * @param {SettingsHash} options An object of options to customize the plugin
    */
   function validateOptions(options) {
      /* jshint -W074 */
      if (options.imagePath === null) {
         $.error('To run jQuery.auderoSmokeEffect you must specify at least the imagePath options');
      }

      if (options.width < 0) {
         $.error('jQuery.auderoSmokeEffect can\'t show an image with a negative width');
      }

      if (options.height < 0) {
         $.error('jQuery.auderoSmokeEffect can\'t show an image with a negative height');
      }

      if (options.repeat <= 0 && options.repeat !== -1) {
         $.error('jQuery.auderoSmokeEffect should run at least once');
      }

      if (options.pause !== 'random' && options.pause < 0) {
         $.error('jQuery.auderoSmokeEffect should run the animation with a pause equal to or greater than zero');
      }

      if (options.speed <= 0) {
         $.error('jQuery.auderoSmokeEffect should run the animation with a speed greater than zero');
      }
   }

   /**
    * Initializes the plugin
    *
    * @callback init
    *
    * @param {jQuery} $elements The jQuery collection to work with
    * @param {SettingsHash} options An object of options to customize the plugin
    *
    * @return {jQuery}
    */
   function init($elements, options) {
      /* jshint +W074 */
      options = $.extend({}, $.fn.auderoSmokeEffect.defaults, options);

      validateOptions(options);

      // Run the animation once the image is completely loaded
      var image = new Image();

      image.addEventListener('load', function() {
         if (options.width === 0) {
            options.width = this.width;
         }

         if (options.height === 0) {
            options.height = this.height;
         }

         if (options.posX === null) {
            options.posX = this.width / 2;
         }

         if (options.posY === null) {
            options.posY = this.height / 2;
         }

         $elements.each(function() {
            var $current = $(this);

            // Clone the options object so elements will have the same values without sharing the same object
            $current.data(namespace, $.extend({}, options));

            if (options.isEnabled === true) {
               createPuff($current);
            }
         });
      });

      image.src = options.imagePath;

      return $elements;
   }

   /**
    * Immediately completes the currently running puff animation and
    * blocks those left
    *
    * @callback disable
    *
    * @param {jQuery} $elements The jQuery collection to work with
    *
    * @return {jQuery}
    */
   function disable($elements) {
      $elements.each(function() {
         var $current = $(this);

         if (isRunning($current)) {
            $current.data(namespace).isEnabled = false;
            $current.stop(true, true);
         }
      });

      return $elements;
   }

   /**
    * Restarts the puff animations
    *
    * @callback enable
    *
    * @param {jQuery} $elements The jQuery collection to work with
    *
    * @return {jQuery}
    */
   function enable($elements) {
      $elements.each(function() {
         var $current = $(this);

         if (!isRunning($current)) {
            $current.data(namespace).isEnabled = true;
            createPuff($current);
         }
      });

      return $elements;
   }

   /**
    * Disables the puff animations for elements that are currently running them and
    * enables the animations again for elements that are not running the animation
    *
    * @callback toggle
    *
    * @param {jQuery} $elements The jQuery collection to work with
    *
    * @return {jQuery}
    */
   function toggle($elements) {
      $elements.each(function() {
         var $current = $(this);

         if (isRunning($current)) {
            disable($current);
         } else {
            enable($current);
         }
      });

      return $elements;
   }

   /**
    * Stops the animation and clean all the resources
    *
    * @callback destroy
    *
    * @param {jQuery} $elements The jQuery collection to work with
    *
    * @return {jQuery}
    */
   function destroy($elements) {
      $elements.each(function() {
         $(this)
            .stop(true, true)
            .removeData(namespace);
      });

      return $elements;
   }

   /**
    * The object containing all the public methods
    *
    * @type {MethodsHash}
    */
   var methods = {
      init: init,
      destroy: destroy,
      disable: disable,
      enable: enable,
      toggle: toggle
   };

   /**
    * Creates a smoke effect for one or more elements
    *
    * @function external:"jQuery.fn".auderoSmokeEffect
    *
    * @param {(SettingsHash|string)} method The options to initialize the plugin or the name of the method to call
    *
    * @return {jQuery}
    */
   $.fn.auderoSmokeEffect = function(method) {
      var args = Array.prototype.slice.call(arguments);

      if (methods[method]) {
         return methods[method].apply(this, [this].concat(args.splice(0, 1)));
      } else if ($.type(method) === 'object') {
         return methods.init.apply(this, [this].concat(args));
      } else {
         $.error('Method ' + method + ' does not exist on jQuery.auderoSmokeEffect');
      }
   };

   /**
    * The default options of the plugin
    *
    * @type {SettingsHash}
    */
   $.fn.auderoSmokeEffect.defaults = {
      imagePath: null,
      isEnabled: true,
      width: 0,
      height: 0,
      repeat: -1,
      pause: 2000,
      speed: 4000,
      posX: null,
      posY: null
   };
}));