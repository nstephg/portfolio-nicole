import fs from 'fs';
import * as cheerio from 'cheerio';
import path from 'path';

const html = fs.readFileSync('index.html', 'utf-8');
const $ = cheerio.load(html);

const componentsDir = 'src/components';
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir);

const extractComponent = (selector, name) => {
    const el = $(selector);
    if (!el.length) return false;
    const content = $.html(el);
    const astroContent = `---
// ${name}.astro
---

${content}
`;
    fs.writeFileSync(path.join(componentsDir, `${name}.astro`), astroContent);
    // Replace element with component tag
    el.replaceWith(`<${name} />`);
    return true;
};

// Layout
const head = $.html($('head'));

// Extract sections
const components = [];

if (extractComponent('nav.navbar', 'Navbar')) components.push('Navbar');
if (extractComponent('header.hero', 'Hero')) components.push('Hero');
if (extractComponent('section#sobre-mi', 'About')) components.push('About');
if (extractComponent('section#habilidades', 'Skills')) components.push('Skills');
if (extractComponent('section#proyectos', 'Projects')) components.push('Projects');
if (extractComponent('section#trayectoria', 'Experience')) components.push('Experience');
if (extractComponent('section#servicios', 'Services')) components.push('Services');
if (extractComponent('section#cotizacion', 'Pricing')) components.push('Pricing');
if (extractComponent('section#contacto', 'Contact')) components.push('Contact');
if (extractComponent('footer.footer-premium', 'Footer')) components.push('Footer');

const bodyContent = $.html($('body'));

const layoutContent = `---
import '../styles/global.css';
import '../styles/custom.css';
---
<!DOCTYPE html>
<html lang="es">
${head}
${bodyContent.replace('<body>', '<body>\n\t\t<slot />')}
</html>
`;

fs.writeFileSync('src/layouts/Layout.astro', layoutContent);

const imports = components.map(c => `import ${c} from '../components/${c}.astro';`).join('\n');
const tags = components.map(c => `<${c} />`).join('\n\t\t');

const indexAstro = `---
import Layout from '../layouts/Layout.astro';
${imports}
---

<Layout>
    <main class="site-wrapper">
        ${tags}
    </main>
</Layout>
`;

fs.writeFileSync('src/pages/index.astro', indexAstro);

// Move css
fs.copyFileSync('style.css', 'src/styles/custom.css');

console.log('Migration complete');
