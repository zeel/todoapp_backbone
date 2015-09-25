define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var ToDoItem = Backbone.Model.extend({
		defaults: {
			hasCompleted : false,
			title : ""
		},
		toggle : function() {
			this.save({hasCompleted : !this.get("hasCompleted")});
		}
	});
	return ToDoItem;
});