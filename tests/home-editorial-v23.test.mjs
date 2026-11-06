import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function harness() {
  const saved = new Map();
  const images = [];
  const context = vm.createContext({
    window: {},
    document: {
      body: { dataset: { page: 'admin' } },
      documentElement: { style: { setProperty() {} } },
      querySelector: () => null,
      querySelectorAll: selector => selector === 'img[data-media-key]' ? images : [],
    },
    localStorage: { getItem: key => saved.get(key) || null, setItem: (key, value) => saved.set(key, value) },
    sessionStorage: { getItem: () => null },
    structuredClone, Intl, Date, URL, URLSearchParams,
    location: { href: 'https://example.test/cms-demo?lang=vi', search: '', hash: '' },
    console,
  });
  for (const file of ['demo-translations.js', 'v13-copy.js', 'v14-copy.js', 'locale-routing.js', 'flagship-content.js', 'flagship-editorial.js']) {
    vm.runInContext(fs.readFileSync(new URL('../public/' + file, import.meta.url), 'utf8'), context);
  }
  const startup = 'wire();wireV7();wireV8();wireFlagship();wireV14();renderPage();';
  const source = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.ok(source.includes(startup), 'CMS harness must intercept application startup');
  vm.runInContext(source.replace(startup, `notify=()=>{};window.testHome={data:()=>db,defaults,legacyHomeCopy,homeCopyKeys,defaultHome,migrateEditorialData,home,applyImageTransforms,setLang:lang=>{currentLang=lang}};`), context);
  const api = context.window.testHome;
  for (const key of Object.keys(api.data().home.sections)) api.data().home.sections[key] = false;
  return { api, images, copy: context.window.MDFlagship.copy };
}

const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const storyOf = html => html.match(/<section class="section md-connection-story"[\s\S]*?<\/section>/)?.[0] || '';

for (const lang of ['vi', 'en', 'zh', 'ko']) {
  test(`${lang}: about and gallery toggles independently control copy, media and anchors`, () => {
    const { api } = harness();
    api.setLang(lang);
    const h = api.data().home;
    h.aboutTitle = 'CUSTOM ABOUT TITLE';
    h.aboutIntro = 'CUSTOM ABOUT INTRO';
    h.galleryTitle = 'CUSTOM GALLERY TITLE';
    for (const about of [false, true]) {
      for (const gallery of [false, true]) {
        h.sections.about = about;
        h.sections.gallery = gallery;
        const html = api.home();
        const story = storyOf(html);
        assert.equal(Boolean(story), about || gallery);
        assert.equal(story.includes('CUSTOM ABOUT TITLE'), about);
        assert.equal(story.includes('CUSTOM ABOUT INTRO'), about);
        assert.equal(story.includes('CUSTOM GALLERY TITLE'), gallery && !about);
        assert.equal(story.includes('md-gallery-archive'), gallery);
        assert.equal(story.includes('<img'), gallery);
        assert.equal(story.includes('class="md-connection-caption"'), gallery);
        assert.equal(story.includes('id="gallery"'), gallery);
        assert.equal(story.includes('id="home-story"'), about && !gallery);
        assert.equal((html.match(/id="find-work"/g) || []).length, 1);
        assert.equal((html.match(/id="workforce"/g) || []).length, 1);
        assert.ok(html.indexOf('id="find-work"') < html.indexOf('id="solutions"'),'V26 worker search precedes business solutions');
      }
    }
  });
}

test('custom Vietnamese source copy remains visible and escaped through migration', () => {
  const { api } = harness();
  const data = api.data();
  data.homeCopyRevision = 21;
  data.home.aboutTitle = 'Tiêu đề <riêng> & mới';
  data.home.aboutIntro = 'Giới thiệu "riêng" của doanh nghiệp';
  data.home.sections.about = true;
  api.migrateEditorialData(data);
  const story = storyOf(api.home());
  assert.ok(story.includes(`<h2>${escape(data.home.aboutTitle)}</h2>`));
  assert.ok(story.includes(`<p>${escape(data.home.aboutIntro)}</p>`));
  assert.ok(!story.includes('<riêng>'));
  assert.equal(data.homeCopyRevision, 23);
});

test('translation-only edits render with unchanged canonical Vietnamese about source', () => {
  const { api } = harness();
  const data = api.data();
  data.home.sections.about = true;
  assert.equal(data.home.aboutTitle, api.defaultHome.aboutTitle);
  assert.equal(data.home.aboutIntro, api.defaultHome.aboutIntro);
  for (const lang of ['en', 'zh', 'ko']) {
    data.i18n['home:main'] = { [lang]: { aboutTitle: `${lang} edited <title>`, aboutIntro: `${lang} edited & introduction` } };
    api.setLang(lang);
    const story = storyOf(api.home());
    assert.ok(story.includes(`<h2>${escape(data.i18n['home:main'][lang].aboutTitle)}</h2>`));
    assert.ok(story.includes(`<p>${escape(data.i18n['home:main'][lang].aboutIntro)}</p>`));
    assert.equal(data.home.aboutTitle, api.defaultHome.aboutTitle);
    assert.equal(data.home.aboutIntro, api.defaultHome.aboutIntro);
  }
});

test('revision 23 upgrades only legacy source fields and retains translations, toggles and crops', () => {
  const { api, copy } = harness();
  for (const revision of [undefined, 21, 22, 23]) {
    const data = api.defaults();
    data.homeCopyRevision = revision;
    Object.assign(data.home, api.legacyHomeCopy);
    data.home.aboutIntro = 'Edited source introduction';
    data.i18n['home:main'] = { en: { aboutTitle: 'English only edit', status: 'translated' } };
    data.home.sections.about = false;
    data.home.sections.gallery = true;
    data.mediaTransforms.gallery3 = { x: 0, y: 90, zoom: 140, brightness: 85, contrast: 105 };
    const retained = JSON.stringify({ i18n: data.i18n, sections: data.home.sections, transforms: data.mediaTransforms });
    api.migrateEditorialData(data);
    assert.equal(data.home.aboutTitle, revision === 23 ? api.legacyHomeCopy.aboutTitle : copy.connectionTitle[0]);
    assert.equal(data.home.aboutIntro, 'Edited source introduction');
    assert.equal(data.homeCopyRevision, 23);
    assert.equal(JSON.stringify({ i18n: data.i18n, sections: data.home.sections, transforms: data.mediaTransforms }), retained);
    const migrated = JSON.stringify(data);
    api.migrateEditorialData(data);
    assert.equal(JSON.stringify(data), migrated);
  }
});

test('gallery archive exposes every custom slot and caption; chosen cards display edited captions and retain crop keys', () => {
  const { api, images } = harness();
  const h = api.data().home;
  h.sections.gallery = true;
  h.galleryTitle = 'Album <riêng>';
  h.gallery = Array.from({ length: 7 }, (_, i) => ({ src: `https://example.test/custom-${i}.webp`, caption: `Caption ${i} <custom> & approved` }));
  api.data().i18n['home:main'] = { en: { galleryTitle: 'Edited EN album' } };
  for (const lang of ['vi', 'en', 'zh', 'ko']) {
    api.setLang(lang);
    const story = storyOf(api.home());
    assert.ok(story.includes(`<h2>${lang === 'en' ? 'Edited EN album' : escape(h.galleryTitle)}</h2>`));
    const archive = story.match(/<details class="md-gallery-archive">([\s\S]*?)<\/details>/)?.[1];
    assert.ok(archive);
    assert.equal((archive.match(/class="gallery-item"/g) || []).length, h.gallery.length);
    for (const media of h.gallery) {
      assert.ok(archive.includes(`src="${media.src}"`));
      assert.ok(archive.includes(`<span>${escape(media.caption)}</span>`));
    }
    for (const i of [3, 0, 2]) {
      assert.ok(story.includes(`data-media-key="gallery${i}"`));
      assert.ok(story.includes(`<figcaption>${escape(h.gallery[i].caption)}</figcaption>`));
    }
    assert.ok(!story.includes('<custom>'));
  }
  for (const i of [3, 0, 2]) {
    api.data().mediaTransforms[`gallery${i}`] = { x: i * 10, y: 70, zoom: 130, brightness: 90, contrast: 110 };
    images.push({ dataset: { mediaKey: `gallery${i}` }, style: {} });
  }
  api.applyImageTransforms();
  for (const [position, i] of [3, 0, 2].entries()) {
    assert.equal(images[position].style.objectPosition, `${i * 10}% 70%`);
    assert.equal(images[position].style.transform, 'scale(1.3)');
  }
});

test('mechanical image migration replaces only the old sample on the mechanical job', () => {
  const { api } = harness();
  for (const image of ['gallery-operator.webp', 'mechanical-assembly-v23.webp', 'custom.webp', 'https://example.test/custom.webp', 'data:image/webp;base64,AAAA', 'assets/gallery-operator.webp']) {
    const data = api.defaults();
    data.editorialRevision = 21;
    data.homeCopyRevision = 23;
    const job = data.jobs.find(item => item.id === 'cn-co-khi');
    job.image = image;
    const other = data.jobs.find(item => item.id !== job.id);
    other.image = 'gallery-operator.webp';
    data.mediaTransforms['job:cn-co-khi'] = { x: 0, y: 80, zoom: 150 };
    const crop = JSON.stringify(data.mediaTransforms);
    api.migrateEditorialData(data);
    assert.equal(job.image, image === 'gallery-operator.webp' ? 'mechanical-assembly-v23.webp' : image);
    assert.equal(other.image, 'gallery-operator.webp');
    assert.equal(JSON.stringify(data.mediaTransforms), crop);
    const migrated = JSON.stringify(data);
    api.migrateEditorialData(data);
    assert.equal(JSON.stringify(data), migrated);
  }
});
