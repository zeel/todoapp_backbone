define(['jquery', 'underscore', 'backbone', 'backboneLocalStorage'], function($, _, Backbone, Store) {
	var TodoItemView = Backbone.View.extend({
		tagName : 'li',
		template : _.template($("#todo-item-template").html()),
		initialize : function() {
			// _.bindAll(this, 'render', 'removeTodo', 'unrender'); // every function that uses 'this' as the current object should be in here
			this.model.on('change', this.render.bind(this));
			this.model.on('destroy', this.unrender.bind(this));
			this.render();
		},
		render : function() {
			$(this.el).html(this.template(this.model.toJSON()));
			this.input = this.$(".edit");
			return this;
		},
		events :{
			"click a.remove-todo-close" : "removeTodo",
			"click #check-hasCompleted" : "todoCompleted",
			"dblclick #todo-title" : "editToDo",
			"blur .edit" : "closeEditMode",
			"keypress .edit" : "saveEditedToDo"
		},
		editToDo : function() {
			this.$el.addClass("editing");
			this.input.focus();
		},
		todoCompleted : function() {
			this.model.toggle();
		},
		removeTodo : function() {
			this.model.destroy();
		},
		unrender : function(){
			this.remove();
		},
		//feature to remove the todo if the text is empty then remove the todo and update the todo based on new textvalue
		closeEditMode : function() {
			var todoval = this.input.val();
			if(todoval) {
				this.model.save({title : todoval})
			}
			else {
				this.removeTodo();
			}
			this.$el.removeClass("editing");
		},
		//if pressed enter save the todo
		saveEditedToDo : function(ev) {
			if(ev.keyCode == 13) this.closeEditMode();
		}
	});
	return TodoItemView;
});