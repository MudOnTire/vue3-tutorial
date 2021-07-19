const app = Vue.createApp({
  // data, functions
  data() {
    return {
      title: 'The final empire',
      author: 'Brandon Sanderson',
      age: 45
    }
  },
  methods: {
    changeTitle(title) {
      this.title = title;
    }
  }
});

app.mount('#app');