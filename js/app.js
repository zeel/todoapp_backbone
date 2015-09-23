$(function() {
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
		}
	});
	var TodoItemView = Backbone.View.extend({
		tagName : 'div',
		template : _.template($("#todo-item-template").html()),
		initialize : function() {
			// _.bindAll(this, 'render', 'removeTodo', 'unrender'); // every function that uses 'this' as the current object should be in here
			this.model.on('destroy', this.unrender.bind(this));
			this.render();
		},
		render : function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},
		events :{
			"click a.remove_todo_close" : "removeTodo"
		},
		removeTodo : function() {
			this.model.destroy();
		},
		unrender : function(){
			this.remove();
		}
	});
	var ToDoList = Backbone.Collection.extend({
		model : ToDoItem
	});
	var ToDoListView = Backbone.View.extend({
		el : "body",
		events : {
			"click #add-todo" : "createToDoOnEnter"
		},
		initialize : function() {
			this.todos = new ToDoList();
			this.input = this.$("#new-todo");
			this.todos.bind("add", this.renderToDo);
			// this.addToDo("task 1");
			// this.addToDo("task 2");
		},
		render : function() {
			_(this.todos.models).each(function(item){
				this.renderToDo(item);
			})
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
		renderToDo : function (toDoItem) {
			var todoItemView = new TodoItemView({model : toDoItem});
			$(".todo_box", this.el).append(todoItemView.render().el);
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
