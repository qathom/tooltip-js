# Tooltip

Create simple or advanced, high performant Tooltips with minimal javascript and markup.
This library is built using native vanilla javascript which means super fast performance. 
Supports IE10+, all major browsers and even mobile.

## Usage

Create your Tooltip html:

```html
<div class="my-tooltip">My Tooltip Content</div>
<button class="my-tooltip-toggle-btn">Toggle</button>
```

Then activate your tooltip with the following: 

```javascript
var tooltip = new Tooltip({
    el: document.body.getElementsByClassName('my-modal'),
    activeClass: 'my-tooltip-active',
    triggerClass: 'my-tooltip-toggle-btn'
});

tooltip.show(); // show the tooltip
tooltip.hide(); // hide the tooltip
```