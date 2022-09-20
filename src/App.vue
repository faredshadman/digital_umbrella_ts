<template>
  <div
    class="w-full min-h-screen"
    style="
      background: #1a89be;
      background: linear-gradient(90deg, #1a89be 0, #156185 50%, #0c3143 100%);
    "
  >
    <NavBar />
    <!-- Todo List start -->
    <div class="w-1/2 md:w-1/3 mx-auto mb-5">
      <Multiselect
        placeholder="Enter tag"
        v-model="filter"
        :options="options"
        :searchable="true"
        mode="tags"
        :taggable="true"
        :close-on-select="false"
      />
    </div>

    <h1 class="text-center text-4xl text-white cursor-pointer">Todo List</h1>

    <ul class="bg-white w-5/6 md:w-1/2 mx-auto my-5">
      <li
        class="p-2 flex bg-white items-center justify-between"
        v-for="item in filteredTodos"
        :key="item.id"
        :class="{
          'bg-slate-300': item.isDone,
        }"
      >
        <div class="flex flex-col">
          <div>
            <input
              v-model="item.title"
              readonly
              class="outline-none"
              :class="{
                'line-through bg-slate-300': item.isDone,
              }"
            />
          </div>
          <div class="bg-white w-3/4 flex-wrap flex items-center gap-1 p-1">
            <span
              class="bg-green-400 px-1 text-white"
              v-for="(tag, index) in item.tags"
              :key="index"
              >{{ tag }}</span
            >
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="handleModal(item)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </button>
          <!-- edit modal start -->
          <section
            v-if="edited"
            class="fixed z-50 inset-0 bg-blur w-screen flex items-center justify-center"
          >
            <div class="w-3/4 md:w-1/2 min-h-fit p-5 bg-white relative">
              <button class="absolute top-2 right-2" @click="handleModal(item)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div class="flex flex-col gap-4">
                <div class="w-full">
                  <label class="block" for="title">Title</label>
                  <input
                    placeholder="Title"
                    class="border rounded w-full"
                    v-model="editedTodo.title"
                  />
                </div>
                <div class="w-full">
                  <label for="editedTags">Tags</label>
                  <Multiselect
                    id="editedTags"
                    placeholder="Enter tag"
                    v-model="editedTodo.tags"
                    :options="options"
                    :searchable="true"
                    mode="tags"
                    required
                    :taggable="true"
                    :close-on-select="false"
                    :create-option="true"
                  />
                </div>
                <div class="flex gap-2 items-center ml-auto">
                  <button
                    class="bg-green-400 p-2 text-white rounded"
                    @click="handleModalChanges"
                  >
                    Save Changes
                  </button>
                  <button
                    @click="edited = false"
                    class="bg-red-500 p-2 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </section>
          <!-- edit modal end -->

          <!-- todo list edit checkbox delete buttons -->
          <button @click="handleDelete(item.id)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
          <input
            type="checkbox"
            class="w-8 h-6 accent-green-600"
            v-model="item.isDone"
            @change="handleChange"
          />
        </div>
      </li>
    </ul>
    <!-- Todo List end -->
    <!-- Add ToDo form start -->
    <div class="w-5/6 md:w-1/2 mx-auto">
      <h1 class="text-center text-3xl text-white">Add Todo</h1>
      <div class="flex flex-col gap-3">
        <div class="w-full">
          <label for="title" class="block text-xl text-white">Title</label>
          <input
            id="title"
            type="text"
            v-model="todo.title"
            class="w-full p-1"
          />
        </div>
        <div class="w-full">
          <label for="tags" class="block text-xl text-white">Tags</label>
          <Multiselect
            id="tags"
            placeholder="Enter tag"
            v-model="todo.tags"
            :options="options"
            :searchable="true"
            mode="tags"
            :taggable="true"
            :close-on-select="false"
            :create-option="true"
          />
        </div>
        <button
          class="bg-blue-400 px-5 py-1 text-white rounded self-end"
          @click="addTodo"
        >
          Add
        </button>
      </div>
    </div>
    <!-- Add todoForm end -->
  </div>
</template>
<!-- vue multiselect css -->
<style src="@vueform/multiselect/themes/default.css"></style>

<style>
.bg-blur {
  background: rgba(0, 0, 0, 0.437);
}
</style>

<script lang="ts">
interface Todo {
  id: string | number;
  title: string;
  tags: string[];
  isDone: boolean;
}
type Id = number | string;
import { defineComponent } from "vue";
import NavBar from "./components/NavBar.vue";
import Multiselect from "@vueform/multiselect";
import { uid } from "uid";
export default defineComponent({
  name: "App",
  mounted() {
    // update UI
    this.getTodos();
  },
  data() {
    return {
      filter: [] as string[],
      edited: false,
      todos: [] as Todo[],
      filteredTodos: [] as Todo[],
      editedTodo: {} as Todo,
      todo: {
        id: 0,
        title: "",
        tags: [],
        isDone: false,
      },
      options: [] as string[],
    };
  },
  methods: {
    handleDelete(id: Id): void {
      // confirm value is boolean
      let isDeleted: boolean = confirm("Are you sure to delete this todo");
      // if true delete todo
      if (isDeleted) {
        let todos: Todo[] = this.todos.filter((item: Todo) => item.id !== id);
        localStorage.setItem("todos", JSON.stringify(todos));
        this.getTodos();
      } else {
        // else return
        return;
      }
    },
    handleModalChanges(): void {
      // id is each todo unique id
      let id: Id = this.editedTodo.id;
      // index is index of edited Todo in localStorages array or in this.todos
      let index: number = this.todos.findIndex((item) => item.id === id);

      //
      let todo: Todo = this.editedTodo;
      // change old array[index] element to changed one
      if (index !== -1) {
        this.todos[index] = todo;
      }

      // update local
      this.handleChange();
      // update UI
      this.getTodos();
      // close modal
      this.edited = false as boolean;
    },
    handleModal(todo: Todo): void {
      // this.edited is Boolean value. I use it to toggle Edit Modal
      this.edited = !this.edited as boolean;
      // if i use let editedOne = todo ,then editedOne take reference of todo and if editedOne values change then todo change before submit changes

      let editedOne: Todo = { ...todo };
      //
      this.editedTodo = editedOne as Todo;
    },
    handleChange(): void {
      // set local storage with changes
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },
    handleAll(todos: Todo[]): void {
      this.todos = [...todos] as Todo[];
      this.handleChange();
    },
    addTodo(): void {
      // we can add todo without tags, but not without title
      if (this.todo.title !== "") {
        // uid create unique id for each todo
        let id: string = uid();
        // I use Array.from because of proxy type. this.todo.tags is proxy and I changed it to array
        let tags: string[] = Array.from(this.todo.tags);
        // we only change id and tags in this function , isDone is default false, and title is connected to this.todo with v-model
        let todo: Todo = {
          ...this.todo,
          id,
          tags,
        };
        // add to UI
        this.setTodos(todo);
        // clear inputs
        this.todo = {
          id: 0,
          title: "",
          tags: [],
          isDone: false,
        };
      }
    },
    setTodos(todo: Todo): void {
      let todos: Todo[] = [...this.todos, todo];
      localStorage.setItem("todos", JSON.stringify(todos));
      // this.getTodos renew our todoList in ui
      this.getTodos();
    },
    filterTodos(tags: string[]): void {
      this.filteredTodos = this.todos;
      let filtered: Todo[] = [];
      if (tags.length > 0) {
        tags.map((tag) => {
          filtered = this.filteredTodos.filter((item) =>
            item.tags.includes(tag)
          );
        });
        this.filteredTodos = filtered;
      } else {
        this.filteredTodos = this.todos;
      }
    },
    // get todos from localstorage
    getTodos(): Todo[] {
      let todos: Todo[];
      let item = localStorage.getItem("todos");
      // if there is 'todos' key in localstorage, we assign our todos variable value of 'todos' key
      if (item) {
        todos = JSON.parse(item);
        let options: string[] = [];
        // map thoough todos and then map through item to add tags to options array. Using existed tags in edit or add
        todos.map((item: Todo) => {
          item.tags.length > 0 &&
            item.tags.map((tag: string) => {
              options = [...options, tag];
            });
          // unique tag array , it is useless having the same tags
          options = [...new Set(options)];
          this.options = options as any;
        });
      } else {
        // if if there is not 'todos' key in localstorage we assign empty array to  todos variable
        todos = [];
      }
      // why I use spread operator, I thought writing this.todos = todos is a bad way to use.
      this.todos = [...todos] as Todo[];
      this.filteredTodos = [...todos] as Todo[];
      return this.todos as Todo[];
    },
  },
  watch: {
    filter(value: string[]): void {
      this.filterTodos(value);
    },
  },

  components: {
    NavBar,
    Multiselect,
  },
});
</script>
