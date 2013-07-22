# Audero Smoke Effect #
[Audero Smoke Effect](https://github.com/AurelioDeRosa/Audero-Smoke-Effect) is a jQuery plugin that let you create a smoke effect for one or more elements, usually images, on your web page. You can create the effect of a little smoke puff, cloud or anything else you want that appears from the elements you chose. This plugin is based on [the concept shown by Gaya](http://www.gayadesign.com/diy/puffing-smoke-effect-in-jquery) but the code has been totally written from scratch and has new features.

## Demo ##
A live demo is available [here](http://htmlpreview.github.io/?https://github.com/AurelioDeRosa/Audero-Smoke-Effect/blob/master/demo/index.html).

## Requirements ##
Being a jQuery plugin, the only requirement is [jQuery](http://www.jquery.com) starting from version **1.2.3**.

## Compatibility ##
It has been tested and works on all the major browsers, including Internet Explorer 6 and later.

## Installation ##
To install this plugin you need to include the script **after** the [jQuery](http://www.jquery.com) library like the following example:

    <script src="path/to/jquery.js"></script>
    <script src="path/to/jquery.auderoSmokeEffect.js"></script>

## Usage ##
This plugin is very simple to use yet flexible, as you'll learn in the "Options" section. To use it, you have to call the `auderoSmokeEffect()` method on the element(s) you want to apply the effect passing an object with the options you want to set. The basic use of this plugin only require that you specify the `imagePath` property, to set the path to the image that will be used for the effect.
For example, let that you have the following HTML code:

    <img id="chicken" src="images/chicken.png" />

and an image called `smoke.png` inside a folder called `images`, you can run the effect in this way:

    $(window).load(function () {
       $("#chicken").auderoSmokeEffect({
          imagePath: "images/smoke.png"
       });
    });

**Note**: It's suggested to start the animation after the window is fully loaded, that is as a callback of the <code>load</code> event of the <code>window</code> object, because there is no point in running the effect before the user is able to see the complete page.

### Disable the effect ###
After you initialize the plugin, you have the chance to disable it at any time. To disable the effect, you have to call the `auderoSmokeEffect()` method passing the string `disable`, as you can see in the next example:

    <script>
       $("#chicken").auderoSmokeEffect('disable');
    </script>

### Enable the effect ###
Once you disabled the plugin you may want to enable it again. To do this, you have to call the `auderoSmokeEffect()` method passing the string `enable` as shown in the next snippet:

    <script>
       $("#chicken").auderoSmokeEffect('enable');
    </script>

### Toggle the effect ###
In some cases you may want to toggle the effect, for example based on a user action. Let's say that you want to enable/disable the animation when a user clicks a button. To achieve this goal, you have to call the `auderoSmokeEffect()` method passing the string `toggle`.
So, let that you have the following HTML code:

    <img id="chicken" src="images/chicken.png" />
    <button id="toggle-button">Toggle animation</button>

You can bind the `click` event on the `<button>` to toggle the animation as shown in the following snippet:

    $("#toggle-button").click(function() {
       $("#chicken").auderoSmokeEffect('toggle');
    });

### Destroy the effect ###
Under some circumstances you may want to stop the animation and clean all the resources. To perform this task, you can call the `auderoSmokeEffect()` method passing the string `destroy`. To see it in action, take a look at the following snippet:

    <script>
       $("#chicken").auderoSmokeEffect('destroy');
    </script>

## Options ##
Audero Smoke Effect has several options that allow you to create a highly customizable animation. You can set them during the initial call to the `auderoSmokeEffect()` method. The available options are:

* `imagePath` (`string`. Default: `null`): The path to locate the smoke image. This is the only **required** property.
* `isEnabled` (`boolean`. Default: `true`): The state of the animation. If the value is false, the animation will stop keeping its current options.
* `width` (`number`. Default: `0`): The width of the image shown to simulate the smoke. If the value is `0`, the width of the image will be used.
* `height` (`number`. Default: `0`): The height of the image shown to simulate the smoke. If the value is `0`, the height of the image will be used.
* `repeat` (`number`. Default: `-1`): The number of times to repeat the animation. -1 means unlimited.
* `pause` (`number`. Default: `2000`): The time (milliseconds) between animations. Set to `random` to have a random time.
* `speed` (`number`. Default: `4000`): The time (milliseconds) taken by the animation.
* `posX` (`number`. Default: `null`): The X coordinate used as start point for the animation. If the value is `null`, the effect will run at the center of the element, based on its width.
* `posY` (`number`. Default: `null`): The Y coordinate used as start point for the animation. If the value is `null`, the effect will run at the center of the element, based on its height.

### Override default values ###
[Audero Smoke Effect](https://github.com/AurelioDeRosa/Audero-Smoke-Effect) has been developed following the current best practices in developing plugins for jQuery. Therefore, it exposes the previously cited options through the `defaults` object, allowing you to override the properties' default value. This is very useful if you usually use the same values to run the animation. In fact, changing the default values, you don't need to specify them again when you initialize the effect.
For example, let that you have the following code:

    <script>
       $(window).load(function() {
          $("#chicken").auderoSmokeEffect({
             imagePath: "images/smoke.png",
             repeat: 5,
             pause: 5000,
             speed: 3000
          });
          $("#chicken-2").auderoSmokeEffect({
             imagePath: "images/cloud.png",
             repeat: 5,
             pause: 5000,
             speed: 3000
          });
       });
    </script>

Overriding the default values you can turn it into the following:

    <script>
       $(window).load(function() {
          $.fn.auderoSmokeEffect.defaults.repeat = 5;
          $.fn.auderoSmokeEffect.defaults.pause = 5000;
          $.fn.auderoSmokeEffect.defaults.speed = 3000;
          $("#chicken").auderoSmokeEffect({
             imagePath: "images/smoke.png"
          });
          $("#chicken-2").auderoSmokeEffect({
             imagePath: "images/cloud.png"
          });
       });
    </script>

## Advanced Examples ##
### Example 1 ###
This first example shows the use of some of the options seen before and that is `repeat`, `pause` and `speed`. In this example, the animation runs exactly five times, each puff starts five seconds after the previous one, and the animation last three seconds.
The code to achieve this goal is the following:

    <script>
       $(window).load(function() {
          $("#chicken").auderoSmokeEffect({
             imagePath: "images/smoke.png",
             repeat: 5,
             pause: 5000,
             speed: 3000
          });
       });
    </script>

### Example 2 ###
This second example demonstrates how you can start the animated image from a custom point in the page, how to set a specific width and height in case you don't want to use the image's original size, and how you can start the animation only when a user clicks on a given button. Specifically, the animation will start from the top-left corner of the element.
Let that you have the following HTML code:

    <img id="chicken" src="images/chicken.png" />
    <button id="run-button">Run animation</button>

The code of this example is listed below:

    <script>
       $(window).load(function() {
          $("#run-button").click(function() {
             $("#chicken").auderoSmokeEffect({
                imagePath: "images/smoke.png",
                width: 200,
                height: 200,
                posX: 0,
                posY: 0,
                repeat: 1
             });
          });
       });
    </script>

## License ##
[Audero Smoke Effect](https://github.com/AurelioDeRosa/Audero-Smoke-Effect) is dual licensed under [MIT](http://www.opensource.org/licenses/MIT) and [GPL-3.0](http://opensource.org/licenses/GPL-3.0)

## Authors ##
[Aurelio De Rosa](http://www.audero.it) ([@AurelioDeRosa](https://twitter.com/AurelioDeRosa))