define(['jquery', 'underscore', 'backbone','models/todos', 'backboneLocalStorage'], function($, _, Backbone, TodoModel, Store) {
	var ToDoList = Backbone.Collection.extend({
		model : TodoModel,
		localStorage: new Backbone.LocalStorage("todolist"),
		//returns counts of todos that are active
		remaining : function() {
			return this.where({hasCompleted : false});
		},
		done : function() {
			return this.where({hasCompleted : true});
		}
	});
	return ToDoList;
});