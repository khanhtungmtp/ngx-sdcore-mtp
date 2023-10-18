import { AsyncSubject } from "rxjs";

/**
 * callPrint
 * @param contentWindow
 * @param iframe
 * @param as
 */
export const callPrint = (contentWindow: any, iframe: any, as: AsyncSubject<any>) => {
  if (contentWindow && contentWindow.printPage) {
    contentWindow.printPage(() => setTimeout(() => AS_COMPLETE(as, contentWindow)));
    if (iframe) {
      document.body.removeChild(iframe);
    }
  } else {
    setTimeout(() => callPrint(contentWindow, iframe, as), 50);
  }
};

/**
 * getBaseHref
 * @returns
 */
export const getBaseHref = () => {
  const port = (window.location.port) ? `:${window.location.port}` : '';
  return `${window.location.protocol}//${window.location.hostname}${port}${window.location.pathname}`;
};

/**
 * getMarkup
 * @param elementHtml
 * @param options
 * @returns
 */
export const getMarkup = (elementHtml: any, options: any) => {
  const template = options.templateString;
  const templateRegex = new RegExp(/{{\s*printBody\s*}}/gi);
  let stylesheets;
  let styles;
  const html = [];

  if (template && templateRegex.test(template)) {
    elementHtml = template.replace(templateRegex, elementHtml);
  }

  html.push(`<html><head><title>${options.pageTitle || ''}</title>`);

  // If stylesheet URL's or list of stylesheet URL's are specified, override page stylesheets
  if (options.stylesheets) {
    stylesheets = Array.isArray(options.stylesheets) ? options.stylesheets : [options.stylesheets];
  } else {
    stylesheets = Array.prototype.slice
      .call(document.getElementsByTagName('link'))
      .map(link => link);
  }

  stylesheets.forEach((f: any) => {
    html.push(`<link rel="${f.rel}" href="${f.href}">`);
  });

  // If inline styles or list of inline styles are specified, override inline styles
  if (options.styles) {
    styles = Array.isArray(options.styles) ? [...options.styles, `.print-none { display: none; }`] : [options.styles + `.print-none { display: none; }`];
  } else {
    styles = Array.prototype.slice
      .call(document.getElementsByTagName('style'))
      .map(style => style.innerHTML);
  }

  styles.forEach((style: any) => {
    html.push(`<style type="text/css">${style}</style>`);
  });

  html.push(`<base href="${getBaseHref()}"/>`);
  html.push('</head><body class="pe-body">');
  html.push(elementHtml);
  html.push(`
    <script type="text/javascript">
      function printPage(cb) {
        focus();
        print();
        cb();
        ${options.printMode.toLowerCase() === 'popup' && 'close();'}
      }
    </script>
  `);
  html.push('</body></html>');

  return html.join('');
};

/**
 * printHtml
 * @param element
 * @param selfOptions
 * @param as
 */
export const printHtml = (element: any, selfOptions = {}, as: AsyncSubject<any>) => {
  const defaultOptions = {
    htmlType: 'domObj',
    printMode: 'template',
    pageTitle: '',
    templateString: '',
    popupProperties: '',
    stylesheets: null,
    styles: null
  };
  const options = { ...defaultOptions, ...selfOptions };
  let html = element;
  if (options.htmlType === 'domObj') {
    html = element.outerHTML;
  }

  // Get markup to be printed
  const markup = getMarkup(html, options);
  let printWindow;
  let printIframe;
  let printDocument: any;
  let printElementID;

  if (options.printMode.toLowerCase() === 'popup') {
    printWindow = window.open('about:blank', 'printElementWindow', options.popupProperties);
    printDocument = printWindow && printWindow.document;
  } else {
    printElementID = `printElement_${(Math.round(Math.random() * 99999)).toString()}`;

    printIframe = document.createElement('iframe');
    printIframe.setAttribute('id', printElementID);
    printIframe.setAttribute('src', 'about:blank');
    printIframe.setAttribute('frameBorder', '0');
    printIframe.setAttribute('scrolling', 'no');
    printIframe.setAttribute('style', 'position:fixed;bottom:100%;right:100%;');

    document.body.appendChild(printIframe);

    printDocument = (printIframe.contentWindow || printIframe.contentDocument);
    if (printDocument.document) {
      printDocument = printDocument.document;
    }

    printIframe = (document as any).frames ? (document as any).frames[printElementID] : document.getElementById(printElementID);
    printWindow = printIframe.contentWindow || printIframe;
  }

  printWindow.focus();

  // SetTimeout fixesiframe printMode does not work in firefox
  setTimeout(() => {
    printDocument.write(markup);
    printDocument.close();
  });

  callPrint(printWindow, printIframe, as);
};

/**
 * Rxjs complete
 * @param as
 * @param data
 * @param error
 */
export const AS_COMPLETE = (as: AsyncSubject<any>, data: any, error = null) => {
  error ? as.error(error) : as.next(data);
  as.complete();
};
