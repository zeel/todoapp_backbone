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
		tagName : 'div',
		template : _.template($("#todo-item-template").html()),
		initialize : function() {
			// _.bindAll(this, 'render', 'removeTodo', 'unrender'); // every function that uses 'this' as the current object should be in here
			this.model.on('change', this.render.bind(this));
			this.model.on('destroy', this.unrender.bind(this));
			this.render();
		},
		render : function() {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},
		events :{
			"click a.remove_todo_close" : "removeTodo",
			"click #check-hasCompleted" : "todoCompleted"
		},
		todoCompleted : function() {
			this.model.toggle();
		},
		removeTodo : function() {
			this.model.destroy();
		},
		unrender : function(){
			this.remove();
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
		statusBarTemplate : _.template($("#todo-statusbar-template").html()),
		events : {
			"click #add-todo" : "createToDoOnEnter",
		},
		initialize : function() {
			this.todos = new ToDoList();
			this.input = this.$("#new-todo");
			this.todos.bind("add", this.addOne, this);
			this.todos.bind("all", this.render, this);
			this.render();
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
		addOne : function (toDoItem) {
			var todoItemView = new TodoItemView({model : toDoItem});
			$(".todo_box", this.el).append(todoItemView.render().el);
		},
		render : function() {
			//update the active todo count
			$("#status_bar", this.el).html(this.statusBarTemplate({'remaining' : this.todos.remaining().length, showType : 'all'}));
			// $("#active-todo-count", this.el).html();
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
