/**
 * Dynamic Dormitory Section Renderer
 * Generates and synchronizes Rooms, Facilities, and Security sections dynamically
 * across all 5 dormitory pages with full responsive auto-layout.
 */

(function () {
    'use strict';

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Safe Feature List Renderer
     */
    window.renderFeatures = function (id, features, colorClass) {
        const el = typeof id === 'string' ? document.getElementById(id) : id;
        if (el && Array.isArray(features)) {
            el.innerHTML = '';
            features.forEach(item => {
                const li = document.createElement('li');
                li.className = 'flex items-center gap-2';
                const icon = document.createElement('i');
                icon.className = `fa-solid fa-check ${colorClass || 'text-emerald-500'} text-xs mr-2`;
                li.appendChild(icon);
                li.appendChild(document.createTextNode(' ' + item));
                el.appendChild(li);
            });
        }
    };

    const dormColorThemes = {
        'golfview': {
            primary: 'emerald',
            hoverText: 'group-hover:text-emerald-600',
            badgeBg: 'bg-emerald-100',
            badgeText: 'text-emerald-800',
            accentText: 'text-emerald-700',
            iconColor: 'text-emerald-500'
        },
        'golfcity': {
            primary: 'blue',
            hoverText: 'group-hover:text-blue-600',
            badgeBg: 'bg-blue-100',
            badgeText: 'text-blue-800',
            accentText: 'text-blue-700',
            iconColor: 'text-blue-500'
        },
        'golfmansion': {
            primary: 'green',
            hoverText: 'group-hover:text-green-700',
            badgeBg: 'bg-green-100',
            badgeText: 'text-green-800',
            accentText: 'text-green-700',
            iconColor: 'text-green-600'
        },
        'maplecity': {
            primary: 'amber',
            hoverText: 'group-hover:text-amber-600',
            badgeBg: 'bg-amber-100',
            badgeText: 'text-amber-800',
            accentText: 'text-amber-700',
            iconColor: 'text-amber-500'
        },
        'maplemansion': {
            primary: 'indigo',
            hoverText: 'group-hover:text-indigo-600',
            badgeBg: 'bg-indigo-100',
            badgeText: 'text-indigo-800',
            accentText: 'text-indigo-700',
            iconColor: 'text-indigo-500'
        }
    };

    const dormRoomSchemas = {
        'golfview': [
            { id: 'standard', name: 'Standard' },
            { id: 'premium', name: 'Premium' },
            { id: 'deluxe', name: 'Deluxe' },
            { id: 'vip', name: 'VIP' },
            { id: 'paradise', name: 'Paradise' }
        ],
        'golfcity': [
            { id: 'studio-fan', legacyKey: 'Fan', name: 'Studio Fan' },
            { id: 'studio-air', legacyKey: 'Air', name: 'Studio Air' },
            { id: 're-new', legacyKey: 'ReNew', name: 'RE NEW' }
        ],
        'golfmansion': [
            { id: 'monthly-1bed', legacyKey: 'Standard', name: 'Monthly 1 Bed' },
            { id: 'monthly-2bed', legacyKey: 'Suite', name: 'Monthly 2 Bed (Suite)' }
        ],
        'maplecity': [
            { id: 'monthly-1bed', legacyKey: 'Monthly1Bed', name: 'Monthly 1 Bed' },
            { id: 'monthly-2bed', legacyKey: 'Monthly2Bed', name: 'Monthly 2 Bed' },
            { id: 'daily-1bed', legacyKey: 'Daily1Bed', name: 'Daily 1 Bed' },
            { id: 'daily-2bed', legacyKey: 'Daily2Bed', name: 'Daily 2 Bed' }
        ],
        'maplemansion': [
            { id: 'monthly-1bed', legacyKey: 'Monthly1Bed', name: 'Monthly 1 Bed' },
            { id: 'monthly-2bed', legacyKey: 'Monthly2Bed', name: 'Monthly 2 Bed' },
            { id: 'daily-1bed', legacyKey: 'Daily1Bed', name: 'Daily 1 Bed' },
            { id: 'daily-2bed', legacyKey: 'Daily2Bed', name: 'Daily 2 Bed' }
        ]
    };

    const dormFacilitySchemas = {
        'golfview': [
            { id: 'pool', image: 'image/golfview/facilities/1.png', icon: 'fa-solid fa-person-swimming' },
            { id: 'fitness', image: 'image/golfview/facilities/2.png', icon: 'fa-solid fa-dumbbell' },
            { id: 'van', image: 'image/golfview/facilities/3.png', icon: 'fa-solid fa-van-shuttle' },
            { id: 'shop', image: 'image/golfview/facilities/4.png', icon: 'fa-solid fa-shop' },
            { id: 'laundry', image: 'image/golfview/facilities/5.png', icon: 'fa-solid fa-jug-detergent' },
            { id: 'garden', image: 'image/golfview/facilities/6.png', icon: 'fa-solid fa-tree' },
            { id: 'coworking', image: 'image/golfview/facilities/7.png', icon: 'fa-solid fa-laptop' }
        ],
        'golfcity': [
            { id: '7-11', image: 'image/golfcity/facilities/7-11/1.png', icon: 'fa-solid fa-store' },
            { id: 'food', image: 'image/golfcity/facilities/food/1.png', icon: 'fa-solid fa-shop' },
            { id: 'laundry', image: 'image/golfcity/facilities/laundry/1.png', icon: 'fa-solid fa-jug-detergent' },
            { id: 'market', image: 'image/golfcity/facilities/market/1.png', icon: 'fa-solid fa-utensils' },
            { id: 'walkingstreet', image: 'image/golfcity/facilities/walkingstreet/1.png', icon: 'fa-solid fa-street-view' },
            { id: 'parking', image: 'image/golfcity/facilities/parking/1.png', icon: 'fa-solid fa-square-parking' }
        ],
        'golfmansion': [
            { id: 'garden', image: 'image/golfmansion/facilities/garden/1.png', icon: 'fa-solid fa-tree' },
            { id: 'fitness', image: 'image/golfmansion/facilities/fitness/1.png', icon: 'fa-solid fa-dumbbell' },
            { id: 'food', image: 'image/golfmansion/facilities/food/1.png', icon: 'fa-solid fa-utensils' },
            { id: 'shop', image: 'image/golfmansion/facilities/shop/1.png', icon: 'fa-solid fa-shop' },
            { id: 'parking', image: 'image/golfmansion/facilities/parking/1.png', icon: 'fa-solid fa-square-parking' }
        ],
        'maplecity': [
            { id: 'fitness', image: 'image/maplecity/facilities/fitness/1.png', icon: 'fa-solid fa-dumbbell' },
            { id: 'parking', image: 'image/maplecity/facilities/parking/1.png', icon: 'fa-solid fa-square-parking' },
            { id: 'lounge', image: 'image/maplecity/facilities/lounge/1.png', icon: 'fa-solid fa-couch' }
        ],
        'maplemansion': [
            { id: 'fitness', image: 'image/maplemansion/facilities/fitness/1.png', icon: 'fa-solid fa-dumbbell' },
            { id: 'parking', image: 'image/maplemansion/facilities/parking/1.png', icon: 'fa-solid fa-square-parking' },
            { id: 'lounge', image: 'image/maplemansion/facilities/lounge/1.png', icon: 'fa-solid fa-couch' }
        ]
    };

    /**
     * Normalizes data by creating mutable arrays for rooms, facilities, and securityItems
     * if they don't already exist.
     */
    window.normalizeDormData = function (dormId, data) {
        if (!data || typeof data !== 'object') data = {};
        const normalized = Object.assign({}, data);

        // 1. Rooms
        if (!Array.isArray(normalized.rooms) || normalized.rooms.length === 0) {
            const schema = dormRoomSchemas[dormId] || [];
            normalized.rooms = schema.map(item => {
                const legacyKey = item.legacyKey || (item.id.charAt(0).toUpperCase() + item.id.slice(1));
                const title = normalized[`room${legacyKey}Title`] || item.name;
                const desc = normalized[`room${legacyKey}Description`] || '';
                const price = normalized[`room${legacyKey}Price`] || '';
                const priceUnit = normalized[`room${legacyKey}PriceUnit`] || (item.id.startsWith('daily') ? 'บาท/คืน' : 'บาท/เดือน');
                const size = normalized[`room${legacyKey}Size`] || '';
                const features = Array.isArray(normalized[`room${legacyKey}Features`])
                    ? normalized[`room${legacyKey}Features`]
                    : ['เครื่องปรับอากาศ', 'เตียงและที่นอน', 'ตู้เสื้อผ้า'];
                const images = Array.isArray(normalized[`room${legacyKey}Images`]) && normalized[`room${legacyKey}Images`].length > 0
                    ? normalized[`room${legacyKey}Images`]
                    : (normalized[`room${legacyKey}Image`] ? [normalized[`room${legacyKey}Image`]] : [`image/${dormId}/${item.id}/1.png`]);

                return {
                    id: item.id,
                    name: item.name,
                    title: title,
                    description: desc,
                    price: price,
                    priceUnit: priceUnit,
                    size: size,
                    features: features,
                    images: images
                };
            });
        }

        // 2. Facilities
        const facSchemas = dormFacilitySchemas[dormId] || [];
        if (!Array.isArray(normalized.facilities) || normalized.facilities.length === 0) {
            const defaultIcons = [
                'fa-solid fa-person-swimming',
                'fa-solid fa-dumbbell',
                'fa-solid fa-van-shuttle',
                'fa-solid fa-shop',
                'fa-solid fa-jug-detergent',
                'fa-solid fa-tree',
                'fa-solid fa-laptop',
                'fa-solid fa-square-parking'
            ];
            const facList = [];
            const maxCount = Math.max(8, facSchemas.length);
            for (let i = 1; i <= maxCount; i++) {
                if (normalized[`facility${i}Title`] || normalized[`facility${i}Desc`]) {
                    const schemaItem = facSchemas[i - 1];
                    const defaultImg = schemaItem ? schemaItem.image : `image/${dormId}/facilities/${i}.png`;
                    const defaultIcon = schemaItem ? schemaItem.icon : defaultIcons[(i - 1) % defaultIcons.length];
                    facList.push({
                        id: schemaItem ? schemaItem.id : `fac_${i}`,
                        title: normalized[`facility${i}Title`] || `จุดที่ ${i}`,
                        desc: normalized[`facility${i}Desc`] || '',
                        icon: normalized[`facility${i}Icon`] || defaultIcon,
                        image: normalized[`facility${i}Image`] || defaultImg
                    });
                }
            }
            if (facList.length > 0) normalized.facilities = facList;
        } else {
            // Ensure facilities have proper images if defaults were invalid
            normalized.facilities.forEach((fac, idx) => {
                const schemaItem = facSchemas[idx];
                if (!fac.image || fac.image === `image/${dormId}/facilities/${idx + 1}.png` || fac.image.endsWith('/cover.png')) {
                    if (schemaItem && schemaItem.image) {
                        fac.image = schemaItem.image;
                    }
                }
            });
        }

        // 3. Security
        if (!Array.isArray(normalized.securityItems) || normalized.securityItems.length === 0) {
            const secList = [];
            for (let i = 1; i <= 6; i++) {
                if (normalized[`security${i}Title`] || normalized[`security${i}Desc`]) {
                    const defaultIcon = i === 1 ? 'fa-solid fa-video' : (i === 2 ? 'fa-solid fa-id-card' : 'fa-solid fa-user-shield');
                    secList.push({
                        id: `sec_${i}`,
                        title: normalized[`security${i}Title`],
                        desc: normalized[`security${i}Desc`] || '',
                        icon: normalized[`security${i}Icon`] || defaultIcon
                    });
                }
            }
            if (secList.length > 0) normalized.securityItems = secList;
        }

        return normalized;
    };

    /**
     * Render Rooms Section Dynamically
     */
    window.renderDynamicRooms = function (dormId, rooms, target) {
        const container = typeof target === 'string' ? document.getElementById(target) : target;
        if (!container || !Array.isArray(rooms) || rooms.length === 0) return;

        const theme = dormColorThemes[dormId] || dormColorThemes['golfview'];

        // Auto layout grid based on total rooms
        if (rooms.length === 1) {
            container.className = 'grid grid-cols-1 max-w-xl mx-auto gap-8';
        } else if (rooms.length === 2) {
            container.className = 'grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-8';
        } else {
            container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
        }

        let html = '';
        rooms.forEach((room, idx) => {
            const rawId = room.id || `room-${idx + 1}`;
            const normalizedId = String(rawId).toLowerCase().replace(/[\s_]+/g, '-');
            const title = room.title || room.name || 'ห้องพัก';
            const price = room.price ? escapeHtml(room.price) : '';
            const priceUnit = room.priceUnit ? escapeHtml(room.priceUnit) : '/เดือน';
            const size = room.size ? escapeHtml(room.size) : '';
            const desc = room.description ? escapeHtml(room.description) : '';
            const features = Array.isArray(room.features) ? room.features : [];
            const images = Array.isArray(room.images) && room.images.length > 0
                ? room.images
                : (room.image ? [room.image] : [`image/${dormId}/cover.png`]);

            html += `
            <div onclick="openGallery('${normalizedId}')" class="group cursor-pointer fade-up" data-room-id="${normalizedId}">
                <div id="carousel-${normalizedId}"
                     class="relative h-[280px] bg-slate-800 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500"
                     style="height: 280px; min-height: 280px;">
                    ${images.map((imgUrl, i) => `
                        <img src="${escapeHtml(imgUrl)}" 
                             class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === 0 ? 'opacity-100' : 'opacity-0'}"
                             alt="${escapeHtml(title)}"
                             onerror="this.src='image/${dormId}/cover.png'">
                    `).join('')}
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span class="text-white text-sm font-bold tracking-widest uppercase border border-white/50 px-6 py-2 rounded-full backdrop-blur-sm hover:bg-white hover:text-black transition">
                            ดูรูปภาพ (${images.length})
                        </span>
                    </div>
                </div>
                <div class="pt-6">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="text-2xl font-bold text-slate-800 ${theme.hoverText} transition">
                                ${escapeHtml(title)}
                            </h3>
                            ${size ? `
                            <span class="text-xs ${theme.badgeBg} ${theme.badgeText} px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider inline-block mt-1">
                                <i class="fa-solid fa-ruler-combined mr-1 text-[10px]"></i>${escapeHtml(size)}
                            </span>` : ''}
                        </div>
                        <div class="text-right">
                            <div class="text-xl font-bold ${theme.accentText}">
                                <span>${price}</span>
                            </div>
                            <div class="text-xs text-gray-400 uppercase tracking-wider">
                                ${priceUnit}
                            </div>
                        </div>
                    </div>
                    ${desc ? `<p class="text-gray-500 text-sm mb-4 line-clamp-2 mt-1">${escapeHtml(desc)}</p>` : ''}
                    ${features.length > 0 ? `
                    <ul class="space-y-2 text-sm text-gray-600 border-l-2 border-gray-200 pl-4 py-1">
                        ${features.map(f => `<li><i class="fa-solid fa-check ${theme.iconColor} text-xs mr-2"></i>${escapeHtml(f)}</li>`).join('')}
                    </ul>` : ''}
                </div>
            </div>`;
        });

        container.innerHTML = html;
        if (window.initScrollAnimations) {
            window.initScrollAnimations(container);
        }

        // Register images with gallery & restart carousel slideshows
        rooms.forEach((room) => {
            const rawId = room.id;
            const normalizedId = String(rawId).toLowerCase().replace(/[\s_]+/g, '-');
            const title = room.title || room.name || 'ห้องพัก';
            const images = Array.isArray(room.images) && room.images.length > 0
                ? room.images
                : (room.image ? [room.image] : [`image/${dormId}/cover.png`]);
            if (window.updateRoomImages) {
                window.updateRoomImages(normalizedId, images, title);
            }
        });
    };

    /**
     * Render Facilities Section Dynamically
     */
    window.renderDynamicFacilities = function (dormId, facilities, target) {
        const container = typeof target === 'string' ? document.getElementById(target) : target;
        if (!container || !Array.isArray(facilities) || facilities.length === 0) return;

        const theme = dormColorThemes[dormId] || dormColorThemes['golfview'];
        let html = '';

        facilities.forEach((fac, idx) => {
            const schemaItem = (dormFacilitySchemas[dormId] && dormFacilitySchemas[dormId][idx]) ? dormFacilitySchemas[dormId][idx] : null;
            const title = fac.title || 'สิ่งอำนวยความสะดวก';
            const desc = fac.desc ? escapeHtml(fac.desc) : '';
            const icon = fac.icon || (schemaItem ? schemaItem.icon : 'fa-solid fa-star');
            let imgUrl = fac.image;
            if (!imgUrl || imgUrl === `image/${dormId}/facilities/${idx + 1}.png` || imgUrl.endsWith('/cover.png')) {
                imgUrl = (schemaItem && schemaItem.image) ? schemaItem.image : `image/${dormId}/facilities/${idx + 1}.png`;
            }

            // Bento Hero on 1st item for golfview and golfcity
            const isHeroBento = (dormId === 'golfview' || dormId === 'golfcity') && idx === 0;

            if (isHeroBento) {
                html += `
                <div class="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group fade-up shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-slate-100 flex flex-col">
                    <div class="h-[80%] w-full relative overflow-hidden bg-slate-900">
                        <img src="${escapeHtml(imgUrl)}" 
                             class="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                             alt="${escapeHtml(title)}"
                             onerror="this.src='image/${dormId}/cover.png'">
                    </div>
                    <div class="h-[20%] flex items-center px-6 bg-white relative z-10 w-full">
                        <i class="${escapeHtml(icon)} text-3xl ${theme.iconColor} mr-4"></i>
                        <div>
                            <h4 class="text-slate-800 font-bold text-xl">${escapeHtml(title)}</h4>
                            ${desc ? `<p class="text-xs text-slate-500">${desc}</p>` : ''}
                        </div>
                    </div>
                </div>`;
            } else {
                html += `
                <div class="relative rounded-2xl overflow-hidden group fade-up shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-slate-100 flex flex-col">
                    <div class="flex-1 w-full relative overflow-hidden bg-slate-900 min-h-[140px]">
                        <img src="${escapeHtml(imgUrl)}" 
                             class="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                             alt="${escapeHtml(title)}"
                             onerror="this.src='image/${dormId}/cover.png'">
                    </div>
                    <div class="p-4 bg-white relative z-10 w-full text-center border-t border-slate-50">
                        <i class="${escapeHtml(icon)} text-xl ${theme.iconColor} mb-1"></i>
                        <p class="font-bold text-sm text-slate-700">${escapeHtml(title)}</p>
                        ${desc ? `<p class="text-xs text-slate-400 mt-1 line-clamp-1">${desc}</p>` : ''}
                    </div>
                </div>`;
            }
        });

        container.innerHTML = html;
        if (window.initScrollAnimations) {
            window.initScrollAnimations(container);
        }
    };

    /**
     * Render Security Section Dynamically
     */
    window.renderDynamicSecurity = function (dormId, securityItems, target) {
        const container = typeof target === 'string' ? document.getElementById(target) : target;
        if (!container || !Array.isArray(securityItems) || securityItems.length === 0) return;

        const theme = dormColorThemes[dormId] || dormColorThemes['golfview'];

        // Auto layout
        if (securityItems.length === 1) {
            container.className = 'grid grid-cols-1 max-w-md mx-auto gap-6';
        } else if (securityItems.length === 2) {
            container.className = 'grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-6';
        } else if (securityItems.length === 4) {
            container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';
        } else {
            container.className = 'grid grid-cols-1 md:grid-cols-3 gap-6';
        }

        let html = '';
        securityItems.forEach((sec) => {
            const title = sec.title || 'ระบบความปลอดภัย';
            const desc = sec.desc || '';
            const icon = sec.icon || 'fa-solid fa-shield-halved';

            html += `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
                <div class="${theme.iconColor} text-2xl mb-3">
                    <i class="${escapeHtml(icon)}"></i>
                </div>
                <h4 class="font-bold mb-1 text-slate-800">${escapeHtml(title)}</h4>
                <p class="text-sm text-slate-500">${escapeHtml(desc)}</p>
            </div>`;
        });

        container.innerHTML = html;
        if (window.initScrollAnimations) {
            window.initScrollAnimations(container);
        }
    };

    /**
     * Master Dispatcher: Syncs Rooms, Facilities, and Security into standard DOM containers
     */
    window.applyDynamicDormContent = function (dormId, rawData) {
        if (!rawData) return;
        const normalized = window.normalizeDormData(dormId, rawData);

        if (Array.isArray(normalized.rooms) && normalized.rooms.length > 0) {
            window.renderDynamicRooms(dormId, normalized.rooms, 'roomsContainer');
            // Update room count label if present in HTML
            const countEl = document.querySelector('#rooms .text-slate-400');
            if (countEl) {
                countEl.textContent = `มีห้องพัก ${normalized.rooms.length} รูปแบบ`;
            }
        }
        if (Array.isArray(normalized.facilities) && normalized.facilities.length > 0) {
            window.renderDynamicFacilities(dormId, normalized.facilities, 'facilitiesContainer');
        }
        if (Array.isArray(normalized.securityItems) && normalized.securityItems.length > 0) {
            window.renderDynamicSecurity(dormId, normalized.securityItems, 'securityContainer');
        }

        if (window.initScrollAnimations) {
            window.initScrollAnimations();
        }

        return normalized;
    };
})();
