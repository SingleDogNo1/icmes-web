<template>
  <Row :gutter="20">
    <Col :flex="1">
      <Image
        :width="200"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    /></Col>
    <Col :flex="1">
      <ImagePreviewGroup :images="images" :image-width="200" />
    </Col>
  </Row>
</template>

<script lang="ts" setup name="ImageDemo">
  import { Row, Col } from 'ant-design-vue';
  import { Image, ImagePreviewGroup } from '/@/components/Image';

  const images = [
    'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
    'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
  ];
</script>
