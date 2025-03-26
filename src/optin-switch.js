/**
 * WonderPush Web SDK plugin to present the user with a switch she can use to opt-in or opt-out to push notifications.
 *
 * When loaded, the plugin looks for placeholder elements like the following, and fleshes them out to a beautiful switch:
 *
 * ```xml
 * <div id="wonderpush-subscription-switch"></div>
 * ```
 *
 * In addition to being customizable using the plugin options, the switch can easily be customized using `data-` attributes.
 * Here is an example:
 *
 * ```xml
 * <div id="wonderpush-subscription-switch"
 *   data-prepend="<div class=&amp;quot;some-wrapper&amp;quot;>"
 *   data-append="</div>"
 *   data-sentence="Receive the latest news by push notifications: "
 *   data-class="some-stylish-class"
 *   data-color-off="red"
 *   data-color-on="green"
 *   data-off="NO"
 *   data-on="YES"
 *   >
 *     <!-- Any content will be replaced with the switch, if push notifications are supported. -->
 *     Sorry, push notifications are not supported by your browser.
 * </div>
 * ```
 *
 * @class OptinSwitch
 * @param {external:WonderPushPluginSDK} WonderPushSDK - The WonderPush SDK instance provided automatically on intanciation.
 * @param {OptinSwitch.Options} options - The plugin options.
 */
/**
 * @typedef {Object} OptinSwitch.Options
 *
 * Almost all options given here can be controlled from the placeholder element included in the page.
 *
 * @property {string} [switchElementId="wonderpush-subscription-switch"]
 *   The id of the placeholder element this the SDK will use to flesh out a subscription switch.
 *
 *   This option cannot be overridden the placeholder element unlike other options,
 *   moreover the element id must match the given value.
 *
 * @property {string} [classPrefix="wp-"]
 *   The prefix to prepend to all the CSS classes names used.
 *   If the default style does not suit you, you can either override some rules,
 *   or use a whole new ruleset by changing this prefix.
 *
 *   You can override it from the placeholder element using the `data-class-prefix` attribute.
 *
 * @property {string} [prepend]
 *   Optional HTML code to inject before the actual switch element.
 *   Escape your double quotes properly, and pay extra attention not to create syntax errors or malformed HTML!
 *
 *   You can override it from the placeholder element using the `data-prepend` attribute.
 *
 * @property {string} [append]
 *   Optional HTML code to inject after the actual switch element.
 *   Escape your double quotes properly, and pay extra attention not to create syntax errors or malformed HTML!
 *
 *   You can override it from the placeholder element using the `data-append` attribute.
 *
 * @property {string} [sentence]
 *   HTML snippet to inject in a SPAN tag right before the switch.
 *   You likely want to include a final space character for proper display.
 *
 *   You can override it from the placeholder element using the `data-sentence` attribute.
 *
 * @property {string} [cssClass]
 *   CSS class to add to the switch element.
 *
 *   You can override it from the placeholder element using the `data-class` attribute.
 *
 * @property {string} [on="ON"]
 *   Label of the switch in the ON state.
 *
 *   You can override it from the placeholder element using the `data-on` attribute.
 *
 * @property {string} [off="OFF"]
 *   Label of the switch in the OFF state.
 *
 *   You can override it from the placeholder element using the `data-off` attribute.
 *
 * @property {string} [colorOn]
 *   Name of a predefined color to use for the ON state.
 *
 *   You can override it from the placeholder element using the `data-color-on` attribute.
 *
 *   Available colors:
 *
 *   * `blue` - the default.
 *   * `green`
 *
 * @property {string} [colorOff]
 *   Name of a predefined color to use for the OFF state.
 *
 *   You can override it from the placeholder element using the `data-color-off` attribute.
 *
 *   Available colors:
 *
 *   * `grey` or `gray` - the default.
 *   * `red`
 */
/**
 * The WonderPush JavaScript SDK instance.
 * @external WonderPushPluginSDK
 * @see {@link https://wonderpush.github.io/wonderpush-javascript-sdk/latest/WonderPushPluginSDK.html|WonderPush JavaScript Plugin SDK reference}
 */
/**
 * WonderPush SDK triggers configuration.
 * @typedef TriggersConfig
 * @memberof external:WonderPushPluginSDK
 * @see {@link https://wonderpush.github.io/wonderpush-javascript-sdk/latest/WonderPushPluginSDK.html#.TriggersConfig|WonderPush JavaScript Plugin SDK triggers configuration reference}
 */
WonderPush.registerPlugin('optin-switch', function(WonderPushSDK, options) {
    // Do not show anything on unsupported browsers.
    if (!WonderPushSDK.isNativePushNotificationSupported()) {
      return {
        setupSubscriptionSwitch: function () {},
      };
    }

    WonderPushSDK.loadStylesheet('style.css');

    var subscriptionSwitchElement = null;

    var init = function() {
      // Initialize switch
      if (document.readyState !== 'loading') {
        this.setupSubscriptionSwitch();
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          this.setupSubscriptionSwitch();
        }.bind(this));
      }
    }.bind(this);


    this.setupSubscriptionSwitch = function() {
      if (subscriptionSwitchElement) return;
      if (options.switchElementId === null) return;
      var switchElementId = options.switchElementId || 'wonderpush-subscription-switch';
      var switchesNodeList = document.querySelectorAll('#' + switchElementId);
      var unsupported = options.unsupported || ''; // this is not documented as the WonderPush SDK itself is not loaded if push notifications are not supported
      var classPrefix = options.classPrefix || 'wp-';
      var prepend = options.prepend || '';
      var append = options.append || '';
      var sentence = options.sentence || '';
      var cssClass = options.cssClass || '';
      var on = options.on || 'ON';
      var off = options.off || 'OFF';
      var colorOn = options.colorOn;
      var colorOff = options.colorOff;
      Array.prototype.slice.call(switchesNodeList).forEach(function(switchEl) {
        if (!switchEl || switchEl.dataset.wpInitialized === 'true') return;
        subscriptionSwitchElement = switchEl;
        switchEl.dataset.wpInitialized = 'true';
        if (!WonderPushSDK.isNativePushNotificationSupported()) {
          switchEl.innerHTML = (switchEl.dataset.unsupported || unsupported);
          return;
        }
        /*
          <div class="wp-switch-wrapper">
            Push notifications:
            <label class="wp-switch">
              <input id="wonderpush-subscription-switch-input" type="checkbox" class="wp-switch-input">
              <span class="wp-switch-label" data-on="ON" data-off="OFF"></span>
              <span class="wp-switch-handle"></span>
            </label>
          </div>
        */
        var switchClassPrefix = switchEl.dataset.classPrefix || classPrefix;
        switchEl.innerHTML = (switchEl.dataset.prepend || prepend) +
            '<div class="'+switchClassPrefix+'switch-wrapper"></div>' +
            (switchEl.dataset.append || append);
        var wrapper = switchEl.querySelector('.'+switchClassPrefix+'switch-wrapper');
        var sentenceSpan = document.createElement('SPAN');
        sentenceSpan.innerHTML = switchEl.dataset.sentence || sentence;
        var label = document.createElement('LABEL');
        label.classList.add(switchClassPrefix+'switch');
        label.className += ' ' + (switchEl.dataset.class || cssClass);
        label.style.position = 'relative';
        if (switchEl.dataset.colorOn  || colorOn ) label.classList.add(switchClassPrefix+'switch-on-'  + (switchEl.dataset.colorOn  || colorOn ));
        if (switchEl.dataset.colorOff || colorOff) label.classList.add(switchClassPrefix+'switch-off-' + (switchEl.dataset.colorOff || colorOff));
        var input = document.createElement('INPUT');
        input.id = switchEl.id + '-input';
        input.type = 'checkbox';
        input.classList.add(switchClassPrefix+'switch-input');
        label.appendChild(input);
        var switchLabels = document.createElement('SPAN');
        switchLabels.classList.add(switchClassPrefix+'switch-label');
        switchLabels.dataset.on  = switchEl.dataset.on  || on;
        switchLabels.dataset.off = switchEl.dataset.off || off;
        label.appendChild(switchLabels);
        var switchHandle= document.createElement('SPAN');
        switchHandle.classList.add(switchClassPrefix+'switch-handle');
        label.appendChild(switchHandle);
        wrapper.appendChild(sentenceSpan);
        wrapper.appendChild(label);

        // Create help
        var help = document.createElement('div');
        help.style.width = '280px';
        help.style.height = '200px';
        help.style.backgroundImage = 'url(https://cdn.by.wonderpush.com/plugins/optin-bell/1.0.0/allow-notifications.jpg)';
        help.style.backgroundSize = 'contain';
        help.style.backgroundRepeat = 'no-repeat';
        help.style.position = 'absolute';
        help.style.display = 'none';
        var altitude = label.getBoundingClientRect().top + window.scrollY;
        help.style.bottom = altitude > 200 ? '30px' : undefined;
        help.style.border = '1px solid #ccc';
        help.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        label.appendChild(help);

        // Bind listeners
        input.addEventListener('click', onSwitchClicked);
        window.addEventListener('WonderPushEvent', onSwitchSubscriptionChangedFactory(input));
        updateSwitchState(input, WonderPushSDK.Notification.getSubscriptionState());
        label.addEventListener('mouseover', function() {
          if (WonderPushSDK.Notification.getSubscriptionState() === WonderPushSDK.SubscriptionState.DENIED) {
            help.style.display = '';
          }
        });
        label.addEventListener('mouseout', function() {
          help.style.display = 'none';
        });
      });
    };

    // Respond to switch clicks by the user
    var onSwitchClicked = function(event) {
      var notifSwitch = event.target;
      var newChecked = notifSwitch.checked;
      event.stopPropagation();
      event.preventDefault();
      WonderPushSDK.setNotificationEnabled(newChecked, event).catch(function(error) {
        if (error instanceof WonderPush.Errors.UserCancellationError || error instanceof WonderPush.Errors.PermissionError) {
          console.warn(error);
          return;
        }
        console.error(error);
      });
      return false;
    };

    // Update the state of the switch according to a subscription state
    var updateSwitchState = function(notifSwitch, subscriptionState) {
        switch (subscriptionState) {
          case WonderPushSDK.SubscriptionState.UNSUPPORTED:
            notifSwitch.disabled = true;
            notifSwitch.checked = false;
            break;
          case WonderPushSDK.SubscriptionState.UNDETERMINED:
          case WonderPushSDK.SubscriptionState.NOT_SUBSCRIBED:
          case WonderPushSDK.SubscriptionState.UNSUBSCRIBED:
            notifSwitch.disabled = false;
            notifSwitch.checked = false;
            break;
          case WonderPushSDK.SubscriptionState.SUBSCRIBED:
            notifSwitch.disabled = false;
            notifSwitch.checked = true;
            break;
        }
    };

    // Respond to subscription state changes
    var onSwitchSubscriptionChangedFactory = function(notifSwitch) {
      return function(evt) {
        var event = evt.originalEvent || evt;
        var detail = event.detail || {};
        // Handle subscription changes
        // Note: This event is fired on each page and usually starts with the UNDETERMINED state.
        if (detail.name === 'subscription') {
          // Update the switch state in to reflect the actual subscription state
          updateSwitchState(notifSwitch, detail.state);
        }
      };
    };

    init();
});
