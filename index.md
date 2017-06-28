WonderPush Web SDK plugin to present the user with a switch she can use to opt-in or opt-out to push notifications.

Here is a screenshot of the default switch shown to the user with the wording proposed in the doc:

<center>
![Screenshot of the plugin switch](screenshot.png)
</center>

You can place it anywhere you see fit in your page.

# How to use this plugin

## From the WonderPush dashboard

Log in to your [WonderPush dashboard](https://dashboard.wonderpush.com/) and head over to the _Settings / Configuration_ page in the left menu.
Select the _Website_ tab and use this plugin.

## From the initialization options of the SDK

Change your call to `WonderPush.init()` to include the following, merging existing keys as necessary:

```javascript
WonderPush.init({
  plugins: {
    "optin-switch": {
      // Add any option to customize the plugin as desired
    },
  },
});
```

You can find the reference of the options in the {@link OptinSwitch.Options} section of the reference.

# Reference

The available options are described in the {@link OptinSwitch.Options} section of the reference.

The available API is described on the {@link OptinSwitch} class.
