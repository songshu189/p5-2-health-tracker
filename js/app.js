// site/js/app.js

var app = app || {};

var appViews = null;

$(function() {
    appViews = new app.TrackedFoodsView();
});

function trunc (str)  {
	if(str.length > 26) {
		return str.substr(0,22) + ' ...';
	}
	return str;
}