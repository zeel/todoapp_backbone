define(['jquery', 'underscore', 'backbone', 'backboneLocalStorage','common'], function($, _, Backbone, Store, Common) {
	var TodoItemView = Backbone.View.extend({
		tagName : 'li',
		template : _.template($("#todo-item-template").html()),
		initialize : function() {
			var that = this;
			// _.bindAll(this, 'render', 'removeTodo', 'unrender'); // every function that uses 'this' as the current object should be in here
			that.model.on('change', that.render.bind(that));
			that.model.on('destroy', that.unrender.bind(that));
			that.render();
		},
		render : function() {
			var that = this;
			$(that.el).html(that.template(that.model.toJSON()));
			that.input = that.$(".edit");
			return that;
		},
		events :{
			"click a.remove-todo-close" : "removeTodo",
			"click .check-hasCompleted" : "todoCompleted",
			"dblclick #todo-title" : "editToDo",
			"keypress .edit" : "saveEditedToDo",
			"keydown .edit" : "cancelEditMode",
			"blur .edit" : "closeEditMode",
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
			var that = this, todoval = that.input.val();
			if(todoval) {
				that.model.save({title : todoval})
			}
			else {
				that.removeTodo();
			}
			that.$el.removeClass("editing");
		},
		//if pressed enter save the todo
		cancelEditMode : function(ev) {
			if(ev.keyCode == Common.ESCAPE_KEY) {
				this.$el.removeClass("editing");
			}
		},
		//if pressed enter save the todo
		saveEditedToDo : function(ev) {
			if(ev.keyCode == Common.ENTER_KEY) this.closeEditMode();
		}
	});
	return TodoItemView;
});