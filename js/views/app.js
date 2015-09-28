define(['jquery', 'underscore', 'backbone', 'backboneLocalStorage','models/todos', 'collections/todos', 'views/todos', 'common'], function($,_,Backbone, backboneLocalStorage, ToDoItem, ToDoList, TodoItemView, Common) {
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
		//remove the completed todos from the collection
		clearCompletedToDo : function() {
			var completedToDo = this.todos.done();
			_.invoke(completedToDo, 'destroy');
		},
		// display todos based upon filter like all/active/completed
		changeToDoShowType : function(ev) {
			var that = this;
			that.showType = $(ev.currentTarget).data("target");
			Common.TODO_FILTER = that.showType;
			//trigger filter event to notify todos collection
			that.todos.trigger("filter");
			that.render();
		},
		//fucntion which will show/hide the todo based upon the current filter
		filterOne : function(todo) {
			todo.trigger('visible');
		},
		//function which will trigger filter all the
		filterAll : function(){
			this.todos.each(this.filterOne, this);
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
			//bind with the events
			todos.bind("add", that.addOne, that);
			todos.bind("all", that.render, that);
			todos.bind("filter", that.filterAll, that);
			that.allCheckedBox = that.$("#check-all")[0];
			that.render();
		},
		createToDoOnEnter : function () {
			var that = this;
			if(!that.input.val()) return;
			that.addToDo(that.input.val());
			that.input.val("");
		},
		//add the model into collection with given title
		addToDo : function(toDoTitle) {
			var todo = new ToDoItem({title : toDoTitle});
			this.todos.create(todo);
		},
		//add todo model view into collection view
		addOne : function (toDoItem) {
			var todoItemView = new TodoItemView({model : toDoItem});
			this.$("#todo-box").append(todoItemView.render().el);
		},
		//render the status bar and allcheckbox again everytime anything changes to update details
		render : function() {
			var that = this, remaining_length = that.todos.remaining().length;
			// update the active todo count
			that.$("#status-bar").html(that.statusBarTemplate({'remaining' : remaining_length, showType : that.showType}));
			that.allCheckedBox.checked = !remaining_length;
		},
		//mark all the todos completed
		completeAll : function() {
			var done = this.allCheckedBox.checked;
			this.todos.each(function(todo){
				todo.save({hasCompleted : done})
			})
		}
	});
	return ToDoListView;
});