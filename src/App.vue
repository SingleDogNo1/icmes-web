<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground';
  import { updateDarkTheme } from '/@/logics/theme/dark';
  import { ThemeEnum } from '/@/enums/appEnum';
  import 'dayjs/locale/zh-cn';

  const { getAntdLocale } = useLocale();
  const { setDarkMode } = useRootSetting();

  // 切换页面时更改标题
  useTitle();

  // 根据系统主题自动切换亮色 / 暗色主题
  const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
  let handleChangeColorScheme = ({ matches: isDarkMode }: MediaQueryListEvent) => {
    setDarkMode(isDarkMode ? ThemeEnum.DARK : ThemeEnum.LIGHT);
    updateDarkTheme(isDarkMode ? ThemeEnum.DARK : ThemeEnum.LIGHT);
    updateHeaderBgColor();
    updateSidebarBgColor();
  };

  if (typeof darkMedia.addEventListener === 'function') {
    darkMedia.addEventListener('change', handleChangeColorScheme);
  } else if (typeof darkMedia.addListener === 'function') {
    darkMedia.addListener(handleChangeColorScheme);
  }
</script>
