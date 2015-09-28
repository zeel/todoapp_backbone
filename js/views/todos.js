define(['jquery', 'underscore', 'backbone', 'backboneLocalStorage','common'], function($, _, Backbone, Store, Common) {
	var TodoItemView = Backbone.View.extend({
		tagName : 'li',
		template : _.template($("#todo-item-template").html()),
		initialize : function() {
			var that = this;
			that.model.on('change', that.render.bind(that));
			that.model.on('destroy', that.unrender.bind(that));
			that.model.on('visible', that.toggleHidden.bind(that));
			that.render();
		},
		render : function() {
			var that = this;
			$(that.el).html(that.template(that.model.toJSON()));
			that.input = that.$(".edit");
			//check everytime that should todo be seen based upon current selected filter
			that.toggleHidden();
			return that;
		},
		events :{
			"click a.remove-todo-close" : "removeTodo",
			"click .check-hasCompleted" : "todoCompleted",
			"dblclick .view" : "editToDo",
			"keypress .edit" : "saveEditedToDo",
			"keydown .edit" : "cancelEditMode",
			"blur .edit" : "closeEditMode",
		},
		//display editing mode
		editToDo : function() {
			this.$el.addClass("editing");
			this.input.focus();
		},
		//mark todo completed
		todoCompleted : function() {
			this.model.toggle();
		},
		//remove todo model
		removeTodo : function() {
			this.model.destroy();
		},
		//remove todo view
		unrender : function(){
			this.remove();
		},
		//check if todo should be displayed or hidden based on selected filter
		toggleHidden: function() {
			this.$el.toggleClass("isHidden", this.checkHidden());
		},
		//returns true if todo should be hidden
		checkHidden : function() {
			var completed = this.model.get("hasCompleted"), todoFilter = Common.TODO_FILTER;
			return (todoFilter == 'completed' && !completed) || (todoFilter == 'active' && completed);
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
		//if pressed escape reset the input value as well as exit edit mode
		cancelEditMode : function(ev) {
			if(ev.keyCode == Common.ESCAPE_KEY) {
				this.$el.removeClass("editing");
				this.input.val(this.model.get("title"));
			}
		},
		//if pressed enter save the todo
		saveEditedToDo : function(ev) {
			if(ev.keyCode == Common.ENTER_KEY) this.closeEditMode();
		}
	});
	return TodoItemView;
});