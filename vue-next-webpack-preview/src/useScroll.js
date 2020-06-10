import { ref, onMounted, onUnmounted } from "vue";

// 独立功能，返回滚动高度
export default function useScroll() {
  const top = ref(0);
  function update(e) {
    top.value = window.scrollY;
  }

  onMounted(() => {
    window.addEventListener("scroll", update);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", update);
  });

  return { top };
}
