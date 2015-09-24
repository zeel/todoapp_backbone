$(function() {
	//dummy function to not to report error when saved/deleted
	Backbone.sync = function(method, model, success, error){
  }
	var ToDoItem = Backbone.Model.extend({
		// validate : function(attrs, options){
		// 	//title should not be empty
		// 	console.log(attrs);
		// 	if(!attrs.title)
		// 	{
		// 		return "title can not be empty";
		// 	}
		// },
		defaults: {
			hasCompleted : false,
			title : ""
		},
		toggle : function() {
			this.save({hasCompleted : !this.get("hasCompleted")});
		}
	});
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
			"blur .edit" : "closeEditMode"
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
		}
	});
	var ToDoList = Backbone.Collection.extend({
		model : ToDoItem,
		//returns counts of todos that are active
		remaining : function() {
			return this.where({hasCompleted : false});
		},
		done : function() {
			return this.where({hasCompleted : true});
		}
	});
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
			var completedToDO = this.todos.done();
			completedToDO.forEach(function(todo) {
				todo.destroy();
			})
		},
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
			this.todos = new ToDoList();
			this.showType = 'all';
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
			this.todos.add(todo);
		},
		addOne : function (toDoItem) {
			var todoItemView = new TodoItemView({model : toDoItem});
			$(".todo_box", this.el).append(todoItemView.render().el);
		},
		render : function() {
			// _(this.todos.models).each(function(item){
			// 	this.renderToDo(item);
			// })
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
	var todolistview = new ToDoListView();



	// var todo = new Todo({
	// 	title : "completing todo app"
	// });
	// var todo1 = new Todo({});
	// todo1.on("invalid", function(model, error) {
	// 	console.log("entered invalid function handler");
	//   alert(model.get("title") + " " + error);
	// });

});
