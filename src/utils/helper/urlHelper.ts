import { forIn, isArray, forEach, join, trimEnd } from 'lodash';

export function formatUrl(url: string, data: { [index: string]: string }) {
  const paths: string[] = [];

  forIn(data, (value, key) => {
    if (isArray(value) && value.length > 0) {
      const values: string[] = [];
      forEach(value, (item) => {
        values.push(encodeURIComponent(key) + '=' + encodeURIComponent(item));
      });
      paths.push(join(values, '&'));
    } else {
      paths.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  });
  return trimEnd(url, '/') + '/' + join(paths, '&');
}
