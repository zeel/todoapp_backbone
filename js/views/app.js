define(['jquery', 'underscore', 'backbone', 'backboneLocalStorage','models/todos', 'collections/todos', 'views/todos'], function($,_,Backbone, backboneLocalStorage, ToDoItem, ToDoList, TodoItemView) {
	'use strict';
	var ToDoListView = Backbone.View.extend({
		el : "body",
		mode : "show",
		statusBarTemplate : _.template($("#todo-statusbar-template").html()),
		events : {
			"click #add-todo" : "createToDoOnEnter",
			"click #check-all" : "completeAll",
			"click .show-type-link" : "changeToDoShowType",
			"click #clear-completed": "clearCompletedToDo"
		},
		clearCompletedToDo : function() {
			var completedToDo = this.todos.done();
			completedToDo.forEach(function(todo) {
				todo.destroy();
			})
		},
		/*
		 * display todos based upon filter like all/active/complete
		 */
		changeToDoShowType : function(ev) {
			$(".todo_box", this.el).html("");
			this.showType = $(ev.currentTarget).data("target");
			var visible_todos;
			if(this.showType == "all") {
				visible_todos = this.todos.models;
			}
			else if(this.showType == "active"){
				visible_todos = this.todos.remaining();
			}
			else if(this.showType == "completed"){
				visible_todos = this.todos.done();
			}
			var self = this;
			visible_todos.forEach(function(todo){
				self.addOne(todo);
			});
			this.render();
		},
		initialize : function() {
			var that = this;
			this.todos = new ToDoList();
			this.showType = 'all';
			//fetch from localstorage and add into the view
			this.todos.fetch();
			var that = this;
			_(this.todos.models).each(function(item){
				that.addOne(item);
			})
			this.input = this.$("#new-todo");
			this.todos.bind("add", this.addOne, this);
			this.todos.bind("all", this.render, this);
			this.allCheckedBox = this.$("#check-all")[0];
			this.render();
		},
		createToDoOnEnter : function () {
			if(!this.input.val()) return;
			this.addToDo(this.input.val());
			this.input.val("");
		},
		addToDo : function(toDoTitle) {
			var todo = new ToDoItem({title : toDoTitle});
			this.todos.create(todo);
		},
		addOne : function (toDoItem) {
			var todoItemView = new TodoItemView({model : toDoItem});
			$(".todo_box", this.el).append(todoItemView.render().el);
		},
		render : function() {
			var remaining_length = this.todos.remaining().length;
			// update the active todo count
			$("#status_bar", this.el).html(this.statusBarTemplate({'remaining' : remaining_length, showType : this.showType}));
			this.allCheckedBox.checked = !remaining_length;
		},
		completeAll : function() {
			var done = this.allCheckedBox.checked;
			this.todos.each(function(todo){
				todo.save({hasCompleted : done})
			})
		}
	});
	return ToDoListView;
});