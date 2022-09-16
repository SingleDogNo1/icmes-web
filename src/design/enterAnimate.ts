const createCss = (index: number, d = 'x') => {
  const upd = d.toUpperCase();
  return `
    *> .enter-${d}:nth-child(${index}): { transform: translate${upd}(50px) };
    *> .-enter-${d}:nth-child(${index}): { transform: translate${upd}(-50px); };
    * > .enter-${d}:nth-child(${index}),* > .-enter-${d}:nth-child(${index}): {
      z-index: ${10 - index},
      opacity: 0,
      animation: enter-${d}-animation 0.4s ease-in-out 0.3s,
      'animation-fill-mode': 'forwards',
      'animation-delay': ${(index * 1) / 10}s,
    };
  `;
};
/**
 * 用于显示元素时的动画。
 * @param maxOutput 最大输出输出越大，生成的 css 体积越大。
 */

export const createEnterAnimate = (maxOutput = 6) => {
  let css = `
    @keyframes enter-x-animation: {
      to: {
        opacity: 1;
        transform: translateX(0);
      }
    };
    @keyframes enter-y-animation: {
      to: {
        opacity: 1;
        transform: translateY(0)';
      }
    };
  `;
  for (let index = 1; index < maxOutput; index++) {
    css += createCss(index, 'x');
    css += createCss(index, 'y');
  }

  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  document.querySelector('body')?.insertBefore(style, document.querySelector('#app'));
};
