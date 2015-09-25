define(['jquery', 'underscore', 'backbone', 'backboneLocalStorage','models/todos', 'collections/todos', 'views/todos'], function($,_,Backbone, backboneLocalStorage, ToDoItem, ToDoList, TodoItemView) {
	'use strict';
	var ToDoListView = Backbone.View.extend({
		el : "body",
		mode : "show",
		statusBarTemplate : _.template($("#todo-statusbar-template").html()),
		events : {
			"submit #todo-form" : "createToDoOnEnter",
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
			var that = this;
			that.$(".todo_box").html("");
			that.showType = $(ev.currentTarget).data("target");
			var visible_todos;
			if(that.showType == "all") {
				visible_todos = that.todos.models;
			}
			else if(that.showType == "active"){
				visible_todos = that.todos.remaining();
			}
			else if(that.showType == "completed"){
				visible_todos = that.todos.done();
			}
			visible_todos.forEach(function(todo){
				that.addOne(todo);
			});
			that.render();
		},
		initialize : function() {
			var that = this,todos;
			that.todos = new ToDoList();
			todos = that.todos;
			that.showType = 'all';
			//fetch from localstorage and add into the view
			todos.fetch();
			_(todos.models).each(function(item){
				that.addOne(item);
			})
			that.input = that.$("#new-todo");
			todos.bind("add", that.addOne, that);
			todos.bind("all", that.render, that);
			that.allCheckedBox = that.$("#check-all")[0];
			that.render();
		},
		createToDoOnEnter : function () {
			var that = this;
			if(!that.input.val()) return;
			that.addToDo(that.input.val());
			that.input.val("");
		},
		addToDo : function(toDoTitle) {
			var todo = new ToDoItem({title : toDoTitle});
			this.todos.create(todo);
		},
		addOne : function (toDoItem) {
			var todoItemView = new TodoItemView({model : toDoItem});
			this.$(".todo_box").append(todoItemView.render().el);
		},
		render : function() {
			var that = this, remaining_length = that.todos.remaining().length;
			// update the active todo count
			that.$("#status_bar").html(that.statusBarTemplate({'remaining' : remaining_length, showType : that.showType}));
			that.allCheckedBox.checked = !remaining_length;
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