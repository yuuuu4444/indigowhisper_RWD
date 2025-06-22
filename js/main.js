const MOBILE_BREAKPOINT = 768;

//header-切換手機導覽開關 
function hamburger(){
    let hamburger = document.querySelector(".hamburger");
    let nav = document.getElementById("nav");

     // 檢查元素是否存在
    if (!hamburger || !nav) {
        console.warn('.hamburger 或 .nav 元素不存在，跳過 hamburger 函式初始化。');
        return;
    }
    
    hamburger.addEventListener("click", function () {
        nav.classList.toggle("mobile-active");
        hamburger.classList.toggle("active")
    });
    
    //在視窗尺寸變化時，移除 nav的mobile-active狀態、漢堡的active
    window.addEventListener("resize", function () {
        if (window.innerWidth >= MOBILE_BREAKPOINT) {
            nav.classList.remove("mobile-active");
            hamburger.classList.remove("active")
        }
    });
}

//header-切換搜尋按鈕開關
function search(){
    let modal = document.getElementById("searchModal");
    let btn = document.getElementById("searchBtn");
    let closeBtn = document.querySelector(".closeBtn");
    let input = document.getElementById("searchInput");
    let submit = document.getElementById("searchSubmit");

    if (!modal || !btn) { 
        console.warn('搜尋彈窗相關元素不存在，跳過 search 函式初始化。');
        return;
    }
    
    // 開啟彈窗
    btn.addEventListener("click", function(e) {
        e.preventDefault();
        modal.style.display = "block";
        setTimeout(() => input.focus(), 100); // 自動聚焦
    });
    
    // 關閉彈窗（按X）
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });
    
    // 點外部關閉彈窗
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    
    // 按 Enter 執行搜尋
    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            submit.click();
        }
    });
    
    // 搜尋按鈕功能
    submit.addEventListener("click", function(){
        let keyword = input.value.trim();
        if (keyword) {
            // alert("搜尋關鍵字：" + keyword);
            // 這裡可以改成導向搜尋頁或執行 Ajax
            modal.style.display = "none";
            input.value = "";
        } else {
            alert("請輸入關鍵字");
        }
    });
}

//header->768滾動顯示
function toggleHeader() {
    const nav = document.getElementById('nav');
    const header = document.getElementById('header');
    const hamburger = document.querySelector(".hamburger");

    // 檢查元素是否存在
    if (!nav || !header || !hamburger) {
        console.warn('.header 或 .nav 或 .hamburger 元素不存在，跳過 toggleHeader 函式初始化。');
        return;
    }

    // 獲取當前頁面的檔名
    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1); // 提取檔名，例如 "index.html" 或 "about.html"

    // 根據檔名設定不同的閾值
    let threshold = 800; // 預設閾值
    if (fileName === 'index.html' || fileName === '') { // 判斷是否為首頁
        // 考慮到有些人會直接訪問 domain.com 而不是 domain.com/index.html
        // 所以 fileName 為空字串也視為首頁
        threshold = 800;
    } else {
        threshold = 100;
    }

    const toggleNav = () => {
        // 確保 MOBILE_BREAKPOINT 已經定義。如果沒有，可能會有錯誤。
        // 例如： const MOBILE_BREAKPOINT = 768;
        if (typeof MOBILE_BREAKPOINT === 'undefined') {
            console.error('MOBILE_BREAKPOINT 未定義。請確保它已在全局範圍內定義。');
            return;
        }

        if (window.innerWidth >= MOBILE_BREAKPOINT && window.scrollY >= threshold) {
            nav.classList.add('is-visible');
            header.classList.add('is-visible');
        } else {
            nav.classList.remove("mobile-active"); // 移除手機導覽 active (防止手機切回桌面時導覽還開著)
            hamburger.classList.remove("active"); // 移除漢堡按鈕 active
            nav.classList.remove('is-visible');
            header.classList.remove('is-visible');
        }
    };

    toggleNav(); // 頁面剛載入時先執行一次
    window.addEventListener('scroll', toggleNav);
    window.addEventListener('resize', toggleNav); // RWD切換裝置時重新判斷
}



//banner-768~1919縮放
function handleBannerScale() {
    const windowWidth = window.innerWidth;
    const bannerScaleWrap = document.querySelector('.bannerScaleWrap');
    const bannerSection = document.querySelector('.bannerSection');
    
    // 確保元素存在
    if (!bannerScaleWrap || !bannerSection) {
        console.warn('找不到 .bannerScaleWrap 或 .bannerSection 元素，跳過 handleBannerScale 函式初始化。');
        return;
    }
    
    if (windowWidth >= MOBILE_BREAKPOINT && windowWidth <= 1919) {
        // 桌面版縮放區間 (768px - 1919px)
        const scaleRatio = windowWidth / 1920;
        const scaledHeight = 1000 * scaleRatio;
        
        // 應用縮放效果
        bannerScaleWrap.style.transform = `scale(${scaleRatio})`;
        bannerSection.style.height = `${scaledHeight}px`;
        
        console.log(`桌面版縮放 - 視窗寬度: ${windowWidth}px, 縮放比例: ${scaleRatio.toFixed(3)}`);
        
    } else if (windowWidth >= 1920) {
        // 大螢幕版 (≥1920px)：不縮放
        bannerScaleWrap.style.transform = 'scale(1)';
        bannerSection.style.height = '1000px';
        
        console.log(`大螢幕版 - 視窗寬度: ${windowWidth}px, 不縮放`);
        
    } else {
        // 手機版 (<768px)：清除所有 JS 樣式，讓 CSS 接管
        bannerScaleWrap.style.transform = '';
        bannerScaleWrap.style.width = '';
        bannerScaleWrap.style.height = '';
        bannerSection.style.height = '';
        
        console.log(`手機版 - 視窗寬度: ${windowWidth}px, 使用 CSS 手機版樣式`);
    }
}

//slider-輪播
function slider(){
    const track = document.querySelector('.slideTrack');
    const wraps  = document.querySelector('.sliderWrap');

    // 檢查元素是否存在
    if (!track || !wraps) {
        console.warn('找不到 .slideTrack 或 .sliderWrap 元素，跳過 slider 函式初始化。');
        return;
    }

    const origin = Array.from(track.children);

    /* 等圖片載入後初始化 */
    Promise.all(
        Array.from(track.querySelectorAll('img')).map(img =>
        img.complete ? Promise.resolve() :
        new Promise(res => (img.onload = img.onerror = res))
        )
    ).then(initializeSliderLogic);

    function initializeSliderLogic() {
        // 前後各複製一輪
        const prepend = origin.map(n => n.cloneNode(true));
        const append  = origin.map(n => n.cloneNode(true));
        prepend.reverse().forEach(n => track.insertBefore(n, track.firstChild));
        append.forEach(n => track.appendChild(n));

        // 計算一輪總寬度（含 margin）
        const getOneRoundWidth = () =>
        origin.reduce((sum, el) => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return sum + rect.width +
            parseFloat(style.marginLeft) +
            parseFloat(style.marginRight);
        }, 0);
        let oneRound = getOneRoundWidth();

        // 初始位移到中段（正確第一張）
        let offset = -oneRound;
        track.style.transform = `translateX(${offset}px)`;

        // 動態速度：畫面寬度越大越快
        const calcSpeed = () => {
        const w = window.innerWidth;
        return w < MOBILE_BREAKPOINT
            ? 50
            // : Math.min(100, 50 + (w - MOBILE_BREAKPOINT) * 0.2); 
            : Math.min(50, 25 + (w - MOBILE_BREAKPOINT) * 0.1); 
        };
        let speed = calcSpeed();
        window.addEventListener('resize', () => {
        speed = calcSpeed();
        oneRound = getOneRoundWidth(); // 縮放時重新計算寬度
        });

        // 主動畫
        let last = performance.now();
        function raf(now) {
        const dt = now - last;
        last = now;
        offset -= speed * dt / 1000;

        if (offset <= -oneRound * 2) offset += oneRound;
        if (offset >= 0) offset -= oneRound;

        track.style.transform = `translateX(${offset}px)`;
        requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
}

//shop-選單控制 (清理版本)
function initShopMenu(root=document){
    // 清理舊的事件監聽器
    const buttons = root.querySelectorAll('.categoryToggleBtn');
    buttons.forEach(button => {
        // 克隆按鈕來移除所有舊的事件監聽器
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // 重新獲取按鈕（因為上面已經替換了）
    const refreshedButtons = root.querySelectorAll('.categoryToggleBtn');
    refreshedButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parentItem = this.closest('.filterCategoryItem');
            const submenu = parentItem?.querySelector('.subMenu');
            const arrowIcon = this.querySelector('.arrowIcon');
            
            if (!parentItem || !submenu || !arrowIcon) {
                return;
            }
    
            // 切換 active class，控制顯示/隱藏
            parentItem.classList.toggle('active');
            const isActive = parentItem.classList.contains('active');
    
            // 同時旋轉箭頭圖標
            if (isActive) {
                submenu.style.maxHeight = submenu.scrollHeight + "px";
                arrowIcon.style.transform = 'rotate(180deg)';
            } else {
                submenu.style.maxHeight = '0';
                arrowIcon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

//shop-手機版將 sidebarFilters 複製進 menuList (清理版本)
function handleSidebarClone() {
    
    const sidebar  = document.querySelector('.sidebarFilters');
    const menuList = document.querySelector('.menuList');
    
    if (!sidebar || !menuList) {
        return;
    }
    
    const existing = menuList.querySelector('.mobile-cloned-sidebar');
    
    if (window.innerWidth < MOBILE_BREAKPOINT) {
        if (!existing) {
            const clone = sidebar.cloneNode(true);
            clone.classList.add('mobile-cloned-sidebar');
            menuList.appendChild(clone);
            
            setTimeout(() => {
                initShopMenu(clone);
            }, 100);
        }
    } else {
        existing?.remove();
    }
}

//shop-愛心收藏點擊
function initWishlist(){
    const container = document.querySelector('.productCardList');
    if (!container) {
        console.warn('找不到 .productCardList 元素，跳過 initWishlist 函式初始化。');
        return;
    }

    container.addEventListener('click', (e) => {
        const heartSpan = e.target.closest('.heart');
        if (!heartSpan) {
            // console.log('Click was not on a .heart element.'); // 除錯用
            return;
        }

        const icon = heartSpan.querySelector('i');
        if (!icon) {
            // console.log('No <i> element found inside .heart span.'); // 除錯用
            return;
        }
        // console.log('Toggling heart icon classes for:', icon); // 除錯用
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    });
}

//product-商品數量加減
function initQuantityControls() {
    const amountInput = document.getElementById('amount');
    const minus = document.querySelector('.minus');
    const plus = document.querySelector('.plus');
    
    if (amountInput && minus && plus) {
        minus.addEventListener('click', () => {
            let currentValue = parseInt(amountInput.value);
            if (currentValue > parseInt(amountInput.min)) {
                amountInput.value = currentValue - 1;
            }
        });

        plus.addEventListener('click', () => {
            let currentValue = parseInt(amountInput.value);
            if (currentValue < parseInt(amountInput.max)) {
                amountInput.value = currentValue + 1;
            }
        });
    }
}

//product-點小圖變大圖
function changeImg(){
    // 選取主圖的容器 div，現在 ID 在這裡
    const mainImageContainer = document.getElementById('mainImageContainer'); // 使用新的 ID

    // 選取所有包含縮圖的 div.imageShrink 容器
    const imageShrinkDivs = document.querySelectorAll('.imageShrinkList .imageShrink');

    if (!mainImageContainer || imageShrinkDivs.length === 0) {
        console.warn('找不到主圖容器(.mainImageContainer)或縮圖容器(.imageShrinkDivs)元素，跳過 changeImg 函式初始化。');
        return;
    }

    // 獲取 mainImageContainer 內部的 img 元素
    const mainProductImage = mainImageContainer.querySelector('img');

    // --- 初始高亮第一個縮圖 ---
    // 確保第一個縮圖容器在頁面載入時就有高亮效果
    if (imageShrinkDivs.length > 0) {
        imageShrinkDivs[0].classList.add('active-thumbnail');
    }

    // --- 為每個縮圖容器添加點擊事件監聽器 ---
    imageShrinkDivs.forEach(shrinkDiv => {
        shrinkDiv.addEventListener('click', function() {
            // 移除所有縮圖容器上的 'active-thumbnail' class
            imageShrinkDivs.forEach(div => {
                div.classList.remove('active-thumbnail');
            });

            // 為當前被點擊的縮圖容器添加 'active-thumbnail' class
            this.classList.add('active-thumbnail');

            // 獲取被點擊的縮圖容器內的 img 元素的 src
            const clickedImgSrc = this.querySelector('img').src;

            // 將該 src 賦予給主圖的 src 屬性
            mainProductImage.src = clickedImgSrc;
        });
    });
}

//cart-數量金額加總
function cartSumTotal(){
     // 獲取所有商品卡片
    const cartCards = document.querySelectorAll('.cartCard');

    // 獲取總計相關元素
    const subtotalSpan = document.getElementById('subTotal'); // 注意這裡的 ID 是 subTotal
    const deliveryFeeSpan = document.getElementById('deliveryFee'); // 注意這裡的 ID 是 deliveryFee
    const discountSpan = document.getElementById('discount');
    const cartSumTotalSpan = document.getElementById('cartSumTotal'); // 注意這裡的 ID 是 cartSumTotal

    // 固定費用（運費和折扣）
    // 從 HTML 獲取並轉換為數字，如果內容不是有效數字則默認為 0
    const DELIVERY_FEE = parseFloat(deliveryFeeSpan.textContent) || 0;
    const DISCOUNT = parseFloat(discountSpan.textContent) || 0;

    /**
     * 計算單個商品的小計並更新顯示
     * @param {HTMLElement} cartCard - 當前操作的商品卡片元素
     * @returns {number} 返回這個商品計算後的小計金額
     */
    function updateItemSubtotal(cartCard) {
        // 在當前 cartCard 內部查找元素，確保操作的是當前商品
        const priceElement = cartCard.querySelector('.cartItemPrice');
        const amountInput = cartCard.querySelector('.amountInput'); // 使用 class="amountInput"
        const itemAmountResult = cartCard.querySelector('.itemAmountResult');

        // 確保找到所有必要的元素
        if (!priceElement || !amountInput || !itemAmountResult) {
            console.warn('Warning: Missing elements for item subtotal calculation in a cartCard.', cartCard);
            return 0; // 如果找不到元素，返回 0 避免錯誤
        }

        // 從 data-price 屬性獲取商品單價
        const price = parseFloat(priceElement.dataset.price); 
        let quantity = parseInt(amountInput.value);

        // 確保數量是有效數字且在 min/max 範圍內
        const min = parseInt(amountInput.min) || 1; // 默認最小數量為 1
        const max = parseInt(amountInput.max) || Infinity; // 默認最大數量為無限

        if (isNaN(quantity) || quantity < min) {
            quantity = min;
        } else if (quantity > max) {
            quantity = max;
        }
        amountInput.value = quantity; // 將修正後的數量回寫到輸入框

        const subtotal = price * quantity;
        itemAmountResult.textContent = subtotal.toLocaleString(); // 格式化小計顯示

        return subtotal; // 返回計算後的小計
    }

    /**
     * 計算所有商品的小計總和，並更新最終合計區塊
     */
    function updateCartSummary() {
        let currentProductsSubtotal = 0;

        // 遍歷所有商品卡片，累加每個商品的小計
        cartCards.forEach(cartCard => {
            currentProductsSubtotal += updateItemSubtotal(cartCard);
        });

        // 更新 "商品金額" (Subtotal)
        subtotalSpan.textContent = currentProductsSubtotal.toLocaleString();

        // 計算最終 "合計" (Total Amount)
        // 注意：這裡的運費和折扣是從 HTML 中獲取的，並且可能為負值（折扣）
        let finalTotal = currentProductsSubtotal + DELIVERY_FEE + DISCOUNT;
        
        // 更新最終總計顯示
        cartSumTotalSpan.textContent = `NT ${finalTotal.toLocaleString()}`;
    }

    // 為每個商品卡片綁定事件監聽器
    cartCards.forEach(cartCard => {
        const minusBtn = cartCard.querySelector('.minus');
        const plusBtn = cartCard.querySelector('.plus');
        const amountInput = cartCard.querySelector('.amountInput'); // 使用 class="amountInput"

        // 確保找到所有按鈕和輸入框
        if (minusBtn && plusBtn && amountInput) {
            // 減少按鈕的點擊事件
            minusBtn.addEventListener('click', () => {
                let currentValue = parseInt(amountInput.value);
                if (currentValue > parseInt(amountInput.min)) {
                    amountInput.value = currentValue - 1;
                    updateCartSummary(); // 數量改變後更新所有總計
                }
            });

            // 增加按鈕的點擊事件
            plusBtn.addEventListener('click', () => {
                let currentValue = parseInt(amountInput.value);
                if (currentValue < parseInt(amountInput.max)) {
                    amountInput.value = currentValue + 1;
                    updateCartSummary(); // 數量改變後更新所有總計
                }
            });

            // 數量輸入框的值改變事件（用戶直接輸入）
            amountInput.addEventListener('change', () => {
                // 當用戶直接輸入時，也需要驗證並更新
                updateCartSummary(); // 數量改變後更新所有總計
            });
        }
    });

    // 頁面首次載入時，執行一次總計更新，確保初始值正確
    updateCartSummary();

}




//==========初始化==========
function init() {
   // Header/Banner/Slider
    hamburger();
    search();
    toggleHeader();
    handleBannerScale();
    slider();

    // Shop 相關
    handleSidebarClone();  
    initShopMenu();
    initWishlist();         
    initQuantityControls(); 
    changeImg();

    cartSumTotal();  
    // initShopMenuAdvancedDebug();
    // handleSidebarCloneAdvancedDebug();
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('resize', () => {
    handleBannerScale();
    handleSidebarClone();  
});



// 進階除錯版本 - 檢查點擊事件和 CSS 問題
function initShopMenuAdvancedDebug(root=document){
    console.log('=== 進階除錯開始 ===');
    console.log('initShopMenu 被調用，root:', root);
    
    const buttons = root.querySelectorAll('.categoryToggleBtn');
    console.log(`找到 ${buttons.length} 個 .categoryToggleBtn 按鈕`);
    
    buttons.forEach((button, index) => {
        console.log(`正在檢查按鈕 ${index}:`, button);
        
        // 檢查按鈕的樣式和位置
        const rect = button.getBoundingClientRect();
        const style = window.getComputedStyle(button);
        
        console.log(`按鈕 ${index} 位置:`, {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            pointerEvents: style.pointerEvents,
            zIndex: style.zIndex,
            position: style.position,
            display: style.display,
            visibility: style.visibility
        });
        
        // 綁定多種事件來測試
        ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend'].forEach(eventType => {
            button.addEventListener(eventType, function(e) {
                console.log(`🎯 ${eventType} 事件被觸發！按鈕 ${index}`, this);
                
                if (eventType === 'click') {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const parentItem = this.closest('.filterCategoryItem');
                    const submenu = parentItem?.querySelector('.subMenu');
                    const arrowIcon = this.querySelector('.arrowIcon');
                    
                    console.log('DOM 元素檢查:', {
                        parentItem: parentItem,
                        submenu: submenu,
                        arrowIcon: arrowIcon
                    });
                    
                    if (parentItem && submenu && arrowIcon) {
                        parentItem.classList.toggle('active');
                        const isActive = parentItem.classList.contains('active');
                        
                        console.log(`切換 active 狀態: ${isActive}`);
                        
                        if (isActive) {
                            submenu.style.maxHeight = submenu.scrollHeight + "px";
                            arrowIcon.style.transform = 'rotate(180deg)';
                            console.log('展開選單，maxHeight:', submenu.scrollHeight + 'px');
                        } else {
                            submenu.style.maxHeight = '0';
                            arrowIcon.style.transform = 'rotate(0deg)';
                            console.log('收合選單');
                        }
                    } else {
                        console.error('❌ 找不到必要的 DOM 元素');
                    }
                }
            });
        });
        
        // 檢查是否有其他元素覆蓋
        button.addEventListener('mouseenter', function() {
            console.log(`🖱️ 滑鼠進入按鈕 ${index}`);
            this.style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; // 暫時變紅色
        });
        
        button.addEventListener('mouseleave', function() {
            console.log(`🖱️ 滑鼠離開按鈕 ${index}`);
            this.style.backgroundColor = ''; // 恢復原色
        });
    });
    
    // 檢查整個 root 區域的點擊事件
    root.addEventListener('click', function(e) {
        console.log('🔍 root 區域被點擊，目標元素:', e.target);
        console.log('🔍 點擊的元素類名:', e.target.className);
        console.log('🔍 是否點擊到 categoryToggleBtn:', e.target.closest('.categoryToggleBtn'));
    });
    
    console.log('=== 進階除錯完成 ===');
}

// // 同時也檢查 handleSidebarClone 的問題
function handleSidebarCloneAdvancedDebug() {
    console.log('=== 檢查 handleSidebarClone ===');
    
    const sidebar  = document.querySelector('.sidebarFilters');
    const menuList = document.querySelector('.menuList');
    
    console.log('sidebar 元素:', sidebar);
    console.log('menuList 元素:', menuList);
    
    if (!sidebar || !menuList) {
        console.error('❌ SidebarFilters 或 menuList 元素不存在');
        return;
    }
    
    const existing = menuList.querySelector('.mobile-cloned-sidebar');
    console.log('現有的複製元素:', existing);
    console.log('視窗寬度:', window.innerWidth);
    console.log('是否為手機版:', window.innerWidth < MOBILE_BREAKPOINT);
    
    if (window.innerWidth < MOBILE_BREAKPOINT) {
        if (!existing) {
            console.log('✅ 開始複製側邊欄');
            
            const clone = sidebar.cloneNode(true);
            clone.classList.add('mobile-cloned-sidebar');
            
            console.log('複製的元素:', clone);
            console.log('複製元素中的按鈕數量:', clone.querySelectorAll('.categoryToggleBtn').length);
            
            menuList.appendChild(clone);
            
            // 延遲初始化
            setTimeout(() => {
                console.log('⏰ 開始初始化複製的選單');
                initShopMenuAdvancedDebug(clone);
            }, 100);
            
        } else {
            console.log('ℹ️ 複製的側邊欄已存在');
        }
    } else {
        if (existing) {
            console.log('🖥️ 桌面版：移除複製的側邊欄');
            existing.remove();
        }
    }
}


