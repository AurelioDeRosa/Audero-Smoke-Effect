/*
 * Audero Smoke Effect is a jQuery plugin that let you create a smoke effect for one or more elements,
 * usually images, on your web page. You can create the effect of a little smoke puff, cloud or anything
 * else you want that appears from the elements you chose. This plugin is based on
 * the concept shown by Gaya (http://www.gayadesign.com/diy/puffing-smoke-effect-in-jquery) but the code
 * has been totally written from scratch and has new features.
 *
 * @author  Aurelio De Rosa <aurelioderosa@gmail.com>
 * @version 1.1.0
 * @link    https://github.com/AurelioDeRosa/Audero-Smoke-Effect
 * @license Dual licensed under MIT (http://www.opensource.org/licenses/MIT)
 * and GPL-3.0 (http://opensource.org/licenses/GPL-3.0)
 */
(function ($) {
   // Private properties and methods
   var dataAttributeName = "audero-smoke-effect";
   var createPuff = function ($element) {
      var position = $element.offset();
      var options = $element.data(dataAttributeName);

      // Create the smoke puff
      var $smokePuff = $("<img/>")
         .attr("src", options.imagePath)
         .css({
            position: "absolute",
            width: 0,
            height: 0,
            opacity: 0.4,
            "z-index": 1000,
            top: (position.top + options.posY) + "px",
            left: (position.left + options.posX) + "px"
         });

      // Append the smoke puff to the body
      $("body").append($smokePuff);

      // Run the animation
      $smokePuff
         .animate({
            width: options.width + "px",
            height: options.height + "px",
            marginLeft: "-" + (options.width / 2) + "px",
            marginTop: "-" + (options.height * 1.5) + "px",
            opacity: 0.9
         },
         options.speed * (1 / 3)
      )
         .animate({
            marginTop: "-" + (options.height * 5) + "px",
            opacity: 0
         },
         options.speed * (2 / 3),
         function() {
            $(this).remove();

            if (options.repeat > 0) {
               options.repeat--;
            }
            // Generate a random pause
            var time = (options.pause === "random") ? options.speed * (1 / 3) + Math.round(Math.random() * 2000) : options.pause;

            $element.data(dataAttributeName, options);
            // If the animation is enabled test if it should run again
            if (options.isEnabled === true) {
               // If the repetition limit is not reached, the animation method will run again
               if (options.repeat !== 0) {
                  setTimeout(function () { createPuff($element); }, time);
               } else {
                  methods.destroy.apply([$element]);
               }
            }
         }
      );
   };
   var isRunning = function($element) {
      var options = $element.data(dataAttributeName);
      return (options !== undefined && options.isEnabled === true);
   };

   // Public methods
   var methods = {
      init: function (options) {
         options = $.extend(true, {}, $.fn.auderoSmokeEffect.defaults, options);

         // Check if the properties have valid values
         if (options.imagePath === null) {
            $.error("To run jQuery.auderoSmokeEffect you must specify at least the imagePath options");
            return;
         }
         if (options.width < 0) {
            $.error("jQuery.auderoSmokeEffect can't show an image with a negative width");
            return;
         }
         if (options.height < 0) {
            $.error("jQuery.auderoSmokeEffect can't show an image with a negative height");
            return;
         }
         if (options.repeat <= 0 && options.repeat !== -1) {
            $.error("jQuery.auderoSmokeEffect should run at least one time");
            return;
         }
         if (options.pause !== "random" && options.pause < 0) {
            $.error("jQuery.auderoSmokeEffect should run the animation with a pause equal to or greater than zero");
            return;
         }
         if (options.speed <= 0) {
            $.error("jQuery.auderoSmokeEffect should run the animation with a speed greater than zero");
            return;
         }

         // Run the animation once the image is completely loaded
         var elements = this;
         var image = new Image();
         image.onload = function() {
            var $current;
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
            for (var i = 0; i < elements.length; i++) {
               $current = $(elements[i]);
               // Clone the options object so elements will have the same values without sharing the same object
               $current.data(dataAttributeName, $.extend(true, {}, options));
               if (options.isEnabled === true) {
                  createPuff($current);
               }
            }
         };
         image.src = options.imagePath;

         return this;
      },
      enable: function () {
         var $current;
         for (var i = 0; i < this.length; i++) {
            $current = $(this[i]);
            if (!isRunning($current)) {
               $current.data(dataAttributeName).isEnabled = true;
               createPuff($current);
            }
         }

         return this;
      },
      disable: function () {
         var $current;
         for (var i = 0; i < this.length; i++) {
            $current = $(this[i]);
            if (isRunning($current)) {
               $current.data(dataAttributeName).isEnabled = false;
               $current.stop(true, true);
            }
         }

         return this;
      },
      toggle: function() {
         var $current;
         for (var i = 0; i < this.length; i++) {
            $current = $(this[i]);
            if (isRunning($current)) {
               methods.disable.apply([$current]);
            } else {
               methods.enable.apply([$current]);
            }
         }

         return this;
      },
      destroy: function () {
         for (var i = 0; i < this.length; i++) {
            $(this[i])
               .stop(true, true)
               .removeData(dataAttributeName);
         }

         return this;
      }
   };

   $.fn.auderoSmokeEffect = function (method) {
      if (methods[method]) {
         return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      }
      else if (typeof method === "object" || !method) {
         return methods.init.apply(this, arguments);
      }
      else {
         $.error("Method " + method + " does not exist on jQuery.auderoSmokeEffect");
      }
   };

   $.fn.auderoSmokeEffect.defaults = {
      imagePath: null, // string (required). The path to locate the smoke image
      isEnabled: true, // boolean (optional). The state of the animation. If the value is false, the animation will stop keeping its current options.
      width: 0,        // number (optional). The width of the image shown to simulate the smoke. If the value is 0 demonstrate, the width of the image will be used.
      height: 0,       // number (optional). The height of the image shown to simulate the smoke. If the value is 0, the height of the image will be used.
      repeat: -1,      // number (optional). The number of times to repeat the animation. -1 means unlimited
      pause: 2000,     // number (optional). The time (milliseconds) between animations. Set to "random" to have a random time
      speed: 4000,     // number (optional). The time (milliseconds) taken by the animation
      posX: null,      // number (optional). The X coordinate used as start point for the animation. If the value is null, the effect will run at the center of the element, based on its width.
      posY: null       // number (optional). The Y coordinate used as start point for the animation. If the value is null, the effect will run at the center of the element, based on its height.
   };
})(jQuery);
