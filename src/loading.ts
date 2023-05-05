// @ts-nocheck
// @ts-ignore
const defineCustomElm = (F, n) =>
  customElements && (customElements.get(n) ? false : customElements.define(n, F));

const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

class F extends HTMLElement {
  has(k) {
    return this.hasAttribute(k);
  }
  attr(k, v) {
    return v === undefined ? this.getAttribute(k) : this.setAttribute(k, v);
  }
  set(k, v, i = false) {
    return i
      ? v === false || v === null
        ? this.removeAttribute(k)
        : this.setAttribute(k, '')
      : this.setAttribute(k, v);
  }
  h(e = 'div') {
    return document.createElement(e);
  }
}

class FcWaveFilter {
  constructor(n = 'wave-loading') {
    defineCustomElm(
      class extends F {
        static get observedAttributes() {
          return ['color', 'delay', 'interval', 'dur', 'amplitude', 'mode'];
        }
        constructor() {
          super();
          const d = this.h();
          d.id = 'r';
          d.innerHTML = `<slot></slot><svg id=s viewBox="0 0 100 100" preserveAspectRatio=none><mask id=m mask-type=alpha /><g/></svg>`;
          this.dom = d;
          this._i = this._a = this._b = 0;
          this._c = 3;
          (this._d = 12), (this._m = 'alpha');
          d.addEventListener('slotchange', (e) =>
            this.render(
              (this._s = Array.from(e.target.assignedElements(), (d, i) => {
                d.setAttribute(
                  'style',
                  'width:var(--width,auto);height:var(--height,auto);' +
                    (i ? 'display:none' : 'display:block;opacity:0'),
                );
                return d.src;
              })),
            ),
          );
          this.attachShadow({ mode: 'open' });
          this.shadowRoot.innerHTML = `<style>:host{display:block;width:var(--width);height:var(--height);flex-shrink:0;--max-width:none;--min-width:none;--max-height:none;--min-height:none;--box-sizing:border-box;width:var(--width,${
            isFirefox ? '-moz-' : ''
          }fit-content);height:var(--height,${
            isFirefox ? '-moz-' : ''
          }fit-content);overflow:hidden}#r{width:100%;height:100%;max-width:var(--max-width);min-width:var(--min-width);max-height:var(--max-height);min-height:var(--min-height);box-sizing:var(--box-sizing);position:relative;}#s{position:absolute;top:0;left:0;width:100%;height:100%;fill:var(--color,black)}</style>`;
          this.shadowRoot.append(d);
        }
        _e(i, a = '') {
          return `<image width=100 height=100 xlink:href=${i} preserveAspectRatio=none ${a} />`;
        }
        _g(s) {
          const { _f, _a, _c, _b, _d } = this,
            r = _a || _b,
            v = ',50,0',
            q = 'q25,';
          return `<path ${s ? 'mask=url(#m)' : ''} ${
            _f ? `fill=${_f}` : ''
          } d="M0,0H100V100H0V0Z"><animate id=a attributeName=d dur=${_c} begin="${`${
            _a ? 0 : r
          };a.end+${r < 0.1 ? 0.1 : r}`}" from="M-400,106${q + _d + v}q25,${-1 * _d + v}${
            q + _d + v
          }q25,${-1 * _d + v}${q + _d + v}q25,${-1 * _d + v}${q + _d + v}q25,${-1 * _d + v}${
            q + _d + v
          }q25,${-1 * _d + v}V100H-400Z" to="M0,-6${q + _d + v}q25,${-1 * _d + v}${q + _d + v}q25,${
            -1 * _d + v
          }${q + _d + v}q25,${-1 * _d + v}${q + _d + v}q25,${-1 * _d + v}${q + _d + v}q25,${
            -1 * _d + v
          }V100H0Z"/></path>`;
        }
        render() {
          const { dom: d, _g, _e, _h, _j, _s, _m } = this;
          let { _i } = this;
          if (_s && _s.length) {
            const [a, p] = _s,
              b = _s.length === 1,
              c = d.querySelector('#m'),
              e = d.querySelector('g'),
              f = _m === 'img',
              q = ['slideshow', 'slide show', 'slide-show'].includes(_m),
              r = ['alpha', 'luminance'].includes(_m),
              g = _e.bind(this),
              h = _g.bind(this);
            if (r) {
              c.setAttribute('mask-type', _m);
              c.innerHTML = g(a);
              e.innerHTML = g(a, 'mask=url(#m)') + h(r);
            } else if (f) {
              c.innerHTML = h(!r);
              e.innerHTML = (b ? '' : g(p)) + g(a, 'mask=url(#m)');
            } else if (q) {
              if (b) {
                throw new Error('slideshow mode at least two <img> are required');
              }
              c.innerHTML = h(!r);
              e.innerHTML = g(_s[_i]) + g(_s[_i + 1], `mask=url(#m) style="display:none"`);
              const a = d.querySelector('animate'),
                k = d.querySelectorAll('image'),
                [o, l] = k,
                x = 'xlink:href';
              a.removeEventListener('beginEvent', _h);
              a.removeEventListener('endEvent', _j);
              a.addEventListener(
                'beginEvent',
                (this._h = (_) => {
                  l.removeAttribute('style');
                  l.setAttribute(
                    x,
                    _s[_i >= _s.length - 1 ? (this._i = _i = 0) : (this._i = ++_i)],
                  );
                }),
              );
              a.addEventListener(
                'endEvent',
                (this._j = (_) => {
                  o.setAttribute(x, _s[_i]);
                }),
              );
            }
          }
        }
        attributeChangedCallback(n, o, v) {
          if (o !== v) {
            switch (n) {
              case 'color':
                this._f = v.replace(/\s*/g, '') || 'black';
                break;
              case 'delay':
                this._a = Number(v);
                break;
              case 'dur':
                this._c = Number(v) || 3;
                break;
              case 'interval':
                this._b = Number(v);
                break;
              case 'amplitude':
                this._d = (v === null ? 1 : v) * 12;
                break;
              case 'mode':
                this._m = v;
            }
            this.render();
          }
        }
        get color() {
          return this.attr('color');
        }
        set color(v) {
          this.attr('color', v);
        }
        get delay() {
          return this.attr('delay');
        }
        set delay(v) {
          this.attr('delay', v);
        }
        get dur() {
          return this.attr('dur');
        }
        set dur(v) {
          this.attr('dur', v);
        }
        get interval() {
          return this.attr('interval');
        }
        set interval(v) {
          this.attr('interval', v);
        }
        get amplitude() {
          return this.attr('amplitude');
        }
        set amplitude(v) {
          this.attr('amplitude', v);
        }
        get mode() {
          return this.attr('mode');
        }
        set mode(v) {
          this.attr('mode', v);
        }
      },
      n,
    );
  }
}

new FcWaveFilter();
