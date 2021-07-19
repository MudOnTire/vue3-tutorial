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
    changeTitle() {
      this.title = 'Something else';
    }
  }
});

app.mount('#app');