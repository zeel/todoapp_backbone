define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var ToDoItem = Backbone.Model.extend({
		defaults: {
			hasCompleted : false,
			title : ""
		},
		//toggel todo hasCompletedß
		toggle : function() {
			this.save({hasCompleted : !this.get("hasCompleted")});
		}
	});
	return ToDoItem;
});