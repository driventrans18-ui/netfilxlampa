(function () {
    'use strict';

    if (window.plugin_netflix_theme_ready) return;

    function startPlugin() {
        window.plugin_netflix_theme_ready = true;

        // ============================================
        // Netflix Theme for Lampa TV
        // ============================================

        var THEME_CSS = '@@CSS@@'; // Replaced at build, or loaded separately

        var heroTimer = null;
        var heroEl = null;
        var overlayObserver = null;
        var rowObserver = null;

        // ---- CSS Injection ----
        function injectCSS() {
            if (document.getElementById('netflix-theme-css')) return;

            // If built with inlined CSS
            if (THEME_CSS && THEME_CSS !== '@@' + 'CSS@@') {
                var style = document.createElement('style');
                style.id = 'netflix-theme-css';
                style.type = 'text/css';
                style.textContent = THEME_CSS;
                document.head.appendChild(style);
            } else {
                // Load external CSS file from same directory as the plugin
                var scripts = document.querySelectorAll('script[src]');
                var basePath = '';
                for (var i = 0; i < scripts.length; i++) {
                    if (scripts[i].src.indexOf('netflix') !== -1) {
                        basePath = scripts[i].src.replace(/[^\/]+$/, '');
                        break;
                    }
                }
                var link = document.createElement('link');
                link.id = 'netflix-theme-css';
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = basePath + 'style.css';
                document.head.appendChild(link);
            }
        }

        // ---- Intro Animation ----
        function showIntro() {
            var intro = document.createElement('div');
            intro.className = 'nf-intro';
            intro.innerHTML = '<div class="nf-intro__text">LAMPA</div>';
            document.body.appendChild(intro);

            setTimeout(function () {
                if (intro.parentNode) {
                    intro.parentNode.removeChild(intro);
                }
            }, 3500);
        }

        // ---- Hero Billboard ----
        function createHero() {
            if (heroEl) return heroEl;

            heroEl = document.createElement('div');
            heroEl.className = 'nf-hero';
            heroEl.innerHTML =
                '<img class="nf-hero__image" src="" alt="" />' +
                '<div class="nf-hero__gradient"></div>' +
                '<div class="nf-hero__info">' +
                    '<div class="nf-hero__title"></div>' +
                    '<div class="nf-hero__meta">' +
                        '<span class="nf-hero__year"></span>' +
                        '<span class="nf-hero__vote"></span>' +
                        '<span class="nf-hero__genres"></span>' +
                    '</div>' +
                    '<div class="nf-hero__overview"></div>' +
                '</div>';

            var wrap = document.querySelector('.wrap');
            if (wrap) {
                wrap.parentNode.insertBefore(heroEl, wrap);
            } else {
                document.body.appendChild(heroEl);
            }

            return heroEl;
        }

        function updateHero(card) {
            if (!card) return;

            clearTimeout(heroTimer);

            heroTimer = setTimeout(function () {
                var data = getCardData(card);
                if (!data) {
                    hideHero();
                    return;
                }

                var hero = createHero();
                var img = hero.querySelector('.nf-hero__image');
                var title = hero.querySelector('.nf-hero__title');
                var year = hero.querySelector('.nf-hero__year');
                var vote = hero.querySelector('.nf-hero__vote');
                var genres = hero.querySelector('.nf-hero__genres');
                var overview = hero.querySelector('.nf-hero__overview');

                // Use backdrop image if available
                var backdrop = data.backdrop || data.img || '';
                if (backdrop) {
                    // Convert poster to backdrop size for TMDB images
                    backdrop = backdrop.replace('/w200/', '/w1280/').replace('/w300/', '/w1280/').replace('/w500/', '/w1280/');
                    img.src = backdrop;
                    img.style.display = '';
                } else {
                    img.style.display = 'none';
                }

                title.textContent = data.title || '';
                year.textContent = data.year || '';

                if (data.vote) {
                    vote.textContent = data.vote;
                    vote.style.display = '';
                } else {
                    vote.style.display = 'none';
                }

                genres.textContent = data.genres || '';
                overview.textContent = data.overview || '';

                hero.classList.add('visible');
            }, 600);
        }

        function hideHero() {
            if (heroEl) {
                heroEl.classList.remove('visible');
            }
            clearTimeout(heroTimer);
        }

        // ---- Card Data Extraction ----
        function getCardData(cardEl) {
            if (!cardEl) return null;

            var data = {};

            // Try to extract from the card's lampa data
            try {
                var $card = Lampa.jQuery ? Lampa.jQuery(cardEl) : $(cardEl);
                var cardData = $card.data('card') || {};

                data.title = cardData.title || cardData.name || cardData.original_title || cardData.original_name || '';
                data.year = '';
                var dateStr = cardData.release_date || cardData.first_air_date || '';
                if (dateStr) {
                    data.year = dateStr.substring(0, 4);
                }
                data.vote = cardData.vote_average ? parseFloat(cardData.vote_average).toFixed(1) : '';
                data.overview = cardData.overview || '';
                data.img = cardData.poster_path ? ('https://image.tmdb.org/t/p/w500' + cardData.poster_path) : '';
                data.backdrop = cardData.backdrop_path ? ('https://image.tmdb.org/t/p/w1280' + cardData.backdrop_path) : '';

                // Try getting genres
                if (cardData.genre_ids && cardData.genre_ids.length && Lampa.Api) {
                    try {
                        var type = cardData.first_air_date ? 'tv' : 'movie';
                        var genreNames = Lampa.Api.sources.tmdb.getGenresNameFromIds(type, cardData.genre_ids);
                        if (genreNames) data.genres = genreNames;
                    } catch (e) {}
                }
                if (!data.genres && cardData.genres) {
                    data.genres = cardData.genres.map(function (g) { return g.name; }).join(', ');
                }
            } catch (e) {
                // Fallback: extract from DOM
                var titleEl = cardEl.querySelector('.card__title');
                var ageEl = cardEl.querySelector('.card__age');
                var voteEl = cardEl.querySelector('.card__vote');
                var imgEl = cardEl.querySelector('.card__img');

                data.title = titleEl ? titleEl.textContent.trim() : '';
                data.year = ageEl ? ageEl.textContent.trim() : '';
                data.vote = voteEl ? voteEl.textContent.trim() : '';
                data.img = imgEl ? (imgEl.src || imgEl.style.backgroundImage.replace(/url\(["']?/, '').replace(/["']?\)/, '')) : '';
                data.backdrop = '';
                data.overview = '';
                data.genres = '';
            }

            if (!data.title && !data.img) return null;
            return data;
        }

        // ---- Card Overlay Injection ----
        function addCardOverlay(card) {
            if (card.querySelector('.nf-card-overlay')) return;

            var view = card.querySelector('.card__view');
            if (!view) return;

            var data = getCardData(card);
            if (!data || !data.title) return;

            var overlay = document.createElement('div');
            overlay.className = 'nf-card-overlay';

            var html = '<div class="nf-card-overlay__title">' + escapeHtml(data.title) + '</div>';
            html += '<div class="nf-card-overlay__meta">';
            if (data.year) {
                html += '<span class="nf-card-overlay__year">' + escapeHtml(data.year) + '</span>';
            }
            if (data.vote && data.vote !== '0' && data.vote !== '0.0') {
                html += '<span>&#9733; ' + escapeHtml(data.vote) + '</span>';
            }
            html += '</div>';

            overlay.innerHTML = html;
            view.style.position = 'relative';
            view.appendChild(overlay);
        }

        function processCards(container) {
            var cards = (container || document).querySelectorAll('.card');
            for (var i = 0; i < cards.length; i++) {
                addCardOverlay(cards[i]);
            }
        }

        // ---- Row Animations ----
        function animateRows(container) {
            var rows = (container || document).querySelectorAll('.items-line');
            for (var i = 0; i < rows.length; i++) {
                if (!rows[i].classList.contains('nf-row-animated')) {
                    rows[i].classList.add('nf-row-animated');
                }
            }
        }

        // ---- Mutation Observer for Dynamic Content ----
        function startObservers() {
            var target = document.querySelector('.activitys') || document.body;

            // Watch for new cards and rows
            overlayObserver = new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    var added = mutations[i].addedNodes;
                    for (var j = 0; j < added.length; j++) {
                        var node = added[j];
                        if (node.nodeType !== 1) continue;

                        if (node.classList && node.classList.contains('card')) {
                            addCardOverlay(node);
                        } else if (node.querySelectorAll) {
                            processCards(node);
                            animateRows(node);
                        }
                    }
                }
            });

            overlayObserver.observe(target, {
                childList: true,
                subtree: true
            });

            // Watch for focus changes to update hero
            var focusObserver = new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    var t = mutations[i].target;
                    if (t.classList && t.classList.contains('card')) {
                        if (t.classList.contains('focus')) {
                            updateHero(t);
                        }
                    }
                }
            });

            focusObserver.observe(target, {
                attributes: true,
                attributeFilter: ['class'],
                subtree: true
            });
        }

        // ---- Utility ----
        function escapeHtml(str) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        }

        // ---- Settings Integration ----
        function addSettings() {
            if (!Lampa.SettingsApi) return;

            // Add Netflix Theme settings
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'netflix_hero',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: Lampa.Lang.translate('netflix_theme_hero') || 'Netflix Hero Banner',
                    description: Lampa.Lang.translate('netflix_theme_hero_descr') || 'Show hero billboard with backdrop image'
                },
                onChange: function (val) {
                    Lampa.Storage.set('netflix_hero', val);
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'netflix_overlays',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: Lampa.Lang.translate('netflix_theme_overlays') || 'Card Overlays',
                    description: Lampa.Lang.translate('netflix_theme_overlays_descr') || 'Show title and info overlay on focused cards'
                },
                onChange: function (val) {
                    Lampa.Storage.set('netflix_overlays', val);
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: {
                    name: 'netflix_animations',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: Lampa.Lang.translate('netflix_theme_animations') || 'Row Animations',
                    description: Lampa.Lang.translate('netflix_theme_animations_descr') || 'Animated entrance for content rows'
                },
                onChange: function (val) {
                    Lampa.Storage.set('netflix_animations', val);
                }
            });
        }

        // ---- Translations ----
        function addTranslations() {
            if (!Lampa.Lang) return;

            Lampa.Lang.add({
                netflix_theme_hero: {
                    en: 'Netflix Hero Banner',
                    ru: 'Netflix баннер',
                    uk: 'Netflix банер',
                    be: 'Netflix банер'
                },
                netflix_theme_hero_descr: {
                    en: 'Show hero billboard with backdrop image',
                    ru: 'Показывать баннер с фоновым изображением',
                    uk: 'Показувати банер з фоновим зображенням',
                    be: 'Паказваць банер з фонавым відарысам'
                },
                netflix_theme_overlays: {
                    en: 'Card Overlays',
                    ru: 'Наложения на карточки',
                    uk: 'Накладення на картки',
                    be: 'Накладанні на карткі'
                },
                netflix_theme_overlays_descr: {
                    en: 'Show title and info overlay on focused cards',
                    ru: 'Показывать название и информацию на выбранных карточках',
                    uk: 'Показувати назву та інформацію на вибраних картках',
                    be: 'Паказваць назву і інфармацыю на абраных картках'
                },
                netflix_theme_animations: {
                    en: 'Row Animations',
                    ru: 'Анимация строк',
                    uk: 'Анімація рядків',
                    be: 'Анімацыя радкоў'
                },
                netflix_theme_animations_descr: {
                    en: 'Animated entrance for content rows',
                    ru: 'Анимация появления строк с контентом',
                    uk: 'Анімація появи рядків з контентом',
                    be: 'Анімацыя з\'яўлення радкоў з кантэнтам'
                }
            });
        }

        // ---- Main Init ----
        function addPlugin() {
            injectCSS();
            addTranslations();
            addSettings();
            showIntro();

            // Process existing content
            setTimeout(function () {
                var heroEnabled = Lampa.Storage.get('netflix_hero', true);
                var overlaysEnabled = Lampa.Storage.get('netflix_overlays', true);
                var animationsEnabled = Lampa.Storage.get('netflix_animations', true);

                if (overlaysEnabled) processCards();
                if (animationsEnabled) animateRows();
                startObservers();

                // Listen to activity changes for row animations
                Lampa.Listener.follow('activity', function (e) {
                    if (e.type === 'start' || e.type === 'archive') {
                        setTimeout(function () {
                            if (Lampa.Storage.get('netflix_overlays', true)) processCards();
                            if (Lampa.Storage.get('netflix_animations', true)) animateRows();
                        }, 100);
                    }
                });

                // Hide hero when entering detail or player views
                Lampa.Listener.follow('full', function (e) {
                    if (e.type === 'start') hideHero();
                });

                Lampa.Listener.follow('player', function (e) {
                    if (e.type === 'start') hideHero();
                });
            }, 300);
        }

        // ---- Start ----
        if (window.appready) {
            addPlugin();
        } else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') addPlugin();
            });
        }
    }

    startPlugin();
})();
