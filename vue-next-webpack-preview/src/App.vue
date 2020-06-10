<template>
  <div id="app">
    <h1>开课吧 {{top}}</h1>
    <div>
      <input :class="{fixed:top>200}" type="text" v-model="state.newTodo" @keyup.enter="addTodo" />
      <button @click="addTodo">add</button>
    </div>
    <ul>
      <li v-for="todo in state.todos" :key="todo.id">{{todo.title}}</li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive, toRefs, computed } from "vue";
import useScroll from "./useScroll.js";

export default {
  setup() {
    const state = reactive({
      newTodo: "",
      todos: [
        { id: "1", title: "eat", completed: false },
        { id: "2", title: "work out", completed: false },
        { id: "3", title: "sleep", completed: false }
      ]
    });

    function addTodo() {
      state.todos.push({ id: "4", title: state.newTodo, completed: false });
    }

    const remaining = computed(
      () => state.todos.filter(t => !t.completed).length
    );

    const { top } = useScroll();

    return { state, addTodo, top };
  }
};
</script>

<style scoped>
#app {
  height: 200vh;
  overflow: auto;
  background-color: pink;
}

.fixed{
  position: fixed;
  top: 0;
}
</style>
