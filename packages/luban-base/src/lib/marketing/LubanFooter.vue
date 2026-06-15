<script setup lang="ts">
interface FooterLink { text: string; href: string }
defineProps<{ copyright?: string; links?: FooterLink[] }>();
</script>

<template>
  <footer class="lb-footer">
    <div class="lb-footer__inner">
      <ul v-if="links?.length" class="lb-footer__links">
        <li v-for="(link, i) in links" :key="i">
          <a :href="link.href">{{ link.text }}</a>
        </li>
      </ul>
      <span v-if="copyright" class="lb-footer__copyright">{{ copyright }}</span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.lb-footer {
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  color: #999;
  font-size: 12px;
}
.lb-footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}
.lb-footer__links {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0;
  padding: 0;
  a {
    color: #666;
    text-decoration: none;
    &:hover {
      color: #1976d2;
    }
  }
}
</style>
