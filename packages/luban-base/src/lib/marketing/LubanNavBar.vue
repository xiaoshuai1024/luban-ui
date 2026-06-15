<script setup lang="ts">
interface NavLink { text: string; href: string }
defineProps<{ brand?: string; links: NavLink[] }>();
</script>

<template>
  <nav class="lb-navbar">
    <div class="lb-navbar__inner">
      <span v-if="brand" class="lb-navbar__brand">{{ brand }}</span>
      <ul class="lb-navbar__links">
        <li v-for="(link, i) in links" :key="i">
          <a :href="link.href">{{ link.text }}</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.lb-navbar {
  background: #304156;
  color: #fff;
}
.lb-navbar__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  height: 56px;
}
.lb-navbar__brand {
  font-weight: 700;
  font-size: 18px;
}
.lb-navbar__links {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  a {
    color: #bfcbd8;
    text-decoration: none;
    font-size: 14px;
    &:hover {
      color: #fff;
    }
  }
}
</style>
